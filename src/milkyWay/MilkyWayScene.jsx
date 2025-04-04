import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./MilkyWayScene.css";
import gsap from "gsap";

const MilkyWayScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const params = {
      particles: 50000,
      trailParticles: 30000,
      size: 0.02,
      trailSize: 0.015,
      radius: 50,
      branches: 30,
      spin: 1,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: "#ff6030",
      outsideColor: "#1b3984",
      trailColor: "#6633ff",
    };

    // Create star shape geometry
    const createStarGeometry = (innerRadius, outerRadius, points) => {
      const geometry = new THREE.OctahedronGeometry(innerRadius, 0);
      return geometry;
    };

    // Camera tour waypoints with descriptions
    const waypoints = [
      {
        position: new THREE.Vector3(0, 170, 0),
        lookAt: new THREE.Vector3(0, 0, 0),
        description: "בכל יום שעובר, אני אוהב אותך יותר",
      },
      {
        position: new THREE.Vector3(60, 30, -80),
        lookAt: new THREE.Vector3(0, 20, 0),
        description: "את החלום שהתגשם לי במציאות",
      },
      {
        position: new THREE.Vector3(40, 0, 40),
        lookAt: new THREE.Vector3(0, 0, 0),
        description: "איתך, כל רגע הופך לזיכרון בלתי נשכח.",
      },
      {
        position: new THREE.Vector3(-20, -1, 20),
        lookAt: new THREE.Vector3(0, 0, 0),
        description: "הלב שלי מצא את הבית שלו בך.",
      },
      {
        position: new THREE.Vector3(-20, 0, -20),
        lookAt: new THREE.Vector3(0, 0, -30),
        description: "אהבתי אליך עמוקה כמו היקום",
      },
      {
        position: new THREE.Vector3(15, 2, -15),
        lookAt: new THREE.Vector3(0, 0, 0),
        description: "אני אוהב אותך",
      },
      {
        position: new THREE.Vector3(3, 1, 3),
        lookAt: new THREE.Vector3(0, 0, 0),
        description: "שאני חושב עליך הלב שלי מחיך",
      },
    ];

    let currentWaypoint = 0;
    let isMoving = false;
    let geometry = null;
    let material = null;
    let points = null;
    let trailGeometry = null;
    let trailMaterial = null;
    let trails = null;
    let waypointMarkers = [];
    let hoveredWaypoint = null;
    let animationFrameId = null;

    // Create floating text that follows the camera
    const createText = (text) => {
      const textDiv = document.getElementById("text-display");
      textDiv.textContent = "";

      gsap.to(textDiv, { width: "auto", duration: 0 });
      let index = 0;

      function typeNextLetter() {
        if (index < text.length) {
          textDiv.textContent += text[index];
          index++;
          setTimeout(typeNextLetter, 100);
        } else {
          gsap.to(textDiv, {
            borderLeftColor: "transparent",
            repeat: -1,
            yoyo: true,
            duration: 0.5,
          });
        }
      }

      if (currentWaypoint === waypoints.length - 1) {
        gsap.to(textDiv, {
          fontSize: "1.5em",
        });
      }

      typeNextLetter();
    };

    // Create star marker for waypoints
    const createWaypointMarker = (position) => {
      // Create star shape
      const starGeometry = createStarGeometry(1.5, 3, 5);
      const starMaterial = new THREE.MeshBasicMaterial({
        color: 0x4444ff,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      });
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.copy(position);

      // Create outer glow
      const glowGeometry = createStarGeometry(2, 4, 5);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x6666ff,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(position);

      // Add point light
      const pointLight = new THREE.PointLight(0x4444ff, 1, 10);
      pointLight.position.copy(position);

      scene.add(star);
      scene.add(glow);
      scene.add(pointLight);

      return {
        star,
        glow,
        light: pointLight,
        position,
        originalStarColor: star.material.color.clone(),
        originalGlowColor: glow.material.color.clone(),
      };
    };
    // Remove all waypoint markers
    const removeAllWaypoints = () => {
      waypointMarkers.forEach((wp) => {
        scene.remove(wp.star);
        scene.remove(wp.glow);
        scene.remove(wp.light);
      });
      waypointMarkers = [];
    };

    // Update visible waypoints
    const updateWaypoints = () => {
      // Remove all existing waypoint markers
      removeAllWaypoints();

      // Show current waypoint only
      if (currentWaypoint < waypoints.length) {
        const marker = createWaypointMarker(
          waypoints[currentWaypoint].position
        );
        waypointMarkers.push(marker);
      }
    };

    const generateGalaxy = () => {
      // Dispose of old galaxy
      if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
      }
      if (trails !== null) {
        trailGeometry.dispose();
        trailMaterial.dispose();
        scene.remove(trails);
      }

      // Main galaxy geometry
      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(params.particles * 3);
      const colors = new Float32Array(params.particles * 3);

      // Trail geometry
      trailGeometry = new THREE.BufferGeometry();
      const trailPositions = new Float32Array(params.trailParticles * 3);
      const trailColors = new Float32Array(params.trailParticles * 3);

      const colorInside = new THREE.Color(params.insideColor);
      const colorOutside = new THREE.Color(params.outsideColor);
      const trailColorObj = new THREE.Color(params.trailColor);

      // Generate main galaxy points
      for (let i = 0; i < params.particles; i++) {
        const i3 = i * 3;

        // Position
        const radius = Math.random() * params.radius;
        const branchAngle =
          ((i % params.branches) / params.branches) * Math.PI * 2;
        const spinAngle = radius * params.spin;

        const randomX =
          Math.pow(Math.random(), params.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1);
        const randomY =
          Math.pow(Math.random(), params.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1);
        const randomZ =
          Math.pow(Math.random(), params.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1);

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] =
          Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / params.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      // Generate trail points
      for (let i = 0; i < params.trailParticles; i++) {
        const i3 = i * 3;
        const radius =
          Math.random() * params.radius * 1.2 + params.radius * 0.2;
        const branchAngle =
          ((i % params.branches) / params.branches) * Math.PI * 2;
        const spinAngle = radius * (params.spin * 1.5);

        const randomX =
          Math.pow(Math.random(), params.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          0.5;
        const randomY =
          Math.pow(Math.random(), params.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          0.5;
        const randomZ =
          Math.pow(Math.random(), params.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          0.5;

        trailPositions[i3] =
          Math.cos(branchAngle + spinAngle) * radius + randomX;
        trailPositions[i3 + 1] = randomY;
        trailPositions[i3 + 2] =
          Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const opacity = Math.random() * 0.5 + 0.5;
        trailColors[i3] = trailColorObj.r * opacity;
        trailColors[i3 + 1] = trailColorObj.g * opacity;
        trailColors[i3 + 2] = trailColorObj.b * opacity;
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      trailGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(trailPositions, 3)
      );
      trailGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(trailColors, 3)
      );

      // Materials
      material = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      trailMaterial = new THREE.PointsMaterial({
        size: params.trailSize,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
      });

      // Points
      points = new THREE.Points(geometry, material);
      trails = new THREE.Points(trailGeometry, trailMaterial);
      scene.add(points);
      scene.add(trails);

      // Create initial waypoint
      updateWaypoints();
    };

    const transformStarsToHeart = () => {
      if (!geometry) return; // Ensure geometry exists

      const heartScale = 4; // Scale factor for the heart shape
      const positions = geometry.attributes.position.array;
      const totalStars = params.particles;

      for (let i = 0; i < totalStars; i++) {
        const t = (i / totalStars) * (Math.PI * 2); // Spread points across heart shape

        // Compute heart shape coordinates
        const x = heartScale * 16 * Math.pow(Math.sin(t), 3);
        const y =
          heartScale *
          (13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t));
        const z = (Math.random() - 0.5) * 10; // Add slight randomness for depth effect

        const i3 = i * 3;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
      }

      geometry.attributes.position.needsUpdate = true; // Notify Three.js of position updates
    };

    generateGalaxy();

    // Set initial camera position
    camera.position.set(0, 240, 0);
    camera.lookAt(waypoints[0].lookAt);

    // Show initial text
    // createText(waypoints[0].description);

    // Smooth camera movement function
    const moveCamera = (targetPos, targetLook) => {
      isMoving = true;
      const duration = 6000; // 6 seconds for smoother movement
      const startPos = camera.position.clone();
      const startLook = controls.target.clone();
      const startTime = Date.now();

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easing function
        const easeProgress =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // Update camera position with smooth interpolation
        camera.position.lerpVectors(startPos, targetPos, easeProgress);

        // Update look target with smooth transition
        const currentLook = new THREE.Vector3();
        currentLook.lerpVectors(startLook, targetLook, easeProgress);
        controls.target.copy(currentLook);
        camera.lookAt(currentLook);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isMoving = false;
          // Show description text after movement
          if (currentWaypoint < waypoints.length) {
            createText(waypoints[currentWaypoint].description);
          }
          // Show next waypoint if not at the end
          if (currentWaypoint < waypoints.length - 1) {
            updateWaypoints();
          }
        }
      };

      animate();
    };

    // Handle waypoint selection and hover effects
    const onPointerMove = (event) => {
      if (isMoving) return;

      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      // Reset previous hover state
      if (
        hoveredWaypoint !== null &&
        hoveredWaypoint < waypointMarkers.length
      ) {
        const wp = waypointMarkers[hoveredWaypoint];
        wp.star.material.color.copy(wp.originalStarColor);
        wp.glow.material.color.copy(wp.originalGlowColor);
        wp.light.intensity = 1;
      }

      // Check for new hover
      const intersects = waypointMarkers
        .map((wp) => wp.star)
        .map((star, index) => ({
          intersection: raycaster.intersectObject(star),
          index,
        }));

      const hovered = intersects.find((item) => item.intersection.length > 0);

      if (hovered) {
        hoveredWaypoint = hovered.index;
        const wp = waypointMarkers[hoveredWaypoint];
        wp.star.material.color.setHex(0x66aaff);
        wp.glow.material.color.setHex(0x88ccff);
        wp.light.intensity = 2;
        document.body.style.cursor = "pointer";
      } else {
        hoveredWaypoint = null;
        document.body.style.cursor = "default";
      }
    };

    const onPointerClick = () => {
      if (isMoving) return;
      if (currentWaypoint === waypoints.length - 1) {
        removeAllWaypoints();
        transformStarsToHeart();
        moveCamera(
          new THREE.Vector3(230, 200, 0),
          waypoints[0]?.lookAt || new THREE.Vector3(0, 0, 0)
        );
        return;
      }

      if (hoveredWaypoint !== null) {
        removeAllWaypoints();

        if (waypoints[currentWaypoint]) {
          const waypoint = waypoints[currentWaypoint];
          moveCamera(waypoint.position, waypoint.lookAt);
          currentWaypoint++;
        }

        controls.enabled = false;
        setTimeout(() => {
          controls.enabled = true;
        }, 6000);
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("click", onPointerClick);

    // Animation
    const animate = () => {
      if (!sceneRef.current) return;

      animationFrameId = requestAnimationFrame(animate);

      if (points) {
        points.rotation.y += 0.001;
        trails.rotation.y += 0.0012;
      }

      // Animate waypoint elements
      waypointMarkers.forEach((wp, index) => {
        // Make stars face camera
        wp.star.lookAt(camera.position);
        wp.glow.lookAt(camera.position);

        // Animate star size and glow
        const time = Date.now() * 0.003;
        const scale = 1 + Math.sin(time) * 0.2;
        wp.star.scale.set(scale, scale, 1);
        wp.glow.scale.set(scale * 1.2, scale * 1.2, 1);

        // Pulse the light intensity
        const pulseIntensity = 1 + Math.sin(time) * 0.3;
        wp.light.intensity =
          index === hoveredWaypoint ? pulseIntensity * 2 : pulseIntensity;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("click", onPointerClick);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      sceneRef.current = null;

      // Dispose resources
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="galaxy-container">
      <div ref={mountRef} className="canvas-container" />
      <div
        className="transition-transform duration-1000 ease-in-out"
        id="text-display"
      ></div>
    </div>
  );
};

export default MilkyWayScene;
