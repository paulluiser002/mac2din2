import { animateEntrance } from "./entrance.ts";
export function initOpening(
  opening: HTMLElement,
  pageParts: HTMLElement[],
  bypass: boolean,
) {
  let stopCloth: (() => void) | undefined;
  let finished = false;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    stopCloth?.();
    opening.hidden = true;
    pageParts.forEach((part) => {
      part.inert = false;
    });
    const doc = opening.ownerDocument;
    doc.documentElement.dataset.unveiled = "true";
    doc.dispatchEvent(new doc.defaultView!.Event("showroom:unveiled"));
  };
  const alreadyFinished =
    opening.ownerDocument.defaultView?.getComputedStyle(opening).visibility ===
    "hidden";
  if (bypass || alreadyFinished) {
    finish();
    return finish;
  }
  pageParts.forEach((part) => {
    part.inert = true;
  });
  opening
    .querySelector("button")
    ?.addEventListener("click", finish, { once: true });
  opening.addEventListener("animationend", (event) => {
    if (event.target === opening) finish();
  });
  const canvas = opening.querySelector<HTMLCanvasElement>("canvas");
  if (canvas) stopCloth = animateEntrance(canvas, finish);
  // A stalled animation must never leave the site's keyboard navigation locked.
  timeout = setTimeout(finish, 3400);
  return finish;
}
