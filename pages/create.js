import Engine from '../components/Engine.js';

import { useState } from 'react';
import { palettes } from '../data/palettes.js';

// units
const tileCount = 16;
const objectCount = 16;
const spriteSize = 8;
const mapSize = 8;

// default engine code
const defaultCode =
`// called once when the game starts
function start() {

}

// called every frame
function update() {

}
`;

export default function Create() {
  const codes = Array(objectCount).fill(defaultCode);
  const sprite = Array(spriteSize * spriteSize).fill(0);
  const colors = palettes[0].colors;
  const tiles = Array(tileCount).fill(sprite);
  const objects = Array(objectCount).fill(sprite);
  const background = Array(mapSize * mapSize).fill(0);

  // construct engine data
  const data = {
    codes, colors, background, gameObjects: [], title: '', description: '',
    tiles: JSON.stringify(tiles), objects: JSON.stringify(objects),
  };

  return (
    <Engine
      data={data}
      tileCount={tileCount} objectCount={objectCount} spriteSize={spriteSize}
    />
  );
}
