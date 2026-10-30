import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { sensoryAudio } from "./audio";
import {
  createBouncePad,
  createFlowerBush,
  createHeroCharacter,
  createMaterialPalette,
  createQuestToken,
  createRoutineStation,
  createSensoryTree,
} from "./proceduralModels";
import { GameState, InactivityHintInfo, RoutineQuest, SensorySettings } from "./types";

interface ThreeCanvasProps {
  gameState: GameState;
  quests: RoutineQuest[];
  onCollectQuest: (questId: string) => void;
  onNearStation: (category: RoutineQuest["category"] | null) => void;
  onHintChange?: (hint: InactivityHintInfo) => void;
  moveToTarget?: { x: number; z: number; timestamp: number } | null;
  settings: SensorySettings;
  touchInput: { x: number; y: number; action: boolean };
}

// Module-scope reusable math vectors for zero GC in loop
const _playerPos = new THREE.Vector3();
const _moveDir = new THREE.Vector3();
const _camPos = new THREE.Vector3();
const _camLook = new THREE.Vector3();
const _targetPos = new THREE.Vector3();

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  gameState,
  quests,
  onCollectQuest,
  onNearStation,
  onHintChange,
  moveToTarget,
  settings,
  touchInput,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Keep references to current props so game loop has access without re-mounting
  const propsRef = useRef({
    gameState,
    quests,
    onCollectQuest,
    onNearStation,
    onHintChange,
    moveToTarget,
    settings,
    touchInput,
  });

  useEffect(() => {
    propsRef.current = {
      gameState,
      quests,
      onCollectQuest,
      onNearStation,
      onHintChange,
      moveToTarget,
      settings,
      touchInput,
    };
  }, [
    gameState,
    quests,
    onCollectQuest,
    onNearStation,
    onHintChange,
    moveToTarget,
    settings,
    touchInput,
  ]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let destroyed = false;
    let frameId = 0;

    // 1. Detect software WebGL guard
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement("canvas").getContext("webgl2");
        if (!probe) return true;
        const ext = probe.getExtension("WEBGL_debug_renderer_info");
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension("WEBGL_lose_context")?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Setup Three.js Renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Scene & Studio PBR Environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6ede2); // Warm cozy morning sky
    scene.fog = new THREE.FogExp2(0xf6ede2, 0.022);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // 4. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 7, 14);

    // 5. Lighting: Warm directional key + Cool hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0xfffaed, 0x90caf9, 0.85);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff3e0, 1.4);
    dirLight.position.set(12, 22, 10);
    if (!isSoftwareGl) {
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 50;
      const d = 22;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
    }
    scene.add(dirLight);

    // 6. Materials Palette & Ground
    const palette = createMaterialPalette();

    // Soft rolling meadow ground
    const groundGeo = new THREE.PlaneGeometry(80, 80, 32, 32);
    groundGeo.rotateX(-Math.PI / 2);

    // Subtle gentle hill undulation
    const posAttr = groundGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      // Gentle perimeter slope keeping the center playfield flat
      if (dist > 18) {
        posAttr.setY(i, (dist - 18) * 0.28);
      }
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xc8e6c9, // Gentle pastel meadow green
      roughness: 0.95,
      metalness: 0.02,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    scene.add(ground);

    // Circular cobblestone path
    const pathGeo = new THREE.RingGeometry(8.5, 12.5, 48);
    pathGeo.rotateX(-Math.PI / 2);
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0xf3e5f5, // Soft pastel lilac cobblestones
      roughness: 0.9,
      metalness: 0.05,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.position.y = 0.03;
    scene.add(pathMesh);

    // 7. Hero Mascot (Lino)
    const hero = createHeroCharacter(palette);
    scene.add(hero);

    // 8. Sensory Bounce Pad (Trampoline Mushroom) at center
    const bouncePad = createBouncePad(palette);
    bouncePad.position.set(0, 0, 0);
    scene.add(bouncePad);

    // 9. Routine Stations and Quest Tokens
    const stationCategories: Array<"manha" | "higiene" | "escola" | "brincar" | "sono"> = [
      "manha",
      "higiene",
      "escola",
      "brincar",
      "sono",
    ];

    const stationPositions: [number, number, number][] = [
      [0, 0, -10.5], // North: Morning
      [10.0, 0, -3.2], // East: Hygiene
      [6.2, 0, 8.5], // South-East: School
      [-6.2, 0, 8.5], // South-West: Play
      [-10.0, 0, -3.2], // West: Bedtime
    ];

    const tokenColors = [0xffb300, 0x00bcd4, 0xab47bc, 0x4caf50, 0x5c6bc0];
    const stationMeshes: THREE.Group[] = [];
    const tokenMeshes: THREE.Group[] = [];

    stationPositions.forEach((pos, idx) => {
      const cat = stationCategories[idx];
      const station = createRoutineStation(cat, palette);
      station.position.set(...pos);
      station.userData = { id: `station-${cat}`, category: cat, pos };
      scene.add(station);
      stationMeshes.push(station);

      // Quest Token floating above each station
      const token = createQuestToken(tokenColors[idx], palette);
      token.position.set(pos[0], 2.8, pos[2]);
      token.userData = { id: `quest-${cat}`, category: cat, basePosY: 2.8, collected: false };
      scene.add(token);
      tokenMeshes.push(token);
    });

    // 9b. Gentle Glowing Visual Beacon for Inactivity Guidance (10s inactivity)
    const beaconGroup = new THREE.Group();
    beaconGroup.name = "HintBeacon";
    beaconGroup.visible = false;

    // Soft glowing light cylinder pillar
    const beaconGeo = new THREE.CylinderGeometry(1.6, 1.8, 6.5, 24, 1, true);
    beaconGeo.translate(0, 3.25, 0); // anchor at base
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0xffe082, // warm soft honey light
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const beaconPillar = new THREE.Mesh(beaconGeo, beaconMat);
    beaconGroup.add(beaconPillar);

    // Inner concentric ripple ground ring 1
    const rippleGeo1 = new THREE.RingGeometry(0.8, 2.0, 32);
    rippleGeo1.rotateX(-Math.PI / 2);
    const rippleMat1 = new THREE.MeshBasicMaterial({
      color: 0xffd54f,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const rippleRing1 = new THREE.Mesh(rippleGeo1, rippleMat1);
    rippleRing1.position.y = 0.05;
    beaconGroup.add(rippleRing1);

    // Outer concentric ripple ground ring 2
    const rippleGeo2 = new THREE.RingGeometry(1.6, 2.8, 32);
    rippleGeo2.rotateX(-Math.PI / 2);
    const rippleMat2 = new THREE.MeshBasicMaterial({
      color: 0xffb74d,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const rippleRing2 = new THREE.Mesh(rippleGeo2, rippleMat2);
    rippleRing2.position.y = 0.04;
    beaconGroup.add(rippleRing2);

    // Floating guide arrow / gentle glowing crystal hovering above station
    const arrowGeo = new THREE.ConeGeometry(0.35, 0.7, 16);
    arrowGeo.rotateX(Math.PI); // Point downward towards station
    const arrowMat = new THREE.MeshBasicMaterial({
      color: 0xffca28,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
    arrowMesh.position.y = 4.4;
    beaconGroup.add(arrowMesh);

    scene.add(beaconGroup);

    // 10. Natural Perimeter: Trees, Flower Bushes & Rocks
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const radius = 19 + (i % 3) * 2.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const tree = createSensoryTree(palette, 0.85 + (i % 4) * 0.15, i);
      tree.position.set(x, (radius - 18) * 0.28, z);
      scene.add(tree);
    }

    // Inner cozy trees & flower bushes
    const bushPositions: [number, number][] = [
      [4, 4],
      [-5, -4],
      [5, -5],
      [-4, 5],
      [11, 4],
      [-11, 4],
    ];
    bushPositions.forEach(([bx, bz]) => {
      const bush = createFlowerBush(palette, 6);
      bush.position.set(bx, 0, bz);
      scene.add(bush);
    });

    // 11. Sparkling Particles for Sensory Delight
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 26;
      particlePositions[p * 3 + 1] = 0.5 + Math.random() * 4;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 26;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfff59d,
      size: 0.18,
      transparent: true,
      opacity: 0.8,
    });
    const sparkleParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(sparkleParticles);

    // 12. Player Kinematics & Input State
    const player = {
      x: 0,
      z: 5.5,
      y: 0,
      vy: 0,
      rotation: 0,
      isGrounded: true,
      isJumping: false,
      bounceCooldown: 0,
      walkCycle: 0,
      targetMoveX: null as number | null,
      targetMoveZ: null as number | null,
    };

    const keys: Record<string, boolean> = {};

    // 10-second child inactivity tracking
    let inactivityTimer = 0;
    let hintActive = false;
    let activeHintQuestId: string | null = null;
    let beaconOpacity = 0;
    let lastMoveTimestamp = 0;

    const resetInactivity = () => {
      inactivityTimer = 0;
      if (hintActive) {
        hintActive = false;
        activeHintQuestId = null;
        propsRef.current.onHintChange?.({
          active: false,
          targetQuestId: null,
          targetQuestName: null,
          targetCategory: null,
          targetPosition: null,
        });
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      resetInactivity();
      keys[e.key.toLowerCase()] = true;
      if (e.key === " " || e.code === "Space") {
        if (player.isGrounded) {
          player.vy = 6.2;
          player.isGrounded = false;
          player.isJumping = true;
          sensoryAudio.playBounce();
        }
      }
      // Click-to-move cancel if WASD pressed
      if (
        ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(
          e.key.toLowerCase()
        )
      ) {
        player.targetMoveX = null;
        player.targetMoveZ = null;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Track pointer movement to reset inactivity
    let lastPointerClientX = 0;
    let lastPointerClientY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const dx = e.clientX - lastPointerClientX;
      const dy = e.clientY - lastPointerClientY;
      if (dx * dx + dy * dy > 36) {
        lastPointerClientX = e.clientX;
        lastPointerClientY = e.clientY;
        resetInactivity();
      }
    };
    window.addEventListener("pointermove", onPointerMove);

    // Raycast click-to-move for gentle accessibility on desktop/touch
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onPointerDown = (e: PointerEvent) => {
      resetInactivity();
      if (propsRef.current.gameState !== "playing") return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      // Raycast against ground, stations, and tokens
      const intersectable: THREE.Object3D[] = [ground, ...stationMeshes, ...tokenMeshes];
      const intersects = raycaster.intersectObjects(intersectable, true);

      if (intersects.length > 0) {
        const hit = intersects[0];
        // Check if the click was on or near any station/token
        let targetStationPos: [number, number, number] | null = null;
        for (let i = 0; i < stationPositions.length; i++) {
          const sp = stationPositions[i];
          const dist = Math.hypot(hit.point.x - sp[0], hit.point.z - sp[2]);
          if (dist < 3.2) {
            targetStationPos = sp;
            break;
          }
        }

        if (targetStationPos) {
          player.targetMoveX = targetStationPos[0];
          player.targetMoveZ = targetStationPos[2];
        } else {
          player.targetMoveX = hit.point.x;
          player.targetMoveZ = hit.point.z;
        }
        sensoryAudio.playSoftClick();
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    // Resize handler
    const onResize = () => {
      if (!container || destroyed) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // 13. Game Loop with Clamped Delta Time & Software GL Pacing
    const clock = new THREE.Clock();
    let titleOrbitAngle = 0;
    let stepSoundTimer = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (destroyed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (destroyed) return;

      const rawDt = clock.getDelta();
      const dt = Math.min(rawDt, 0.05);
      const elapsed = clock.getElapsedTime();
      const curState = propsRef.current.gameState;
      const currentQuests = propsRef.current.quests;
      const currentSettings = propsRef.current.settings;
      const touch = propsRef.current.touchInput;

      // Update tokens collected state, gentle glowing idle & hint pulsing
      tokenMeshes.forEach((token) => {
        const questMatch = currentQuests.find((q) => q.id === token.userData.id);
        const isCollected = questMatch ? questMatch.collected : false;
        token.userData.collected = isCollected;

        const coreMesh = token.getObjectByName("TokenCore") as THREE.Mesh | null;
        const coreMat = coreMesh ? (coreMesh.material as THREE.MeshStandardMaterial) : null;
        const isHintTarget = hintActive && activeHintQuestId === token.userData.id && !isCollected;

        if (isCollected) {
          // Gently shrink and fade collected tokens
          token.scale.lerp(_targetPos.set(0.35, 0.35, 0.35), 0.1);
          token.position.y = token.userData.basePosY - 0.5;
          if (coreMat) {
            coreMat.emissiveIntensity = 0.1;
          }
        } else if (isHintTarget) {
          // Soft golden pulsing beacon glow for next object to be clicked/visited
          const pulse = 0.5 + 0.5 * Math.sin(elapsed * 2.8);
          const targetScale = 1.25 + pulse * 0.2;
          token.scale.lerp(_targetPos.set(targetScale, targetScale, targetScale), 0.15);
          token.rotation.y += dt * 2.5;
          token.position.y = token.userData.basePosY + Math.sin(elapsed * 3.0) * 0.25;

          if (coreMat) {
            coreMat.emissiveIntensity = 0.7 + pulse * 0.7; // Warm, gentle golden glow
          }

          const ring = token.getObjectByName("TokenRing");
          if (ring) {
            ring.rotation.x += dt * 3.0;
            ring.rotation.z += dt * 1.8;
          }
        } else {
          // Bobbing & rotating idle
          token.scale.lerp(_targetPos.set(1, 1, 1), 0.1);
          token.rotation.y += dt * 1.5;
          token.position.y = token.userData.basePosY + Math.sin(elapsed * 2.5) * 0.18;
          if (coreMat) {
            coreMat.emissiveIntensity = 0.45;
          }
          const ring = token.getObjectByName("TokenRing");
          if (ring) {
            ring.rotation.x += dt * 2.0;
            ring.rotation.z += dt * 1.2;
          }
        }
      });

      // Animate gentle beacon light pillar & ground ripple rings
      if (hintActive && activeHintQuestId) {
        const targetQuest = currentQuests.find((q) => q.id === activeHintQuestId);
        if (targetQuest) {
          beaconGroup.visible = true;
          beaconGroup.position.set(targetQuest.position[0], 0, targetQuest.position[2]);

          beaconOpacity = THREE.MathUtils.damp(beaconOpacity, 1.0, 3.0, dt);
          const pulse = 0.5 + 0.5 * Math.sin(elapsed * 2.5);

          beaconMat.opacity = beaconOpacity * (0.22 + pulse * 0.18);
          rippleMat1.opacity = beaconOpacity * (0.35 + pulse * 0.25);
          rippleMat2.opacity = beaconOpacity * (0.2 + (1 - pulse) * 0.2);
          arrowMat.opacity = beaconOpacity * (0.65 + pulse * 0.35);

          rippleRing1.rotation.z += dt * 0.6;
          rippleRing2.rotation.z -= dt * 0.4;
          rippleRing1.scale.setScalar(1 + pulse * 0.16);
          rippleRing2.scale.setScalar(1 + (1 - pulse) * 0.16);

          arrowMesh.position.y = 4.4 + Math.sin(elapsed * 2.8) * 0.2;
          arrowMesh.rotation.y += dt * 1.5;
        }
      } else {
        beaconOpacity = THREE.MathUtils.damp(beaconOpacity, 0, 5.0, dt);
        if (beaconOpacity < 0.01) {
          beaconGroup.visible = false;
        } else {
          beaconMat.opacity = beaconOpacity * 0.2;
          rippleMat1.opacity = beaconOpacity * 0.25;
          rippleMat2.opacity = beaconOpacity * 0.15;
          arrowMat.opacity = beaconOpacity * 0.4;
        }
      }

      // Animate floating sparkle particles
      const pAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let p = 0; p < particleCount; p++) {
        let py = pAttr.getY(p) + dt * 0.25;
        if (py > 5.5) py = 0.5;
        pAttr.setY(p, py);
      }
      pAttr.needsUpdate = true;

      // Handle Title Screen vs Playing Screen
      if (curState === "title") {
        titleOrbitAngle += dt * 0.3;
        camera.position.x = Math.sin(titleOrbitAngle) * 16;
        camera.position.z = Math.cos(titleOrbitAngle) * 16;
        camera.position.y = 8 + Math.sin(titleOrbitAngle * 0.5) * 1.5;
        camera.lookAt(0, 1.5, 0);

        // Friendly wave idle for hero
        hero.position.set(0, 0, 5.5);
        hero.rotation.y = Math.PI;
        const rightArm = hero.getObjectByName("rightArm");
        if (rightArm) {
          rightArm.rotation.z = -1.2 + Math.sin(elapsed * 4) * 0.4;
        }
      } else if (curState === "playing" || curState === "paused" || curState === "victory") {
        if (curState === "playing") {
          // Check external command to move (e.g. child clicking hint card)
          const extMove = propsRef.current.moveToTarget;
          if (extMove && extMove.timestamp !== lastMoveTimestamp) {
            lastMoveTimestamp = extMove.timestamp;
            player.targetMoveX = extMove.x;
            player.targetMoveZ = extMove.z;
            resetInactivity();
          }

          // Calculate movement from Keyboard, Virtual Joystick, or Click-to-Move
          let mx = 0;
          let mz = 0;

          if (keys["w"] || keys["arrowup"]) mz -= 1;
          if (keys["s"] || keys["arrowdown"]) mz += 1;
          if (keys["a"] || keys["arrowleft"]) mx -= 1;
          if (keys["d"] || keys["arrowright"]) mx += 1;

          // Virtual touch joystick
          if (Math.abs(touch.x) > 0.1 || Math.abs(touch.y) > 0.1) {
            mx = touch.x;
            mz = touch.y;
            player.targetMoveX = null;
            player.targetMoveZ = null;
          }

          // Jump button on touch
          if (touch.action && player.isGrounded) {
            player.vy = 6.2;
            player.isGrounded = false;
            player.isJumping = true;
            sensoryAudio.playBounce();
          }

          // Click-to-move target
          if (player.targetMoveX !== null && player.targetMoveZ !== null) {
            const dx = player.targetMoveX - player.x;
            const dz = player.targetMoveZ - player.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist > 0.25) {
              mx = dx / dist;
              mz = dz / dist;
            } else {
              player.targetMoveX = null;
              player.targetMoveZ = null;
            }
          }

          // 10-second child inactivity tracking for gentle visual hint
          const isVirtualTouchActive =
            Math.abs(touch.x) > 0.05 || Math.abs(touch.y) > 0.05 || touch.action;
          const isKeysActive =
            keys["w"] ||
            keys["a"] ||
            keys["s"] ||
            keys["d"] ||
            keys["arrowup"] ||
            keys["arrowdown"] ||
            keys["arrowleft"] ||
            keys["arrowright"] ||
            keys[" "] ||
            keys["space"];
          const isMovingToTarget = player.targetMoveX !== null && player.targetMoveZ !== null;

          if (isVirtualTouchActive || isKeysActive || isMovingToTarget) {
            resetInactivity();
          } else {
            inactivityTimer += dt;
            if (inactivityTimer >= 10.0 && !hintActive) {
              const nextQuest = currentQuests.find((q) => !q.collected);
              if (nextQuest) {
                hintActive = true;
                activeHintQuestId = nextQuest.id;
                propsRef.current.onHintChange?.({
                  active: true,
                  targetQuestId: nextQuest.id,
                  targetQuestName: nextQuest.name,
                  targetCategory: nextQuest.category,
                  targetPosition: nextQuest.position,
                });
                sensoryAudio.playGentleHintShimmer();
              }
            }
          }

          const hasInput = mx !== 0 || mz !== 0;
          const speed = currentSettings.gentleMode ? 3.8 : 5.8;

          if (hasInput) {
            const inputLen = Math.sqrt(mx * mx + mz * mz);
            const normX = mx / inputLen;
            const normZ = mz / inputLen;

            player.x += normX * speed * dt;
            player.z += normZ * speed * dt;

            // Target facing rotation
            const targetRot = Math.atan2(normX, normZ);
            player.rotation = THREE.MathUtils.damp(player.rotation, targetRot, 12, dt);

            // Walking limb animation
            player.walkCycle += dt * (speed * 2.2);
            const leftFoot = hero.getObjectByName("leftFoot");
            const rightFoot = hero.getObjectByName("rightFoot");
            const leftArm = hero.getObjectByName("leftArm");
            const rightArm = hero.getObjectByName("rightArm");

            if (leftFoot && rightFoot) {
              leftFoot.position.z = 0.08 + Math.sin(player.walkCycle) * 0.18;
              rightFoot.position.z = 0.08 - Math.sin(player.walkCycle) * 0.18;
              leftFoot.position.y = 0.14 + Math.max(0, Math.cos(player.walkCycle) * 0.1);
              rightFoot.position.y = 0.14 + Math.max(0, -Math.cos(player.walkCycle) * 0.1);
            }
            if (leftArm && rightArm) {
              leftArm.rotation.x = -Math.sin(player.walkCycle) * 0.45;
              rightArm.rotation.x = Math.sin(player.walkCycle) * 0.45;
            }

            // Sound footstep
            stepSoundTimer += dt;
            if (stepSoundTimer > (currentSettings.gentleMode ? 0.45 : 0.32) && player.isGrounded) {
              stepSoundTimer = 0;
              sensoryAudio.playFootstep();
            }
          } else {
            // Idle breathing
            const leftFoot = hero.getObjectByName("leftFoot");
            const rightFoot = hero.getObjectByName("rightFoot");
            const leftArm = hero.getObjectByName("leftArm");
            const rightArm = hero.getObjectByName("rightArm");
            if (leftFoot && rightFoot) {
              leftFoot.position.set(-0.25, 0.14, 0.08);
              rightFoot.position.set(0.25, 0.14, 0.08);
            }
            if (leftArm && rightArm) {
              leftArm.rotation.set(0, 0, 0.25);
              rightArm.rotation.set(0, 0, -0.25);
            }
          }

          // Gravity and jumping
          if (!player.isGrounded) {
            player.vy -= 16.0 * dt; // Soft gentle gravity
            player.y += player.vy * dt;
            if (player.y <= 0) {
              player.y = 0;
              player.vy = 0;
              player.isGrounded = true;
              player.isJumping = false;
            }
          }

          // Check Trampoline Bounce Pad (center: [0, 0])
          const distToTrampoline = Math.sqrt(player.x * player.x + player.z * player.z);
          player.bounceCooldown = Math.max(0, player.bounceCooldown - dt);
          if (distToTrampoline < 1.4 && player.bounceCooldown === 0) {
            player.vy = 8.5; // Big joyful sensory bounce!
            player.isGrounded = false;
            player.bounceCooldown = 0.6;
            sensoryAudio.playBounce();

            // Squash trampoline cap visually
            const cap = bouncePad.getObjectByName("TrampolineCap");
            if (cap) {
              cap.scale.set(1.3, 0.2, 1.3);
            }
          }

          // Rebound trampoline cap
          const cap = bouncePad.getObjectByName("TrampolineCap");
          if (cap) {
            cap.scale.lerp(_targetPos.set(1, 1, 1), 0.1);
          }

          // Keep player within natural circular garden boundary
          const distFromOrigin = Math.sqrt(player.x * player.x + player.z * player.z);
          if (distFromOrigin > 16.5) {
            player.x = (player.x / distFromOrigin) * 16.5;
            player.z = (player.z / distFromOrigin) * 16.5;
          }

          // Proximity to routine stations & quest token collection
          let nearestCat: RoutineQuest["category"] | null = null;
          let minStationDist = 999;

          tokenMeshes.forEach((token) => {
            const dx = player.x - token.position.x;
            const dz = player.z - token.position.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist < 2.5 && dist < minStationDist) {
              minStationDist = dist;
              nearestCat = token.userData.category;
            }

            // Collection trigger
            if (dist < 2.0 && !token.userData.collected) {
              token.userData.collected = true;
              propsRef.current.onCollectQuest(token.userData.id);
              sensoryAudio.playCollectChime();
              resetInactivity();
            }
          });

          propsRef.current.onNearStation(nearestCat);
        }

        // Apply player position & rotation with soft squash-and-stretch on jump
        hero.position.set(player.x, player.y, player.z);
        hero.rotation.y = player.rotation;

        if (player.vy > 0) {
          hero.scale.set(0.9, 1.15, 0.9); // Stretch
        } else if (!player.isGrounded) {
          hero.scale.set(1.05, 0.95, 1.05); // Hang
        } else {
          hero.scale.lerp(_targetPos.set(1, 1, 1), 0.2); // Normal
        }

        // Camera follow with smooth exponential damping
        const targetCamX = player.x;
        const targetCamZ = player.z + 8.5;
        const targetCamY = player.y + 5.5;

        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 6.0, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 6.0, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 6.0, dt);

        _camLook.set(player.x, player.y + 1.2, player.z);
        camera.lookAt(_camLook);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Cleanup
    return () => {
      destroyed = true;
      if (frameId) {
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
      }
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full overflow-hidden" />;
};
