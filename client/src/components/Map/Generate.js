import { TERRAIN_BASIC_TYPES, TERRAIN_TYPES, terrainFilter } from './TerrainMorphing';

export const DEFAULT_CONFIG = {
  tick: 20,
  seed: 0,
  scale: 200,
  octaves: 3,
  persistance: 0.5,
  lacunarity: 2,
  width: 500,
  height: 500,
  landmass: {
    ocean: 0.2,
    water: 0.3,
    sand: 0.4,
    grass: 0.8,
    stone: 1,
  },
  structures: {
    dirt: {
      count: [8, 12],
      size: [4, 8],
    },
    forest: {
      count: [8, 12],
      size: [6, 14],
    },
    temple: {
      count: [1, 2],
      size: 1,
    },
  }
};

const getHeight = (p, x, y, scale, octaves, persistance, lacunarity) => {
  let amplitude = 1;
  let frequency = 1;
  let noiseHeight = 0;

  for (let i = 0; i < octaves; i++) {
    const sampleX = x / scale * frequency;
    const sampleY = y / scale * frequency;
    let perlin = p.noise(sampleX, sampleY) * 2 - 1;
    noiseHeight += perlin * amplitude;

    amplitude *= persistance;
    frequency *= lacunarity;
  }

  return p.map(noiseHeight, -1, 1, 0, 1);
}

const mapGenerate = (p, config) => new Promise((resolve, reject) => {
  
  config = {...DEFAULT_CONFIG, ...config};
  const { 
    seed,
    scale, 
    octaves, 
    persistance, 
    lacunarity, 
    width, 
    height,
    landmass: {
      ocean,
      water,
      sand,
      grass,
      // stone,
    },
    structures,
  } = config;

  // Set p5 noiseSeed and p5 randomSeed
  p.noiseSeed(seed);
  p.randomSeed(seed);

  let min = 1
  let max = 0;
  let heightMap = [];
  const spawnpoint = { x: 0, y: 0};
  
  const callStack = [
    () => {
      // Get min and max height for re-mapping
      console.time('getMinMax');
      for (let x = 0; x < width; x++) {
        heightMap.push([]);
        for (let y = 0; y < height; y++) {
          let z = getHeight(p, x, y, scale, octaves, persistance, lacunarity);
          if (z < min) min = z;
          if (z > max) max = z;
          heightMap[x].push(z);
        }
      }
      console.timeEnd('getMinMax');
    },
    () => {
      // Generate height map
      console.time('generateHeightMap');
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let z = p.map(heightMap[x][y], min, max, 0, 1);
          let type;
    
          if (z < ocean) {
            type = TERRAIN_BASIC_TYPES[0];
          } else if (z < water) {
            type = TERRAIN_BASIC_TYPES[1];
          } else if (z < sand) {
            type = TERRAIN_BASIC_TYPES[2];
          } else if (z < grass) {
            type = TERRAIN_BASIC_TYPES[3];
          } else {
            type = TERRAIN_BASIC_TYPES[4];
          }
    
          heightMap[x][y] = type;
        }
      }
      console.timeEnd('generateHeightMap');
    }, 
    () => {
      if (config.preview) return; // skip morphing
      // Filter that adds terrain morphing with layering
      console.time('addTerrainMorphing');

      const filtered = Array(heightMap.length).fill(null).map((n,x) => Array(heightMap[0].length).fill(null).map((n,y) => heightMap[x][y]));

      // extend filter beyond rendered map
      for (let x = 1; x < width-1; x++) {
        for (let y = 1; y < height-1; y++) {   
          filtered[x][y] = terrainFilter([
            heightMap[x-1][y-1], heightMap[x][y-1], heightMap[x+1][y-1], 
            heightMap[x-1][y], heightMap[x][y], heightMap[x+1][y], 
            heightMap[x-1][y+1], heightMap[x][y+1], heightMap[x+1][y+1],
          ]);
        }
      }

      heightMap = filtered;

      console.timeEnd('addTerrainMorphing');
    },
    () => {
      // Generate structures
      console.time('generateStructures');
      for (let structureName in structures) {
        const structure = structures[structureName];
        const count = Math.floor(typeof structure.count === 'object' ? p.random(structure.count[0], structure.count[1]) : structure.count);
        for (let l = 0; l < count; l++) {
          let structureSize;
          let positive;
          let x, y;
          do {
            positive = true;
            structureSize = Math.floor(typeof structure.size === 'object' ? p.random(structure.size[0], structure.size[1]) : structure.size);
            x = Math.floor(p.random(1, width - 1));
            y = Math.floor(p.random(1, height - 1));
            let z = p.map(getHeight(p, x, y, scale, octaves, persistance, lacunarity), min, max, 0, 1);
            if (z >= sand && z < grass) {
              for (let i = x - structureSize; i <= x + structureSize; i++) {
                for (let j = y - structureSize; j <= y + structureSize; j++) {
                  if (p.dist(x,y,i,j) > structureSize+0.5) continue;
                  let k = p.map(getHeight(p, i, j, scale, octaves, persistance, lacunarity), min, max, 0, 1);
                  if (!(k >= sand && k < grass)) {
                    positive = false;
                  }
                }
              }
            } else {
              positive = false;
            }
          } while (!positive)
          for (let i = x - structureSize; i <= x + structureSize; i++) {
            for (let j = y - structureSize; j <= y + structureSize; j++) {
              if (p.dist(x,y,i,j) > structureSize+0.5) continue;
              if (heightMap[i] && heightMap[i][j]) heightMap[i][j] = TERRAIN_TYPES[structureName];
            }
          }
        }
      }
      console.timeEnd('generateStructures');
    }, () => {
      // Generate spawn point
      console.time('getSpawnpoint');
      do {
        spawnpoint.x = Math.floor(p.random(0, width));
        spawnpoint.y = Math.floor(p.random(0, height));
      } while (heightMap[spawnpoint.x][spawnpoint.y] !== TERRAIN_TYPES.grass);
      console.timeEnd('getSpawnpoint');
    }, () => {
      console.timeEnd('done');
      resolve({ map: heightMap, mapSeed: seed, spawnpoint });
    }
  ];

  const cycler = () => {
    callStack.shift()();
    if (callStack.length) setTimeout(cycler, config.tick);
  }

  console.time('done');

  cycler();

});

export default mapGenerate;