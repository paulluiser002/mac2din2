import { gsap } from 'gsap';

export function resetStoryText(intro: HTMLElement, story: HTMLElement) {
  gsap.killTweensOf([intro, story]);
  gsap.set([intro, story], { clearProps: 'all' });
  intro.inert = false;
  story.setAttribute('aria-hidden', 'true');
}
