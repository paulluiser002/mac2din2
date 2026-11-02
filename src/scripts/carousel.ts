export function initCarousel(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>("[data-track]");
  const originals = [...root.querySelectorAll<HTMLElement>("[data-slide]")];
  const prev = root.querySelector<HTMLButtonElement>("[data-prev]");
  const next = root.querySelector<HTMLButtonElement>("[data-next]");
  const count = root.querySelector<HTMLElement>("[data-count]");
  if (!track || !prev || !next || !count) return () => {};
  const total = originals.length;
  const view = root.ownerDocument.defaultView;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let index = 0;
  let pending: HTMLElement | undefined;
  const clone = (slide: HTMLElement, logical: number) => {
    const copy = slide.cloneNode(true) as HTMLElement;
    copy.dataset.clone = String(logical);
    copy.inert = true;
    copy.setAttribute("aria-hidden", "true");
    copy.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    return copy;
  };
  if (total > 1) {
    const before = root.ownerDocument.createDocumentFragment();
    const after = root.ownerDocument.createDocumentFragment();
    originals.forEach((slide, logical) => {
      before.append(clone(slide, logical));
      after.append(clone(slide, logical));
    });
    track.prepend(before);
    track.append(after);
  }
  const slides = [...track.querySelectorAll<HTMLElement>("[data-slide]")];
  const origin = () => slides[0]?.offsetLeft ?? 0;
  const offset = (slide: HTMLElement) => slide.offsetLeft - origin();
  const logical = (slide: HTMLElement) =>
    slide.dataset.clone === undefined
      ? originals.indexOf(slide)
      : Number(slide.dataset.clone);
  const nearest = () =>
    slides.reduce(
      (best, slide) =>
        Math.abs(offset(slide) - track.scrollLeft) <
        Math.abs(offset(best) - track.scrollLeft)
          ? slide
          : best,
      slides[0],
    );
  const display = () => {
    count.textContent = `${total ? index + 1 : 0} / ${total}`;
    prev.disabled = next.disabled = total < 2;
  };
  const settle = () => {
    clearTimeout(timer);
    const slide = nearest();
    pending = undefined;
    if (slide) {
      index = logical(slide);
      display();
    }
    if (slide?.dataset.clone !== undefined) {
      const remainder = track.scrollLeft - offset(slide);
      track.scrollTo({
        left: offset(originals[logical(slide)]) + remainder,
        behavior: "instant",
      });
    }
  };
  const update = () => {
    const slide = nearest();
    if (slide && !pending) index = logical(slide);
    display();
    clearTimeout(timer);
    timer = setTimeout(settle, 180);
  };
  const move = (direction: number) => {
    if (total < 2) return;
    clearTimeout(timer);
    const current = pending ?? nearest();
    let position = slides.indexOf(current) + direction;
    if (position < 0 || position >= slides.length) {
      const real = originals[logical(current)];
      track.scrollTo({ left: offset(real), behavior: "instant" });
      position = slides.indexOf(real) + direction;
    }
    const destination = slides[position];
    if (!destination) return;
    pending = destination;
    index = logical(destination);
    display();
    const reduced = view?.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    track.scrollTo({
      left: offset(destination),
      behavior: reduced ? "instant" : "smooth",
    });
  };
  const previous = () => move(-1),
    following = () => move(1);
  const keyboard = (event: KeyboardEvent) => {
    if (
      event.target !== track ||
      !["ArrowLeft", "ArrowRight"].includes(event.key)
    )
      return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1);
  };
  const interrupt = () => {
    pending = undefined;
    clearTimeout(timer);
  };
  const resize = () => {
    pending = undefined;
    if (originals[index])
      track.scrollTo({ left: offset(originals[index]), behavior: "instant" });
  };
  if (total > 1) resize();
  display();
  prev.addEventListener("click", previous);
  next.addEventListener("click", following);
  track.addEventListener("scroll", update, { passive: true });
  track.addEventListener("scrollend", settle);
  track.addEventListener("keydown", keyboard);
  track.addEventListener("pointerdown", interrupt);
  track.addEventListener("wheel", interrupt, { passive: true });
  view?.addEventListener("resize", resize);
  return () => {
    clearTimeout(timer);
    prev.removeEventListener("click", previous);
    next.removeEventListener("click", following);
    track.removeEventListener("scroll", update);
    track.removeEventListener("scrollend", settle);
    track.removeEventListener("keydown", keyboard);
    track.removeEventListener("pointerdown", interrupt);
    track.removeEventListener("wheel", interrupt);
    view?.removeEventListener("resize", resize);
    slides
      .filter((slide) => slide.dataset.clone !== undefined)
      .forEach((slide) => slide.remove());
  };
}
