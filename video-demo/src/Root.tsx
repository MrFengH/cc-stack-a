import React from "react";
import { Composition, staticFile, Video } from "remotion";
import { ProductShowcase } from "./ProductShowcase";

const RawClip: React.FC<{ clip: string }> = ({ clip }) => {
  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: "#000" }}>
      <Video src={staticFile(`recordings/${clip}`)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  const clips = [
    { id: "Clip01", file: "01-intro-home.webm", frames: 200 },
    { id: "Clip02", file: "02-descubrimiento-familias.webm", frames: 508 },
    { id: "Clip03", file: "03-catalogo-filtros.webm", frames: 465 },
    { id: "Clip04", file: "04-detalle-producto.webm", frames: 201 },
    { id: "Clip05", file: "05-carrito-cupon.webm", frames: 266 },
    { id: "Clip06", file: "06-checkout-pagos.webm", frames: 379 },
    { id: "Clip07", file: "07-cuenta-tracking.webm", frames: 273 },
    { id: "Clip08", file: "08-panel-metricas.webm", frames: 584 },
    { id: "Clip09a", file: "09a-panel-pedidos.webm", frames: 483 },
    { id: "Clip09b", file: "09b-panel-inventario.webm", frames: 573 },
  ];

  return (
    <>
      <Composition
        id="ProductShowcase"
        component={ProductShowcase}
        durationInFrames={2356}
        fps={30}
        width={1920}
        height={1080}
      />
      {clips.map((c) => (
        <Composition
          key={c.id}
          id={c.id}
          component={() => <RawClip clip={c.file} />}
          durationInFrames={c.frames}
          fps={30}
          width={1920}
          height={1080}
        />
      ))}
    </>
  );
};
