/* eslint-env node */
// import { promises as fs } from 'fs';
import fs from 'fs-extra';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const DIST_PATH = path.join(__dirname, '..', 'dist');
export const SRC_PATH = path.join(__dirname, '..', 'src');
export const buildOptions = {
  entryPoints: [
    path.join(SRC_PATH, 'index.js'),
  ],
  outdir: path.join(DIST_PATH),
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  },
  loader: {
    '.js': 'jsx',
  },
  format: 'esm',
  bundle: true,
}

export async function prebuild() {
  await fs.rmdir(DIST_PATH, { recursive: true });
  await fs.mkdir(DIST_PATH);
  await fs.copy(
    path.join(__dirname, '..', 'public'),
    path.join(DIST_PATH)
  );
}