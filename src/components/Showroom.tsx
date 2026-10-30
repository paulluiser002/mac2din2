import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFShadowMap } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Room, { type RoomState } from '../scene/Room';
import type { Fabric, ViewMode } from '../scene/pose';

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function Showroom() {
  const [enabled, setEnabled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const room = useRef<RoomState>({ progress: 0, mode: 'scroll', fabric: 'stone', active: true, onSlow: () => setEnabled(false) });
  const cleanup = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.getElementById('showroom')!;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = matchMedia('(max-width: 700px)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const apply = () => { setEnabled(!motion.matches && !connection?.saveData); setMobile(narrow.matches); };
    apply();
    motion.addEventListener('change', apply);
    narrow.addEventListener('change', apply);
    return () => { cleanup.current(); motion.removeEventListener('change', apply); narrow.removeEventListener('change', apply); root.classList.remove('scene-ready', 'motion-enabled'); };
  }, []);

  useEffect(() => {
    if (enabled) return;
    cleanup.current();
    const root = document.getElementById('showroom');
    root?.classList.remove('scene-ready', 'motion-enabled');
    document.getElementById('room-controls')?.setAttribute('hidden', '');
  }, [enabled]);

  function ready(canvas: HTMLCanvasElement) {
    cleanup.current();
    const root = document.getElementById('showroom')!;
    const intro = root.querySelector<HTMLElement>('.hero-intro')!;
    const story = root.querySelector<HTMLElement>('.hero-story')!;
    const caption = document.getElementById('scene-caption')!;
    const controls = document.getElementById('room-controls')!;
    const lost = (event: Event) => { event.preventDefault(); setEnabled(false); };
    canvas.addEventListener('webglcontextlost', lost);
    root.classList.add('scene-ready', 'motion-enabled');
    caption.textContent = 'Illustrative room · Explore the light';
    controls.removeAttribute('hidden');
    gsap.registerPlugin(ScrollTrigger);
    let storyVisible = false;
    const trigger = ScrollTrigger.create({
      trigger: root, start: () => `top top+=${document.querySelector('.site-header')!.getBoundingClientRect().height}`, end: 'bottom bottom',
      onUpdate: self => {
        room.current.progress = self.progress;
        room.current.invalidate?.();
        const nextStory = self.progress > 0.42;
        if (nextStory !== storyVisible) {
          storyVisible = nextStory;
          gsap.to(intro, { opacity: nextStory ? 0 : 1, y: nextStory ? -20 : 0, duration: 0.4, overwrite: true, ease: 'power2.out', pointerEvents: nextStory ? 'none' : 'auto' });
          gsap.to(story, { opacity: nextStory ? 1 : 0, y: nextStory ? 0 : 20, duration: 0.5, overwrite: true, ease: 'power2.out' });
          story.setAttribute('aria-hidden', String(!nextStory));
          intro.inert = nextStory;
        }
      },
    });
    let intersecting = true;
    const setActive = () => { room.current.active = intersecting && !document.hidden; if (room.current.active) room.current.invalidate?.(); };
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; setActive(); });
    observer.observe(root);
    document.addEventListener('visibilitychange', setActive);
    const handlers: Array<() => void> = [];
    controls.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button => {
      const click = () => {
        room.current.mode = button.dataset.view as ViewMode;
        controls.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        room.current.invalidate?.();
      };
      button.addEventListener('click', click);
      handlers.push(() => button.removeEventListener('click', click));
    });
    controls.querySelectorAll<HTMLButtonElement>('[data-fabric]').forEach(button => {
      const click = () => {
        room.current.fabric = button.dataset.fabric as Fabric;
        controls.querySelectorAll<HTMLButtonElement>('[data-fabric]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        document.getElementById('fabric-name')!.textContent = `${room.current.fabric[0].toUpperCase()}${room.current.fabric.slice(1)}`;
        room.current.invalidate?.();
      };
      button.addEventListener('click', click);
      handlers.push(() => button.removeEventListener('click', click));
    });
    ScrollTrigger.refresh();
    cleanup.current = () => {
      trigger.kill(); observer.disconnect(); handlers.forEach(dispose => dispose());
      document.removeEventListener('visibilitychange', setActive);
      canvas.removeEventListener('webglcontextlost', lost);
      gsap.set([intro, story], { clearProps: 'all' });
      intro.inert = false; story.setAttribute('aria-hidden', 'true');
      root.classList.remove('scene-ready', 'motion-enabled');
      caption.textContent = 'Illustrative room';
      controls.setAttribute('hidden', '');
      cleanup.current = () => {};
    };
  }

  if (!enabled) return null;
  return <SceneBoundary onError={() => setEnabled(false)}>
    <Canvas frameloop="demand" shadows={{ type: PCFShadowMap }} dpr={[0.8, mobile ? 1.25 : 1.6]} camera={{ position: mobile ? [3.6, 3.7, 12.6] : [6.9, 3.45, 10.4], fov: mobile ? 38 : 37, near: 0.1, far: 60 }} gl={{ antialias: true, alpha: false, powerPreference: 'default', toneMapping: ACESFilmicToneMapping }} onCreated={({ gl }) => { gl.toneMappingExposure = 0.9; ready(gl.domElement); }} fallback={null}>
      <Room state={room} mobile={mobile} />
    </Canvas>
  </SceneBoundary>;
}
