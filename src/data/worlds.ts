// World definitions. Numbers marked (tune) in the GDD live here.
export interface Palette {
  grassLow: string; grassHigh: string; grassDry: string;
  rock: string; rockDark: string; vein: string;
  sand: string; snow: string; seabed: string; water: string;
  skyDayZenith: string; skyDayHorizon: string;
  skySunsetZenith: string; skySunsetHorizon: string;
  skyNightZenith: string; skyNightHorizon: string;
  space: string; atmosphere: string; aurora: string;
  glowTeal: string; glowAmber: string;
}

export interface WorldDef {
  id: string;
  name: string;
  seed: number;
  radius: number;          // metres (tune)
  seaLevel: number;        // metres relative to radius
  gravity: number;         // m/s²
  dayLengthSec: number;    // one full rotation (tune)
  terrain: {
    hillAmp: number; hillFreq: number;
    ridgeAmp: number; ridgeFreq: number; ridgeMaskFreq: number;
    riverFreq: number; riverWidth: number; riverDepth: number;
    forestFreq: number;
    polarCap: number;      // |y| above which snow appears
  };
  spawn: {
    dir: [number, number, number]; // unit direction of the starting clearing
    flatRadiusDeg: number;
    height: number;
    sunElevationDeg: number;       // sun height above the horizon when you arrive
  };
  ringedPlanet: { azimuthDeg: number; elevationDeg: number; distance: number; radius: number };
  palette: Palette;
}

export const JIVAGRAHA: WorldDef = {
  id: 'jivagraha',
  name: 'Jivagraha',
  seed: 1729,
  radius: 150,
  seaLevel: -2.6,
  gravity: 9.8,
  dayLengthSec: 360,
  terrain: {
    hillAmp: 5.5, hillFreq: 2.4,
    ridgeAmp: 11, ridgeFreq: 5.5, ridgeMaskFreq: 1.1,
    riverFreq: 1.35, riverWidth: 0.045, riverDepth: 1.4,
    forestFreq: 1.6,
    polarCap: 0.9,
  },
  spawn: { dir: [0.28, 0.42, 0.86], flatRadiusDeg: 7, height: 1.6, sunElevationDeg: 25 },
  ringedPlanet: { azimuthDeg: 34, elevationDeg: 17, distance: 2600, radius: 330 }, // azimuth: + is to your left at the start
  palette: {
    grassLow: '#3c9a35', grassHigh: '#a6d23c', grassDry: '#d2c246',
    rock: '#ead6b6', rockDark: '#cfae86', vein: '#b2512e',
    sand: '#e7d3a1', snow: '#f3f5fb', seabed: '#3d8f86', water: '#2fb6a6',
    skyDayZenith: '#6a5ad6', skyDayHorizon: '#ffd79e',
    skySunsetZenith: '#5444a8', skySunsetHorizon: '#ff9f5a',
    skyNightZenith: '#0b0a24', skyNightHorizon: '#2a2160',
    space: '#07061a', atmosphere: '#9fc3ff', aurora: '#5dffb4',
    glowTeal: '#5cffd6', glowAmber: '#ffb347',
  },
};
