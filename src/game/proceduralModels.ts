import * as THREE from "three";

// Shared materials library to keep draw calls and memory efficient
export function createMaterialPalette() {
  return {
    furBody: new THREE.MeshStandardMaterial({
      color: 0xffdfba, // Warm golden honey fur
      roughness: 0.85,
      metalness: 0.05,
    }),
    furBelly: new THREE.MeshStandardMaterial({
      color: 0xfff3e0, // Soft cream belly
      roughness: 0.9,
      metalness: 0.02,
    }),
    innerEar: new THREE.MeshStandardMaterial({
      color: 0xf8bbd0, // Soft pink inner ear
      roughness: 0.7,
      metalness: 0.05,
    }),
    noseEye: new THREE.MeshStandardMaterial({
      color: 0x2d2424, // Soft dark chocolate
      roughness: 0.2,
      metalness: 0.2,
    }),
    eyeGlint: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.1,
    }),
    scarf: new THREE.MeshStandardMaterial({
      color: 0x81c784, // Mint pastel green
      roughness: 0.6,
      metalness: 0.1,
    }),
    backpack: new THREE.MeshStandardMaterial({
      color: 0xffb74d, // Pastel warm orange
      roughness: 0.5,
      metalness: 0.1,
    }),
    starGold: new THREE.MeshStandardMaterial({
      color: 0xffd54f,
      emissive: 0xffc107,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.4,
    }),
    woodTrunk: new THREE.MeshStandardMaterial({
      color: 0x8d6e63,
      roughness: 0.9,
      metalness: 0.05,
    }),
    foliage1: new THREE.MeshStandardMaterial({
      color: 0xa5d6a7, // Soft sage pastel
      roughness: 0.85,
      metalness: 0.05,
    }),
    foliage2: new THREE.MeshStandardMaterial({
      color: 0x81c784, // Meadow green
      roughness: 0.85,
      metalness: 0.05,
    }),
    foliage3: new THREE.MeshStandardMaterial({
      color: 0x66bb6a, // Fresh sprout green
      roughness: 0.85,
      metalness: 0.05,
    }),
    flowerPink: new THREE.MeshStandardMaterial({
      color: 0xf48fb1,
      roughness: 0.5,
      metalness: 0.1,
    }),
    flowerYellow: new THREE.MeshStandardMaterial({
      color: 0xffeb3b,
      roughness: 0.5,
      metalness: 0.1,
    }),
    stone: new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      roughness: 0.95,
      metalness: 0.05,
    }),
    water: new THREE.MeshStandardMaterial({
      color: 0x81d4fa,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    }),
    rainbowRed: new THREE.MeshStandardMaterial({ color: 0xff8a80, roughness: 0.4 }),
    rainbowYellow: new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.4 }),
    rainbowBlue: new THREE.MeshStandardMaterial({ color: 0x80d8ff, roughness: 0.4 }),
    rainbowPurple: new THREE.MeshStandardMaterial({ color: 0xcc99ff, roughness: 0.4 }),
    cloudWhite: new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.9,
      metalness: 0.02,
    }),
  };
}

