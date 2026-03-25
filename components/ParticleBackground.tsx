"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

// variant: "expanded" for landing page (sparse, wide mesh), "default" for settings
export default function ParticleBackground({ variant = "default" }: { variant?: "expanded" | "default" }) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  const isExpanded = variant === "expanded";

  return (
    <Particles
      id={`tsparticles-${variant}`}
      className="absolute inset-0 w-full h-full -z-0 pointer-events-auto"
      options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        smooth: true,
        interactivity: {
          events: {
            onHover: { enable: true, mode: "grab" },
          },
          modes: {
            grab: {
              distance: isExpanded ? 180 : 140,
              links: { opacity: isExpanded ? 0.45 : 0.35 },
            },
            repulse: {
              distance: 120,
              duration: 0.6,
              easing: "ease-out-quad",
            },
          },
        },
        particles: {
          color: { value: "#ccff00" },
          links: {
            color: "#ccff00",
            distance: isExpanded ? 170 : 130,
            enable: true,
            opacity: isExpanded ? 0.18 : 0.2,
            width: isExpanded ? 0.9 : 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" },
            random: true,
            speed: isExpanded ? 0.4 : 0.6,
            straight: false,
            attract: { enable: true, rotate: { x: 600, y: 1200 } },
          },
          number: {
            density: { enable: true, width: isExpanded ? 1100 : 800, height: isExpanded ? 1100 : 800 },
            value: isExpanded ? 110 : 130,
          },
          opacity: {
            value: { min: 0.3, max: isExpanded ? 0.65 : 0.6 },
            animation: { enable: true, speed: 0.5, sync: false },
          },
          shape: { type: "circle" },
          size: { value: { min: 1, max: isExpanded ? 2 : 2.5 } },
        },
        detectRetina: true,
      }}
    />
  );
}
