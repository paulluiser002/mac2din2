export function initCarousel(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('[data-track]');
  const slides = [...root.querySelectorAll<HTMLElement>('[data-slide]')];
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-next]');
  const count = root.querySelector<HTMLElement>('[data-count]');
  if (!track || !prev || !next || !count) return () => {};
  let current = 0;
  const origin = () => slides[0]?.offsetLeft ?? 0;
  const update = () => {
    const left = track.scrollLeft;
    current = slides.reduce((nearest, slide, index) => Math.abs(slide.offsetLeft - origin() - left) < Math.abs(slides[nearest].offsetLeft - origin() - left) ? index : nearest, 0);
    prev.disabled = current === 0 || slides.length < 2;
    next.disabled = current === slides.length - 1 || slides.length < 2;
    count.textContent = `${slides.length ? current + 1 : 0} / ${slides.length}`;
  };
  const move = (direction: number) => {
    const index = Math.max(0, Math.min(slides.length - 1, current + direction));
    if (!slides[index]) return;
    const reduced = root.ownerDocument.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: slides[index].offsetLeft - origin(), behavior: reduced ? 'instant' : 'smooth' });
  };
  const previous = () => move(-1);
  const following = () => move(1);
  prev.addEventListener('click', previous);
  next.addEventListener('click', following);
  track.addEventListener('scroll', update, { passive: true });
  const view = root.ownerDocument.defaultView;
  view?.addEventListener('resize', update);
  update();
  return () => { prev.removeEventListener('click', previous); next.removeEventListener('click', following); track.removeEventListener('scroll', update); view?.removeEventListener('resize', update); };
}
