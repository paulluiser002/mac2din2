import sharp from "sharp";
import { mkdir, readFile, mkdtemp, rm, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir, homedir } from "node:os";
import { join } from "node:path";

// Source originals stay outside git; generated web assets are committed for deployment.
const sourceRoot =
  process.env.MAC2DIN2_MEDIA_ROOT ?? join(homedir(), "Downloads");
const media = JSON.parse(await readFile("src/data/media.json", "utf8"));
const scratch = await mkdtemp(join(tmpdir(), "mac2din2-media-"));
await mkdir("public/media", { recursive: true });
try {
  for (const item of media) {
    const [set, filename] = item.source.split("/");
    const source = join(sourceRoot, `Mac2Din2 ${set}`, filename);
    await stat(source);
    let input = source;
    if (item.kind === "video") {
      execFileSync("ffmpeg", [
        "-loglevel",
        "error",
        "-i",
        source,
        "-map",
        "0:v:0",
        "-an",
        "-vf",
        "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "21",
        "-pix_fmt",
        "yuv420p",
        "-r",
        "30",
        "-movflags",
        "+faststart",
        "-map_metadata",
        "-1",
        `public/media/${item.id}.mp4`,
        "-y",
      ]);
      input = join(scratch, `${item.id}.jpg`);
      execFileSync("ffmpeg", [
        "-loglevel",
        "error",
        "-ss",
        "1",
        "-i",
        source,
        "-frames:v",
        "1",
        "-vf",
        "scale=720:-2",
        input,
        "-y",
      ]);
      await sharp(input)
        .rotate()
        .resize(720, 1280, { fit: "cover" })
        .webp({ quality: 85 })
        .toFile(`public/media/${item.id}-poster.webp`);
      continue;
    }
    if (source.endsWith(".HEIC")) {
      input = join(scratch, `${item.id}.jpg`);
      execFileSync(
        "sips",
        [
          "-s",
          "format",
          "jpeg",
          "-s",
          "formatOptions",
          "90",
          "-Z",
          "2000",
          source,
          "--out",
          input,
        ],
        { stdio: "ignore" },
      );
    }
    const widths =
      item.group === "feature" ? [640, 1280, 1600] : [480, 960, 1440];
    const ratio = item.width / item.height;
    for (const width of widths)
      await sharp(input)
        .rotate()
        .resize(width, Math.round(width / ratio), {
          fit: "cover",
          position: ["spaces-24", "spaces-26"].includes(item.id)
            ? "right top"
            : "centre",
        })
        .sharpen({ sigma: 0.45, m1: 0.25, m2: 1 })
        .webp({ quality: 86, effort: 5 })
        .toFile(`public/media/${item.id}-${width}.webp`);
  }
  await sharp("assets/scene/garden-landscape.png")
    .resize(1600, 1100, { fit: "cover" })
    .webp({ quality: 87 })
    .toFile("public/media/window-garden.webp");
  console.log(
    `Prepared ${media.length} unique media sources and the illustrative window outlook.`,
  );
} finally {
  await rm(scratch, { recursive: true, force: true });
}
