# November 2026 showroom media

The website uses 13 distinct photographs and 3 distinct walkthroughs selected from the user's **Mac2Din2 Mediaset 1** and **Mac2Din2 Mediaset 2**. The actual brand logo is retained. None of the previous Instagram installation photographs is referenced or shipped in public/images.

Originals remain untouched in Downloads. `src/data/media.json` is the web content manifest; the companion manifest here records source filenames, original size, descriptions and grouping. Of 57 source files, 16 are used. This tighter selection follows the user’s request to remove similar images and overlapping video takes. Omitted: near-identical photographs/takes, the kitchen-only clip, a shrine photograph whose main subject is not the curtains, and an exterior shot with fingers over the lens. No watermark overlays were found on the chosen photos or sampled video frames, so no generative removal was needed.

All final crops were visually inspected. Portrait photographs use 4:5, panoramic photographs 3:2, films 9:16. Narrow bathroom curtains retain their full window with a right-biased crop. Responsive WebP at 480/960/1440 (feature photo 640/1280/1600), quality 86, mild sharpening. No generated installation detail. Original camera orientation is applied before cropping; image metadata is stripped. MP4: H.264, 720×1280, CRF21, 30 fps, no audio, yuv420p, faststart. Files are approximately 1–3 MB. Poster frames are not separate installation photographs.

Rebuild with `npm run assets` on macOS with ffmpeg, sips and the original folders available. Override their parent directory using MAC2DIN2_MEDIA_ROOT. Deployment uses the committed derivatives and does not run this script. Git history retains the earlier imagery; source files in Downloads are never modified by the pipeline.

The final window garden is generated illustrative scenery, separate from actual installation media, and deliberately contains no house. The temporary landscape-film request was withdrawn; the final videos retain consistent 9:16 portrait proportions.

The films use independent cards, never carousel clones. Photographs use two looping galleries with large image-edge arrows. No source media is repeated as another editorial photograph.
