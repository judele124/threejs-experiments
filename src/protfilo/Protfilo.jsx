import { Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import Interface from "./sections/Interface";
import ScrollManger from "./components/ScrollManger";
import NuvBar from "./components/NuvBar";
import ModelScene from "./components/models/ModelScene";
import useResponsive from "./hooks/useResponsive";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Protfilo = () => {
  const [section, setSection] = useState(0);
  const res = useResponsive();
  const containerRef = useRef(null);
  const developeRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const checkRobotAvailability = () => {
      if (developeRef.current) {
        console.log(developeRef.current);

        setIsModelLoaded(true);
      } else {
        setTimeout(checkRobotAvailability, 100); // Check every 100ms
      }
    };
    checkRobotAvailability();
  }, []);

  useGSAP(() => {
    if (isModelLoaded && containerRef.current) {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          // anticipatePin: 1,
          // markers: true,
        },
      });

      scrollTl.to(developeRef.current.position, {
        x: 0,
        y: -4,
        duration: 5,
      });
    }
  });

  return (
    <div ref={containerRef} className="">
      <Canvas
        // frameloop="demand"
        camera={{ position: [0, 3, 5] }}
        style={{ height: "100lvh" }}
        // performance={{ min: 1 }}
      >
        {/* <ScrollManger section={section} setSection={setSection} /> */}
        {/* <ModelScene developeRef={developeRef} responsive={res} /> */}

        <group>
          <directionalLight position={[0, 10, 0]} />
          <PerspectiveCamera makeDefault position={[0, 3, 5]} />
          {Array.from({ length: 10 }, (_, index) => (
            <mesh
              position={[Math.random() * 3, index * 2, Math.random()]}
              key={index}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={index % 2 === 0 ? "red" : "blue"} />
            </mesh>
          ))}
        </group>
      </Canvas>
      <Interface />

      {/* <NuvBar setSection={setSection} /> */}
    </div>
  );
};

export default Protfilo;
