import React from "react";
import { Series } from "remotion";
import { SceneIntro } from "./components/SceneIntro";
import { SceneDiscovery } from "./components/SceneDiscovery";
import { SceneCatalog } from "./components/SceneCatalog";
import { SceneProduct } from "./components/SceneProduct";
import { SceneCart } from "./components/SceneCart";
import { SceneCheckout } from "./components/SceneCheckout";
import { SceneTracking } from "./components/SceneTracking";
import { ScenePanel } from "./components/ScenePanel";
import { SceneOperations } from "./components/SceneOperations";
import { SceneOutro } from "./components/SceneOutro";

export const ProductShowcase: React.FC = () => {
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: "#000000",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <Series>
        {/* Escena 01 — Intro (8.0s) */}
        <Series.Sequence durationInFrames={240}>
          <SceneIntro />
        </Series.Sequence>

        {/* Escena 02 — Descubrimiento (8.0s) */}
        <Series.Sequence durationInFrames={240}>
          <SceneDiscovery />
        </Series.Sequence>

        {/* Escena 03 — Catálogo (8.0s) */}
        <Series.Sequence durationInFrames={240}>
          <SceneCatalog />
        </Series.Sequence>

        {/* Escena 04 — Producto (9.0s) */}
        <Series.Sequence durationInFrames={270}>
          <SceneProduct />
        </Series.Sequence>

        {/* Escena 05 — Carrito (8.0s) */}
        <Series.Sequence durationInFrames={240}>
          <SceneCart />
        </Series.Sequence>

        {/* Escena 06 — Checkout (9.0s) */}
        <Series.Sequence durationInFrames={270}>
          <SceneCheckout />
        </Series.Sequence>

        {/* Escena 07 — Tracking (8.0s) */}
        <Series.Sequence durationInFrames={240}>
          <SceneTracking />
        </Series.Sequence>

        {/* Escena 08 — Panel (9.0s) */}
        <Series.Sequence durationInFrames={270}>
          <ScenePanel />
        </Series.Sequence>

        {/* Escena 09 — Operaciones (9.0s) */}
        <Series.Sequence durationInFrames={270}>
          <SceneOperations />
        </Series.Sequence>

        {/* Escena 10 — Cierre (7.0s) */}
        <Series.Sequence durationInFrames={210}>
          <SceneOutro />
        </Series.Sequence>
      </Series>
    </div>
  );
};
