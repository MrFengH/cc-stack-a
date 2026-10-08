import React from "react";
import { Composition } from "remotion";
import { ProductShowcase } from "./ProductShowcase";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProductShowcase"
        component={ProductShowcase}
        durationInFrames={2490}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
