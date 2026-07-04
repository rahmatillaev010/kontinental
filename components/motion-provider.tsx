"use client";

import { useEffect } from "react";

export function MotionProvider() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".scroll-reveal, .scroll-stagger, .cinema-scene"));
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));

    if (reduceMotion) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    targets.forEach((target) => observer.observe(target));

    const sceneObserver = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (!active) return;

        const sceneId = (active.target as HTMLElement).dataset.scene;
        if (!sceneId) return;

        scenes.forEach((scene) => scene.classList.toggle("is-scene-active", scene.dataset.scene === sceneId));
        document.querySelectorAll<HTMLElement>("[data-scene-dot]").forEach((dot) => {
          dot.classList.toggle("is-active", dot.dataset.sceneDot === sceneId);
        });
      },
      {
        threshold: [0.34, 0.5, 0.68],
        rootMargin: "-18% 0px -24% 0px"
      }
    );

    scenes.forEach((scene) => sceneObserver.observe(scene));

    return () => {
      observer.disconnect();
      sceneObserver.disconnect();
    };
  }, []);

  return null;
}
