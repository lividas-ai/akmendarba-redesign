#import <AppKit/AppKit.h>
#import <AVFoundation/AVFoundation.h>

int main(int argc, const char *argv[]) {
  @autoreleasepool {
    if (argc != 3) {
      fprintf(stderr, "Usage: video-frame-contact-sheet <input-video> <output-directory>\n");
      return 2;
    }

    NSString *inputPath = [NSString stringWithUTF8String:argv[1]];
    NSString *outputPath = [NSString stringWithUTF8String:argv[2]];
    NSError *directoryError = nil;
    [[NSFileManager defaultManager] createDirectoryAtPath:outputPath
                              withIntermediateDirectories:YES
                                               attributes:nil
                                                    error:&directoryError];
    if (directoryError) {
      fprintf(stderr, "%s\n", directoryError.localizedDescription.UTF8String);
      return 1;
    }

    AVURLAsset *asset = [AVURLAsset URLAssetWithURL:[NSURL fileURLWithPath:inputPath] options:nil];
    Float64 durationSeconds = CMTimeGetSeconds(asset.duration);
    AVAssetTrack *videoTrack = [[asset tracksWithMediaType:AVMediaTypeVideo] firstObject];
    NSArray<AVAssetTrack *> *audioTracks = [asset tracksWithMediaType:AVMediaTypeAudio];
    CGSize encodedSize = videoTrack.naturalSize;
    CGSize displaySize = CGSizeApplyAffineTransform(encodedSize, videoTrack.preferredTransform);
    printf("duration=%.3fs encoded=%.0fx%.0f display=%.0fx%.0f fps=%.3f bitrate=%.0fkbps audio=%ld\n",
           durationSeconds,
           encodedSize.width,
           encodedSize.height,
           fabs(displaySize.width),
           fabs(displaySize.height),
           videoTrack.nominalFrameRate,
           videoTrack.estimatedDataRate / 1000.0,
           (long)audioTracks.count);
    AVAssetImageGenerator *generator = [AVAssetImageGenerator assetImageGeneratorWithAsset:asset];
    generator.appliesPreferredTrackTransform = YES;
    generator.requestedTimeToleranceBefore = CMTimeMakeWithSeconds(0.02, 600);
    generator.requestedTimeToleranceAfter = CMTimeMakeWithSeconds(0.02, 600);

    const NSInteger sampleCount = 9;
    for (NSInteger index = 0; index < sampleCount; index++) {
      Float64 seconds = index == sampleCount - 1
        ? MAX(0, durationSeconds - (1.0 / MAX(1, videoTrack.nominalFrameRate)))
        : durationSeconds * (Float64)index / (Float64)(sampleCount - 1);
      NSError *imageError = nil;
      CGImageRef image = [generator copyCGImageAtTime:CMTimeMakeWithSeconds(seconds, 600)
                                           actualTime:NULL
                                                error:&imageError];
      if (!image) {
        fprintf(stderr, "%s\n", imageError.localizedDescription.UTF8String);
        return 1;
      }

      NSBitmapImageRep *bitmap = [[NSBitmapImageRep alloc] initWithCGImage:image];
      CGImageRelease(image);
      NSData *data = [bitmap representationUsingType:NSBitmapImageFileTypeJPEG
                                          properties:@{NSImageCompressionFactor: @0.86}];
      NSString *fileName = [NSString stringWithFormat:@"frame-%02ld-%05.2f.jpg", (long)index, seconds];
      NSString *filePath = [outputPath stringByAppendingPathComponent:fileName];
      if (![data writeToFile:filePath options:NSDataWritingAtomic error:&imageError]) {
        fprintf(stderr, "%s\n", imageError.localizedDescription.UTF8String);
        return 1;
      }
      printf("%s\n", filePath.UTF8String);
    }
  }
  return 0;
}
