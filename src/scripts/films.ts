export function initFilm(root: HTMLElement, autoplay: boolean) {
  const video = root.querySelector<HTMLVideoElement>("video")!;
  const button = root.querySelector<HTMLButtonElement>("[data-play]")!;
  const document = root.ownerDocument;
  const view = document.defaultView!;
  let visible = false;
  let userPaused = false;
  let userStarted = false;
  let disposed = false;
  const label = () => {
    button.textContent = video.paused ? "Play film" : "Pause film";
    button.setAttribute(
      "aria-label",
      `${video.paused ? "Play" : "Pause"} ${video.getAttribute("aria-label") ?? "film"}`,
    );
  };
  const load = () => {
    if (!video.getAttribute("src")) {
      video.src = video.dataset.src!;
      video.load();
    }
  };
  const sync = () => {
    if (
      !disposed &&
      visible &&
      !document.hidden &&
      !userPaused &&
      (autoplay || userStarted)
    ) {
      load();
      video.play()?.catch(label);
    } else video.pause();
    label();
  };
  const click = () => {
    if (!video.paused) {
      userPaused = true;
      video.pause();
    } else {
      userPaused = false;
      userStarted = true;
      load();
      video.play()?.catch(label);
    }
    label();
  };
  const observer = new view.IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && autoplay) load();
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.55;
      sync();
    },
    { threshold: [0, 0.55, 1] },
  );
  observer.observe(root);
  button.addEventListener("click", click);
  video.addEventListener("play", label);
  video.addEventListener("pause", label);
  document.addEventListener("visibilitychange", sync);
  label();
  const dispose = () => {
    disposed = true;
    observer.disconnect();
    video.pause();
    button.removeEventListener("click", click);
    video.removeEventListener("play", label);
    video.removeEventListener("pause", label);
    document.removeEventListener("visibilitychange", sync);
  };
  return Object.assign(dispose, {
    setAutoplay(value: boolean) {
      autoplay = value;
      sync();
    },
  });
}
