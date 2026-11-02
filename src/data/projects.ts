import media from "./media.json" with { type: "json" };
export type Media = (typeof media)[number];
export const photographs = media.filter((item) => item.kind === "image");
export const films = media.filter((item) => item.kind === "video");
export const gallery = (group: string) =>
  media.filter((item) => item.group === group);
export function imageSet(id: string) {
  const widths = id.startsWith("feature")
    ? [640, 1280, 1600]
    : [480, 960, 1440];
  return widths
    .map((width) => `/media/${id}-${width}.webp ${width}w`)
    .join(", ");
}
