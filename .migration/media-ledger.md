# Media provenance ledger

Full per-item source metadata (IDs, original URLs, dimensions and WordPress variants) is preserved in `.migration/evidence/source-media.json`. All 150 original files are self-hosted under `public/client/akmendarba/source/` with their original filenames.

| Media group | Published path | Original source | Rights/consent | Original dimensions | Transformations | Responsive variants | Count | Status |
|---|---|---|---|---|---|---|---:|---|
| Brand marks | `/client/akmendarba/source/{logo.png,Logo-gradient-512x5125.png}` | Akmendarba public Media API | Public client source; production rights to confirm | 600×120; 512×512 | Self-hosted without visual alteration | Browser intrinsic sizing | 2 | ready for demo |
| Stone, quarry, production and slider imagery | `/client/akmendarba/source/` | Homepage media and public Media API | Public client source; production rights to confirm | See evidence JSON | Self-hosted without visual alteration | Browser intrinsic sizing | 12 | ready for demo |
| Company building | `/client/akmendarba/source/pastatas-2.jpg` | `/apie-mus/` | Public client source; production rights to confirm | 1200×900 | Self-hosted without visual alteration | Browser intrinsic sizing | 1 | ready for demo |
| Product/service representative images | `/client/akmendarba/source/` | Four product/service pages | Public client source; production rights to confirm | See evidence JSON | Self-hosted without visual alteration | Browser intrinsic sizing | 4 | ready for demo |
| Monument gallery | `/client/akmendarba/source/paminklas-{paprastas,keliu-daliu}-*.jpg` | `/galerija/paminklu-galerija/` | Public client source; production rights to confirm | See evidence JSON | Self-hosted without visual alteration | Browser intrinsic sizing | 80 | ready for demo |
| Grave-covering gallery | `/client/akmendarba/source/kapo-dengimas-*.jpg` | `/galerija/kapo-dengimu-galerija/` | Public client source; production rights to confirm | See evidence JSON | Self-hosted without visual alteration | Browser intrinsic sizing | 27 captured / 25 displayed | ready for demo |
| Accessory gallery | `/client/akmendarba/source/Aksesuarai-is-akmens-*.jpg` | `/galerija/aksesuaru-galerija/` | Public client source; production rights to confirm | See evidence JSON | Self-hosted without visual alteration | Browser intrinsic sizing | 19 | ready for demo |
| Finishing gallery | `/client/akmendarba/source/Marmuro-apdaila-*.jpg` | `/galerija/apdailos-galerija/` | Public client source; production rights to confirm | See evidence JSON | Self-hosted without visual alteration | Browser intrinsic sizing | 5 | ready for demo |
| New hero video | `/client/akmendarba/hero/akmendarba-granite-cutting-{desktop,mobile}-web-v1.m4v` | User-approved direction C; generated source frame and Higgsfield master retained in evidence | Approved for the private demo direction; production usage to confirm | Master 1920×1080 | Generated industrial granite-cutting scene; high-quality web transcodes, muted autoplay and loop | 1080p desktop / 720p mobile | 1 master + 2 delivery variants | ready for demo |

Count check: 2 + 12 + 1 + 4 + 80 + 27 + 19 + 5 = 150 captured source images. The generated hero source frame, master video and delivery variants are separate demo assets and are not included in the 150-image source count.
