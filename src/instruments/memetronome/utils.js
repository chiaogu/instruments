import { parseGIF, decompressFrames } from 'gifuct-js'

const cache = {};

export async function getGifFrames(url) {
  if(cache[url]) return cache[url];
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const gif = await parseGIF(buffer);
  cache[url] = await decompressFrames(gif, true);
  return cache[url];
}
