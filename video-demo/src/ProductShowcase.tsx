import React from "react";
import { Sequence } from "remotion";
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
import { AudioMixer } from "./components/audio/AudioMixer";
import { SubtitlesOverlay } from "./components/editorial/SubtitlesOverlay";

export interface ProductShowcaseProps {
  enableAudio?: boolean;
  enableSubtitles?: boolean;
  musicTrack?: string;
}

/**
 * ProductShowcase V2 — Rediseño Visual y Motion Design
 * Utiliza <Sequence> con solapamiento controlado (14 a 18 frames)
 * para transiciones continuas sin cortes secos ni saltos en negro.
 * Incluye mezcla completa de audio (locución neural, música con ducking, SFX)
 * y subtítulos editoriales sincronizados.
 */
export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  enableAudio = true,
  enableSubtitles = true,
  musicTrack = "audio/music/background.mp3",
}) => {
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#060709",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Mezclador de audio profesional con ducking dinámico y SFX */}
      {enableAudio && <AudioMixer musicTrack={musicTrack} />}

      {/* Subtítulos sincronizados con estética editorial */}
      {enableSubtitles && <SubtitlesOverlay />}
      {/* Escena 01 — Intro (Apertura editorial y reveal de plataforma) */}
      <Sequence durationInFrames={240}>
        <SceneIntro />
      </Sequence>

      {/* Escena 02 — Descubrimiento (Continuous Push Vertical, overlap 14f) */}
      <Sequence from={226} durationInFrames={240}>
        <SceneDiscovery />
      </Sequence>

      {/* Escena 03 — Catálogo (Slide lateral y preparación de Match Zoom, overlap 14f) */}
      <Sequence from={452} durationInFrames={240}>
        <SceneCatalog />
      </Sequence>

      {/* Escena 04 — Producto (MATCH ZOOM de entrada y evolución olfativa, overlap 16f) */}
      <Sequence from={676} durationInFrames={270}>
        <SceneProduct />
      </Sequence>

      {/* Escena 05 — Carrito (Push lateral, micro-hold y motion de ahorro numérico, overlap 14f) */}
      <Sequence from={932} durationInFrames={240}>
        <SceneCart />
      </Sequence>

      {/* Escena 06 — Checkout (Continuidad vertical y spotlight en Yappy, overlap 14f) */}
      <Sequence from={1158} durationInFrames={270}>
        <SceneCheckout />
      </Sequence>

      {/* Escena 07 — Tracking (Lectura guiada vertical y preparación de Context Switch, overlap 14f) */}
      <Sequence from={1414} durationInFrames={240}>
        <SceneTracking />
      </Sequence>

      {/* Escena 08 — Dashboard (CAMBIO DE CONTEXTO monumental y secuencia de KPIs, overlap 18f) */}
      <Sequence from={1636} durationInFrames={280}>
        <ScenePanel />
      </Sequence>

      {/* Escena 09 — Operaciones (Slide lateral en panel y Hard Cut sincopado pedidos/stock, overlap 14f) */}
      <Sequence from={1902} durationInFrames={250}>
        <SceneOperations />
      </Sequence>

      {/* Escena 10 — Cierre (Scale down y cierre tipográfico de marca, overlap 16f) */}
      <Sequence from={2136} durationInFrames={220}>
        <SceneOutro />
      </Sequence>
    </div>
  );
};