// 1. Procedural Hero Mascot: "Lino, o Ursinho da Rotina" (10+ parts)
export function createHeroCharacter(palette: ReturnType<typeof createMaterialPalette>): THREE.Group {
  const hero = new THREE.Group();
  hero.name = "HeroCharacter";

  // 1. Main body (soft egg capsule)
  const bodyGeo = new THREE.SphereGeometry(0.55, 16, 16);
  bodyGeo.scale(1, 1.25, 0.9);
  const bodyMesh = new THREE.Mesh(bodyGeo, palette.furBody);
  bodyMesh.position.y = 0.75;
  bodyMesh.castShadow = true;
  hero.add(bodyMesh);

  // 2. Cream belly patch
  const bellyGeo = new THREE.SphereGeometry(0.38, 14, 14);
  bellyGeo.scale(0.85, 1.1, 0.5);
  const bellyMesh = new THREE.Mesh(bellyGeo, palette.furBelly);
  bellyMesh.position.set(0, 0.72, 0.32);
  hero.add(bellyMesh);

  // 3. Head
  const headGeo = new THREE.SphereGeometry(0.48, 16, 16);
  headGeo.scale(1.05, 0.95, 1);
  const headMesh = new THREE.Mesh(headGeo, palette.furBody);
  headMesh.position.set(0, 1.5, 0.05);
  headMesh.castShadow = true;
  hero.add(headMesh);

  // 4. Snout / Muzzle
  const snoutGeo = new THREE.SphereGeometry(0.24, 14, 14);
  snoutGeo.scale(1.1, 0.8, 0.9);
  const snoutMesh = new THREE.Mesh(snoutGeo, palette.furBelly);
  snoutMesh.position.set(0, 1.42, 0.38);
  hero.add(snoutMesh);

  // 5. Button nose
  const noseGeo = new THREE.SphereGeometry(0.08, 10, 10);
  noseGeo.scale(1.2, 0.8, 0.8);
  const noseMesh = new THREE.Mesh(noseGeo, palette.noseEye);
  noseMesh.position.set(0, 1.48, 0.56);
  hero.add(noseMesh);

  // 6 & 7. Left and Right Cute Eyes with Glint
  const eyeGeo = new THREE.SphereGeometry(0.07, 10, 10);
  const glintGeo = new THREE.SphereGeometry(0.025, 8, 8);

  const leftEye = new THREE.Mesh(eyeGeo, palette.noseEye);
  leftEye.position.set(-0.16, 1.56, 0.42);
  const leftGlint = new THREE.Mesh(glintGeo, palette.eyeGlint);
  leftGlint.position.set(-0.14, 1.59, 0.48);
  hero.add(leftEye, leftGlint);

  const rightEye = new THREE.Mesh(eyeGeo, palette.noseEye);
  rightEye.position.set(0.16, 1.56, 0.42);
  const rightGlint = new THREE.Mesh(glintGeo, palette.eyeGlint);
  rightGlint.position.set(0.18, 1.59, 0.48);
  hero.add(rightEye, rightGlint);

  // 8 & 9. Left & Right Round Ears with Inner Ear Pads
  const earGeo = new THREE.SphereGeometry(0.18, 12, 12);
  const innerEarGeo = new THREE.SphereGeometry(0.11, 10, 10);

  const leftEar = new THREE.Mesh(earGeo, palette.furBody);
  leftEar.position.set(-0.35, 1.88, 0.05);
  const leftInner = new THREE.Mesh(innerEarGeo, palette.innerEar);
  leftInner.position.set(-0.34, 1.88, 0.12);
  hero.add(leftEar, leftInner);

  const rightEar = new THREE.Mesh(earGeo, palette.furBody);
  rightEar.position.set(0.35, 1.88, 0.05);
  const rightInner = new THREE.Mesh(innerEarGeo, palette.innerEar);
  rightInner.position.set(0.34, 1.88, 0.12);
  hero.add(rightEar, rightInner);

  // 10. Cozy Scarf with knot
  const scarfRingGeo = new THREE.TorusGeometry(0.36, 0.1, 10, 20);
  scarfRingGeo.rotateX(Math.PI / 2);
  const scarfMesh = new THREE.Mesh(scarfRingGeo, palette.scarf);
  scarfMesh.position.set(0, 1.15, 0.05);
  hero.add(scarfMesh);

  const scarfTailGeo = new THREE.ConeGeometry(0.12, 0.35, 8);
  scarfTailGeo.rotateZ(0.2);
  const scarfTail = new THREE.Mesh(scarfTailGeo, palette.scarf);
  scarfTail.position.set(0.2, 0.98, 0.35);
  hero.add(scarfTail);

  // 11 & 12. Little Paws (arms)
  const armGeo = new THREE.SphereGeometry(0.16, 12, 12);
  armGeo.scale(0.8, 1.4, 0.8);
  const leftArm = new THREE.Mesh(armGeo, palette.furBody);
  leftArm.name = "leftArm";
  leftArm.position.set(-0.52, 0.82, 0.1);
  leftArm.rotation.z = 0.25;

  const rightArm = new THREE.Mesh(armGeo, palette.furBody);
  rightArm.name = "rightArm";
  rightArm.position.set(0.52, 0.82, 0.1);
  rightArm.rotation.z = -0.25;
  hero.add(leftArm, rightArm);

  // 13 & 14. Feet (legs) flush with ground
  const footGeo = new THREE.SphereGeometry(0.22, 12, 12);
  footGeo.scale(0.9, 0.65, 1.4);
  const leftFoot = new THREE.Mesh(footGeo, palette.furBody);
  leftFoot.name = "leftFoot";
  leftFoot.position.set(-0.25, 0.14, 0.08);

  const rightFoot = new THREE.Mesh(footGeo, palette.furBody);
  rightFoot.name = "rightFoot";
  rightFoot.position.set(0.25, 0.14, 0.08);
  hero.add(leftFoot, rightFoot);

  // 15. Backpack with Routine star badge
  const backpackGeo = new THREE.BoxGeometry(0.42, 0.48, 0.24);
  const backpackMesh = new THREE.Mesh(backpackGeo, palette.backpack);
  backpackMesh.position.set(0, 0.85, -0.42);
  const starGeo = new THREE.OctahedronGeometry(0.12, 0);
  const starMesh = new THREE.Mesh(starGeo, palette.starGold);
  starMesh.position.set(0, 0.85, -0.56);
  hero.add(backpackMesh, starMesh);

  // Soft contact shadow circle below feet
  const shadowGeo = new THREE.CircleGeometry(0.65, 20);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x4a4a4a,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.position.y = 0.02;
  hero.add(shadowMesh);

  return hero;
}

