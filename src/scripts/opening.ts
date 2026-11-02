export function initOpening(
  opening: HTMLElement,
  pageParts: HTMLElement[],
  bypass: boolean,
) {
  const doc = opening.ownerDocument;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let warmup: ReturnType<typeof setTimeout> | undefined;
  let finished = false,
    started = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    clearTimeout(warmup);
    doc.removeEventListener("showroom:ready", ready);
    doc.documentElement.classList.remove("intro-controlled", "room-intro");
    if (started) doc.documentElement.classList.add("intro-entered");
    opening.hidden = true;
    pageParts.forEach((part) => {
      part.inert = false;
    });
    doc.documentElement.dataset.unveiled = "true";
    doc.dispatchEvent(new doc.defaultView!.Event("showroom:unveiled"));
  };
  const reveal = (source: "room" | "fallback") => {
    if (finished || started) return;
    started = true;
    clearTimeout(warmup);
    clearTimeout(timeout);
    opening.dataset.revealSource = source;
    if (source === "room") doc.documentElement.classList.add("room-intro");
    opening.classList.add("revealing");
    timeout = setTimeout(finish, 2250);
  };
  function ready() {
    reveal("room");
  }
  const alreadyFinished =
    doc.defaultView?.getComputedStyle(opening).visibility === "hidden";
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
  const cssTime = opening.getAnimations?.()[0]?.currentTime;
  const cssAge = typeof cssTime === "number" ? cssTime : 0;
  // Late JavaScript keeps the already-running no-JS reveal instead of restarting it.
  if (cssAge > 350) {
    timeout = setTimeout(finish, Math.max(0, 3800 - cssAge));
    return finish;
  }
  doc.documentElement.classList.add("intro-controlled");
  doc.addEventListener("showroom:ready", ready);
  if (doc.documentElement.classList.contains("scene-ready")) ready();
  else warmup = setTimeout(() => reveal("fallback"), 1400);
  return finish;
}
