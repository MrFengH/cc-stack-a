import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame, Video } from "remotion";
import { CheckoutStepIndicator, SectionKicker } from "./editorial/EditorialOverlays";

export const SceneCheckout: React.FC = () => {
  const frame = useCurrentFrame();

  // Entrada: Continuidad vertical desde el Carrito (frames 0 a 16)
  const enterY = interpolate(frame, [0, 16], [90, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const enterOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Salida: Settle y scale down hacia Tracking (frames 254 a 270)
  const exitScale = interpolate(frame, [254, 270], [1.0, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const exitOpacity = interpolate(frame, [262, 270], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Movimiento interno:
  // 1. Frames 0-80: Enfoque general en opciones de entrega
  // 2. Frames 80-160: Spotlight punch-in sobre Yappy (método de pago preferido en Panamá)
  // 3. Frames 160-270: Settle estable
  const isYappyHighlight = frame >= 75 && frame <= 165;
  const scale = isYappyHighlight
    ? interpolate(frame, [75, 95, 145, 165], [1.02, 1.12, 1.12, 1.04], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.25, 1, 0.5, 1),
      })
    : interpolate(frame, [0, 75, 270], [1.0, 1.02, 1.04], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const originX = isYappyHighlight ? "42%" : "50%";
  const originY = isYappyHighlight ? "68%" : "50%";

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0d0f12",
        transform: `translateY(${enterY}px) scale(${exitScale})`,
        opacity: enterOpacity * exitOpacity,
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: `${originX} ${originY}`,
          transform: `scale(${scale})`,
        }}
      >
        <Video
          src={staticFile("recordings/06-checkout-pagos.webm")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Indicador de 3 Fases en la parte superior */}
      <CheckoutStepIndicator currentStep={frame < 80 ? 1 : 3} />

      {/* Rótulo Editorial (2s) */}
      <SectionKicker
        title="Checkout Local"
        subtitle="Retiro en 4h y pagos integrados con Yappy y ACH"
        position="top-left"
        startFrame={12}
        durationInFrames={60}
      />
    </div>
  );
};