// 2. Procedural Sensory Trees (Trunk + 3 Cloud foliage layers + fruit dots)
export function createSensoryTree(
  palette: ReturnType<typeof createMaterialPalette>,
  scale = 1.0,
  tintVariant = 0
): THREE.Group {
  const tree = new THREE.Group();

  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.22 * scale, 0.32 * scale, 1.8 * scale, 10);
  const trunk = new THREE.Mesh(trunkGeo, palette.woodTrunk);
  trunk.position.y = (1.8 * scale) / 2;
  trunk.castShadow = true;
  tree.add(trunk);

  // 3-tier fluffy foliage
  const mats = [palette.foliage1, palette.foliage2, palette.foliage3];
  const mat1 = mats[(tintVariant + 0) % 3];
  const mat2 = mats[(tintVariant + 1) % 3];
  const mat3 = mats[(tintVariant + 2) % 3];

  const tier1Geo = new THREE.SphereGeometry(1.2 * scale, 12, 12);
  tier1Geo.scale(1.1, 0.85, 1.1);
  const tier1 = new THREE.Mesh(tier1Geo, mat1);
  tier1.position.y = 1.9 * scale;
  tier1.castShadow = true;
  tree.add(tier1);

  const tier2Geo = new THREE.SphereGeometry(0.95 * scale, 12, 12);
  tier2Geo.scale(1, 0.9, 1);
  const tier2 = new THREE.Mesh(tier2Geo, mat2);
  tier2.position.y = 2.7 * scale;
  tier2.castShadow = true;
  tree.add(tier2);

  const tier3Geo = new THREE.SphereGeometry(0.68 * scale, 10, 10);
  const tier3 = new THREE.Mesh(tier3Geo, mat3);
  tier3.position.y = 3.35 * scale;
  tier3.castShadow = true;
  tree.add(tier3);

  // Decorative fruit/blossoms
  const blossomGeo = new THREE.SphereGeometry(0.12 * scale, 6, 6);
  const blossomPositions: [number, number, number][] = [
    [0.7 * scale, 2.0 * scale, 0.6 * scale],
    [-0.8 * scale, 1.8 * scale, -0.4 * scale],
    [0.4 * scale, 2.8 * scale, -0.6 * scale],
    [-0.5 * scale, 2.9 * scale, 0.5 * scale],
  ];
  blossomPositions.forEach((pos, idx) => {
    const bMesh = new THREE.Mesh(
      blossomGeo,
      idx % 2 === 0 ? palette.flowerPink : palette.flowerYellow
    );
    bMesh.position.set(...pos);
    tree.add(bMesh);
  });

  // Soft contact shadow
  const shadowGeo = new THREE.CircleGeometry(1.4 * scale, 16);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x3d4b3d,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.02;
  tree.add(shadow);

  return tree;
}

// 3. Procedural Flower Cluster
export function createFlowerBush(
  palette: ReturnType<typeof createMaterialPalette>,
  count = 5
): THREE.Group {
  const bush = new THREE.Group();
  const bushGeo = new THREE.SphereGeometry(0.65, 10, 10);
  bushGeo.scale(1.2, 0.65, 1.2);
  const foliage = new THREE.Mesh(bushGeo, palette.foliage1);
  foliage.position.y = 0.35;
  foliage.castShadow = true;
  bush.add(foliage);

  const flowerHeadGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.04, 6);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = 0.45;
    const flMesh = new THREE.Mesh(
      flowerHeadGeo,
      i % 2 === 0 ? palette.flowerPink : palette.flowerYellow
    );
    flMesh.position.set(Math.cos(angle) * r, 0.58 + (i % 2) * 0.06, Math.sin(angle) * r);
    bush.add(flMesh);
  }
  return bush;
}

