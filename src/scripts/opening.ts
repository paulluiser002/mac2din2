export function initOpening(opening: HTMLElement, pageParts: HTMLElement[], bypass: boolean) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const finish = () => {
    clearTimeout(timeout);
    opening.hidden = true;
    pageParts.forEach(part => { part.inert = false; });
  };
  if (bypass) { finish(); return finish; }
  pageParts.forEach(part => { part.inert = true; });
  opening.querySelector('button')?.addEventListener('click', finish, { once: true });
  opening.addEventListener('animationend', event => { if (event.target === opening) finish(); });
  // A stalled animation must never leave the site's keyboard navigation locked.
  timeout = setTimeout(finish, 3400);
  return finish;
}
