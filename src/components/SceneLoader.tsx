import { useEffect, useState, type ComponentType } from "react";
import { allowsMotion } from "../scripts/motion";

export default function SceneLoader() {
  const [Scene, setScene] = useState<ComponentType | null>(null);
  useEffect(() => {
    let active = true,
      loading = false;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData,
    );
    const load = async () => {
      if (
        loading ||
        !document.documentElement.dataset.unveiled ||
        !allowsMotion(motion.matches, saveData)
      )
        return;
      loading = true;
      try {
        const module = await import("./Showroom");
        if (active) setScene(() => module.default);
      } catch {
        /* The HTML window stays visible if the optional room cannot load. */
      }
    };
    void load();
    document.addEventListener("showroom:unveiled", load);
    motion.addEventListener("change", load);
    return () => {
      active = false;
      document.removeEventListener("showroom:unveiled", load);
      motion.removeEventListener("change", load);
    };
  }, []);
  return Scene ? <Scene /> : null;
}