// 4. Procedural Interactive Trampoline / Sensory Bounce Mushroom
export function createBouncePad(palette: ReturnType<typeof createMaterialPalette>): THREE.Group {
  const pad = new THREE.Group();
  pad.name = "BouncePad";

  // Base stem
  const stemGeo = new THREE.CylinderGeometry(0.4, 0.6, 0.4, 12);
  const stem = new THREE.Mesh(stemGeo, palette.cloudWhite);
  stem.position.y = 0.2;
  pad.add(stem);

  // Soft mushroom cap (spring pad)
  const capGeo = new THREE.SphereGeometry(1.1, 16, 16);
  capGeo.scale(1.1, 0.45, 1.1);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0xff80ab,
    roughness: 0.35,
    metalness: 0.1,
  });
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.name = "TrampolineCap";
  cap.position.y = 0.45;
  cap.castShadow = true;
  pad.add(cap);

  // White polka dots
  const dotGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.03, 8);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const dot = new THREE.Mesh(dotGeo, palette.cloudWhite);
    dot.position.set(Math.cos(angle) * 0.7, 0.62, Math.sin(angle) * 0.7);
    pad.add(dot);
  }

  // Ring halo
  const ringGeo = new THREE.TorusGeometry(1.25, 0.04, 8, 24);
  ringGeo.rotateX(Math.PI / 2);
  const ring = new THREE.Mesh(ringGeo, palette.rainbowYellow);
  ring.position.y = 0.05;
  pad.add(ring);

  return pad;
}

