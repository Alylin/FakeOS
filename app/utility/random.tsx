import seedRandom from 'seedrandom';

export default function randomIntFromInterval(min: number, max: number, seed?: string) {
  if (seed) {
    const rng = seedRandom(seed);
    return Math.floor(rng() * (max - min + 1) + min);
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}