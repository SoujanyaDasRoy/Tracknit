type WaveformTrack = {
  id: string;
  title?: string;
  artist?: string;
  genre?: string[];
  bpm?: number | string;
  duration?: string;
  waveform?: number[];
};

export const WAVEFORM_BAR_COUNT = 80;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let result = state;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
};

const resampleWaveform = (source: number[], count: number) => {
  if (!source.length) return [];

  const max = Math.max(...source.map((value) => Math.abs(value))) || 1;
  return Array.from({ length: count }, (_, index) => {
    const sourceIndex = Math.round((index / Math.max(1, count - 1)) * (source.length - 1));
    const normalized = Math.abs(source[sourceIndex]) / max;
    return clamp(12 + normalized * 84, 12, 96);
  });
};

const parseBpm = (bpm?: number | string) => {
  const parsed = Number(bpm);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 96;
};

export function getTrackWaveform(track: WaveformTrack, count = WAVEFORM_BAR_COUNT) {
  if (track.waveform?.length) {
    return resampleWaveform(track.waveform, count);
  }

  const seedText = [
    track.id,
    track.title,
    track.artist,
    track.genre?.join("|"),
    track.bpm,
    track.duration,
  ].filter(Boolean).join("::");

  const random = createRandom(hashString(seedText));
  const bpm = parseBpm(track.bpm);
  const genreText = track.genre?.join(" ").toLowerCase() || "";
  const isSparse = genreText.includes("ambient") || genreText.includes("piano") || genreText.includes("folk");
  const isPercussive = bpm >= 118 || genreText.includes("dance") || genreText.includes("techno") || genreText.includes("hip hop");
  const pattern = Math.floor(random() * 5);

  const sectionShapes = [
    [0.28, 0.48, 0.82, 0.68, 0.36],
    [0.68, 0.42, 0.76, 0.54, 0.30],
    [0.22, 0.34, 0.52, 0.88, 0.62],
    [0.58, 0.72, 0.46, 0.78, 0.40],
    [0.42, 0.84, 0.30, 0.70, 0.56],
  ];

  const sectionLevels = sectionShapes[pattern].map((value) =>
    clamp(value + (random() - 0.5) * 0.22 + (isSparse ? -0.08 : 0) + (isPercussive ? 0.07 : 0), 0.18, 0.95)
  );

  const quietPockets = Array.from({ length: isSparse ? 3 : 1 + Math.floor(random() * 2) }, () => ({
    center: 0.08 + random() * 0.84,
    width: 0.025 + random() * (isSparse ? 0.08 : 0.045),
    depth: 0.28 + random() * 0.45,
  }));

  const transientCount = isPercussive ? 9 + Math.floor(random() * 8) : 4 + Math.floor(random() * 5);
  const transients = Array.from({ length: transientCount }, () => ({
    center: random(),
    strength: 0.18 + random() * (isPercussive ? 0.55 : 0.35),
    width: 0.006 + random() * 0.016,
  }));

  const beatDensity = clamp(bpm / 18, 3.8, 9.5);
  const waveA = 1.8 + random() * 4.4;
  const waveB = 6 + random() * 12;
  const phaseA = random() * Math.PI * 2;
  const phaseB = random() * Math.PI * 2;

  return Array.from({ length: count }, (_, index) => {
    const t = index / Math.max(1, count - 1);
    const sectionPosition = t * (sectionLevels.length - 1);
    const sectionIndex = Math.floor(sectionPosition);
    const sectionBlend = sectionPosition - sectionIndex;
    const sectionLevel = sectionLevels[sectionIndex] * (1 - sectionBlend) + sectionLevels[Math.min(sectionIndex + 1, sectionLevels.length - 1)] * sectionBlend;

    const rollingBody = 0.46 + Math.sin(t * Math.PI * waveA + phaseA) * 0.22 + Math.sin(t * Math.PI * waveB + phaseB) * 0.11;
    const beatPulse = Math.pow(Math.abs(Math.sin(t * Math.PI * beatDensity)), isPercussive ? 3.5 : 2.2);
    const localNoise = (random() - 0.5) * (isSparse ? 0.16 : 0.28);
    const edgeFade = clamp(Math.sin(t * Math.PI) * 1.2, 0.34, 1);

    let value = (rollingBody + beatPulse * (isPercussive ? 0.36 : 0.18) + localNoise) * sectionLevel * edgeFade;

    for (const pocket of quietPockets) {
      const distance = Math.abs(t - pocket.center);
      if (distance < pocket.width) {
        value *= 1 - pocket.depth * (1 - distance / pocket.width);
      }
    }

    for (const transient of transients) {
      const distance = Math.abs(t - transient.center);
      if (distance < transient.width) {
        value += transient.strength * (1 - distance / transient.width);
      }
    }

    return clamp(10 + value * 86, 10, 98);
  });
}