// 5. The 5 Routine Hub Portals
export function createRoutineStation(
  category: "manha" | "higiene" | "escola" | "brincar" | "sono",
  palette: ReturnType<typeof createMaterialPalette>
): THREE.Group {
  const station = new THREE.Group();
  station.name = `Station_${category}`;

  // Base circular stone pedestal
  const baseGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.25, 24);
  const base = new THREE.Mesh(baseGeo, palette.stone);
  base.position.y = 0.125;
  base.receiveShadow = true;
  station.add(base);

  // Outer decorative light stones
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const stoneSmall = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 8, 8),
      palette.stone
    );
    stoneSmall.position.set(Math.cos(angle) * 2.3, 0.15, Math.sin(angle) * 2.3);
    station.add(stoneSmall);
  }

  if (category === "manha") {
    // Picnic Table with Breakfast
    const tableGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.1, 16);
    const tableLegGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8);
    const table = new THREE.Mesh(tableGeo, palette.woodTrunk);
    table.position.y = 0.85;
    const leg = new THREE.Mesh(tableLegGeo, palette.woodTrunk);
    leg.position.y = 0.45;
    station.add(table, leg);

    // Plate & sunny egg
    const plateGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.04, 12);
    const plate = new THREE.Mesh(plateGeo, palette.cloudWhite);
    plate.position.set(-0.25, 0.92, 0.15);
    const eggWhiteGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 10);
    const eggWhite = new THREE.Mesh(eggWhiteGeo, palette.furBelly);
    eggWhite.position.set(-0.25, 0.94, 0.15);
    const yolkGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const yolk = new THREE.Mesh(yolkGeo, palette.starGold);
    yolk.position.set(-0.25, 0.96, 0.15);
    station.add(plate, eggWhite, yolk);

    // Glass of juice
    const cupGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.35, 10);
    const cup = new THREE.Mesh(cupGeo, palette.rainbowYellow);
    cup.position.set(0.35, 1.05, -0.1);
    station.add(cup);

    // Smiling Sun Pole
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.6, 8);
    const pole = new THREE.Mesh(poleGeo, palette.woodTrunk);
    pole.position.set(0, 1.3, -1.2);
    const sunGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const sun = new THREE.Mesh(sunGeo, palette.starGold);
    sun.position.set(0, 2.6, -1.2);
    station.add(pole, sun);
  } else if (category === "higiene") {
    // Water Shell Fountain & Giant Toothbrush
    const bathGeo = new THREE.CylinderGeometry(1.2, 0.9, 0.6, 16);
    const bath = new THREE.Mesh(bathGeo, palette.cloudWhite);
    bath.position.y = 0.45;
    const waterGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.05, 16);
    const water = new THREE.Mesh(waterGeo, palette.water);
    water.position.y = 0.65;
    station.add(bath, water);

    // Bubbles
    const bubbleGeo = new THREE.SphereGeometry(0.18, 10, 10);
    for (let b = 0; b < 6; b++) {
      const bubble = new THREE.Mesh(bubbleGeo, palette.water);
      const angle = (b / 6) * Math.PI * 2;
      bubble.position.set(Math.cos(angle) * 0.65, 0.8 + (b % 3) * 0.15, Math.sin(angle) * 0.65);
      station.add(bubble);
    }

    // Friendly Toothbrush standing up
    const handleGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.6, 8);
    const handle = new THREE.Mesh(handleGeo, palette.rainbowBlue);
    handle.position.set(1.1, 1.0, 0);
    handle.rotation.z = -0.2;
    const bristleGeo = new THREE.BoxGeometry(0.18, 0.35, 0.2);
    const bristles = new THREE.Mesh(bristleGeo, palette.cloudWhite);
    bristles.position.set(1.28, 1.7, 0);
    station.add(handle, bristles);
  } else if (category === "escola") {
    // Giant ABC Alphabet Blocks & Open Book
    const blockColors = [palette.rainbowRed, palette.rainbowYellow, palette.rainbowBlue];
    const letters = [
      [-0.6, 0.5, -0.4],
      [0.6, 0.5, -0.2],
      [-0.1, 0.9, 0.3],
    ];
    letters.forEach((pos, idx) => {
      const blockGeo = new THREE.BoxGeometry(0.65, 0.65, 0.65);
      const block = new THREE.Mesh(blockGeo, blockColors[idx]);
      block.position.set(...(pos as [number, number, number]));
      block.castShadow = true;
      station.add(block);
    });

    // Friendly School Arch with pencil columns
    const pencilGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.2, 8);
    const pencil1 = new THREE.Mesh(pencilGeo, palette.rainbowYellow);
    pencil1.position.set(-1.4, 1.1, 0.8);
    const pencil2 = new THREE.Mesh(pencilGeo, palette.rainbowBlue);
    pencil2.position.set(1.4, 1.1, 0.8);
    const beamGeo = new THREE.BoxGeometry(3.1, 0.25, 0.3);
    const beam = new THREE.Mesh(beamGeo, palette.rainbowPurple);
    beam.position.set(0, 2.2, 0.8);
    station.add(pencil1, pencil2, beam);
  } else if (category === "brincar") {
    // Rainbow Slide Bridge & Building Blocks
    const archCurve = new THREE.CylinderGeometry(1.6, 1.6, 0.6, 16, 1, true, 0, Math.PI);
    archCurve.rotateZ(Math.PI / 2);
    const arch = new THREE.Mesh(archCurve, palette.rainbowYellow);
    arch.position.set(0, 0.4, -0.8);
    station.add(arch);

    // Colorful toy pyramid
    const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), palette.rainbowRed);
    c1.position.set(0.6, 0.3, 0.5);
    const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.3, 0.55), palette.rainbowBlue);
    c2.position.set(0.6, 0.55, 0.5);
    const c3 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), palette.starGold);
    c3.position.set(0.6, 0.85, 0.5);
    station.add(c1, c2, c3);
  } else if (category === "sono") {
    // Cozy Cloud Bed & Glowing Crescent Moon
    const bedGeo = new THREE.BoxGeometry(1.6, 0.35, 1.8);
    const bed = new THREE.Mesh(bedGeo, palette.cloudWhite);
    bed.position.set(0, 0.35, 0);
    const pillowGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 12);
    pillowGeo.rotateZ(Math.PI / 2);
    const pillow = new THREE.Mesh(pillowGeo, palette.innerEar);
    pillow.position.set(0, 0.55, -0.6);
    station.add(bed, pillow);

    // Crescent Moon Lamp on star pedestal
    const moonGeo = new THREE.TorusGeometry(0.6, 0.2, 12, 24, Math.PI * 1.3);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xfff9c4,
      emissive: 0xfff59d,
      emissiveIntensity: 0.5,
      roughness: 0.3,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(0, 1.8, 0.2);
    moon.rotation.z = 0.5;
    station.add(moon);
  }

  return station;
}

// 6. Floating Animated Quest Token (Star / Heart / Sunshine)
export function createQuestToken(
  colorHex: number,
  palette: ReturnType<typeof createMaterialPalette>
): THREE.Group {
  const token = new THREE.Group();
  token.name = "QuestToken";

  const starGeo = new THREE.OctahedronGeometry(0.45, 0);
  const tokenMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    emissive: colorHex,
    emissiveIntensity: 0.45,
    roughness: 0.2,
    metalness: 0.4,
  });
  const starMesh = new THREE.Mesh(starGeo, tokenMat);
  starMesh.name = "TokenCore";
  starMesh.castShadow = true;
  token.add(starMesh);

  // Rotating outer orbit ring
  const haloGeo = new THREE.TorusGeometry(0.7, 0.035, 8, 24);
  const haloMesh = new THREE.Mesh(haloGeo, palette.starGold);
  haloMesh.name = "TokenRing";
  token.add(haloMesh);

  // Contact shadow
  const shadowGeo = new THREE.CircleGeometry(0.5, 16);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x333333,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.name = "TokenShadow";
  shadow.position.y = -1.2;
  token.add(shadow);

  return token;
}
