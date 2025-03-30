import React, { useEffect } from "react";
import { OrbitControls, SpotLight, useGLTF } from "@react-three/drei";
import HackerRoom from "./HackerRoom";
import Developer from "./Developer";
import { calculateSizes } from "../../constants/index";
import { useGSAP } from "@gsap/react";

const ModelScene = ({ developeRef, responsive }) => {
  const { isMobile, isTablet, isLaptop } = responsive;
  const sizes = calculateSizes(isMobile, isTablet, isLaptop);

  return (
    <group>
      <group ref={developeRef}>
        <Developer
          scale={sizes.developerScale}
          position={sizes.developerPosition}
        />
      </group>
      {/* <group position={[0, -1, 0]} > */}
      <HackerRoom
        scale={sizes.deskScale}
        position={sizes.deskPosition}
        rotation={[0, -Math.PI / 1.2, 0]}
      />

      {/* </group> */}
    </group>
  );
};

export default ModelScene;
