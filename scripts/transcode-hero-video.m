#import <AVFoundation/AVFoundation.h>
#import <CoreMedia/CoreMedia.h>
#import <CoreVideo/CoreVideo.h>
#import <Foundation/Foundation.h>

int main(int argc, const char *argv[]) {
  @autoreleasepool {
    if (argc != 4) {
      fprintf(stderr, "Usage: transcode-hero-video <input> <output.mp4> <bitrate-kbps>\n");
      return 2;
    }

    NSString *inputPath = [NSString stringWithUTF8String:argv[1]];
    NSString *outputPath = [NSString stringWithUTF8String:argv[2]];
    NSInteger bitrateKbps = [[NSString stringWithUTF8String:argv[3]] integerValue];
    if (bitrateKbps < 1000) {
      fprintf(stderr, "Bitrate must be at least 1000 kbps.\n");
      return 2;
    }

    NSURL *inputURL = [NSURL fileURLWithPath:inputPath];
    NSURL *outputURL = [NSURL fileURLWithPath:outputPath];
    [[NSFileManager defaultManager] removeItemAtURL:outputURL error:nil];

    AVURLAsset *asset = [AVURLAsset URLAssetWithURL:inputURL options:nil];
    AVAssetTrack *videoTrack = [[asset tracksWithMediaType:AVMediaTypeVideo] firstObject];
    if (!videoTrack) {
      fprintf(stderr, "No video track found.\n");
      return 1;
    }

    NSError *error = nil;
    AVAssetReader *reader = [[AVAssetReader alloc] initWithAsset:asset error:&error];
    if (!reader) {
      fprintf(stderr, "%s\n", error.localizedDescription.UTF8String);
      return 1;
    }

    NSDictionary *readerSettings = @{
      (id)kCVPixelBufferPixelFormatTypeKey: @(kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange),
    };
    AVAssetReaderTrackOutput *readerOutput =
      [[AVAssetReaderTrackOutput alloc] initWithTrack:videoTrack outputSettings:readerSettings];
    readerOutput.alwaysCopiesSampleData = NO;
    if (![reader canAddOutput:readerOutput]) {
      fprintf(stderr, "Cannot decode the source video.\n");
      return 1;
    }
    [reader addOutput:readerOutput];

    AVAssetWriter *writer = [[AVAssetWriter alloc] initWithURL:outputURL
                                                     fileType:AVFileTypeMPEG4
                                                        error:&error];
    if (!writer) {
      fprintf(stderr, "%s\n", error.localizedDescription.UTF8String);
      return 1;
    }
    writer.shouldOptimizeForNetworkUse = YES;

    CGSize size = videoTrack.naturalSize;
    NSInteger frameRate = MAX(1, lround(videoTrack.nominalFrameRate));
    NSDictionary *compression = @{
      AVVideoAverageBitRateKey: @(bitrateKbps * 1000),
      AVVideoExpectedSourceFrameRateKey: @(frameRate),
      AVVideoMaxKeyFrameIntervalKey: @(frameRate * 2),
      AVVideoAllowFrameReorderingKey: @YES,
      AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    };
    NSDictionary *color = @{
      AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2,
      AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2,
      AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2,
    };
    NSDictionary *writerSettings = @{
      AVVideoCodecKey: AVVideoCodecTypeH264,
      AVVideoWidthKey: @(lround(size.width)),
      AVVideoHeightKey: @(lround(size.height)),
      AVVideoCompressionPropertiesKey: compression,
      AVVideoColorPropertiesKey: color,
    };

    AVAssetWriterInput *writerInput =
      [AVAssetWriterInput assetWriterInputWithMediaType:AVMediaTypeVideo outputSettings:writerSettings];
    writerInput.expectsMediaDataInRealTime = NO;
    writerInput.transform = videoTrack.preferredTransform;
    if (![writer canAddInput:writerInput]) {
      fprintf(stderr, "Cannot configure the H.264 writer.\n");
      return 1;
    }
    [writer addInput:writerInput];

    if (![reader startReading] || ![writer startWriting]) {
      fprintf(stderr, "Unable to start transcoding.\n");
      return 1;
    }
    [writer startSessionAtSourceTime:kCMTimeZero];

    dispatch_semaphore_t finished = dispatch_semaphore_create(0);
    dispatch_queue_t queue = dispatch_queue_create("lt.granitdecor.hero-transcode", DISPATCH_QUEUE_SERIAL);
    __block BOOL failed = NO;

    [writerInput requestMediaDataWhenReadyOnQueue:queue usingBlock:^{
      while (writerInput.readyForMoreMediaData) {
        CMSampleBufferRef sample = [readerOutput copyNextSampleBuffer];
        if (sample) {
          if (![writerInput appendSampleBuffer:sample]) {
            failed = YES;
            CFRelease(sample);
            [reader cancelReading];
            [writerInput markAsFinished];
            [writer cancelWriting];
            dispatch_semaphore_signal(finished);
            return;
          }
          CFRelease(sample);
          continue;
        }

        [writerInput markAsFinished];
        if (reader.status == AVAssetReaderStatusCompleted) {
          [writer finishWritingWithCompletionHandler:^{
            if (writer.status != AVAssetWriterStatusCompleted) failed = YES;
            dispatch_semaphore_signal(finished);
          }];
        } else {
          failed = YES;
          [writer cancelWriting];
          dispatch_semaphore_signal(finished);
        }
        return;
      }
    }];

    dispatch_semaphore_wait(finished, DISPATCH_TIME_FOREVER);
    if (failed) {
      NSString *message = writer.error.localizedDescription ?: reader.error.localizedDescription ?: @"Unknown error";
      fprintf(stderr, "%s\n", message.UTF8String);
      return 1;
    }

    NSDictionary *attributes = [[NSFileManager defaultManager] attributesOfItemAtPath:outputPath error:&error];
    double megabytes = [attributes fileSize] / (1024.0 * 1024.0);
    printf("Created %s (%.2f MB, %ld kbps target)\n", outputPath.UTF8String, megabytes, (long)bitrateKbps);
  }
  return 0;
}
