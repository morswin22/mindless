import { makeSketch } from 'atomic/utils';

/* 

Lacunarity = 2
* Controls increase in frequency of octaves
Persistance = 0.5
* Controls decrese in amplitude of octaves

Octaves:
1. 'main outline'
frequency = lacunarity^0 = 1
amplitude = persitance^0 = 1

2. 'boulders'
frequency = lacunarity^1 = 2
amplitude = persitance^1 = 0.5

3. 'small rocks'
frequency = lacunarity^2 = 4
amplitude = persitance^2 = 0.25

General:
frequency = lacunarity^i
amplitude = persitance^i

*/

const LandmassGenerator = () => makeSketch(p => {

  function getHeight(x, y, scale, octaves, persistance, lacunarity) {
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
  
  p.setup = () => {
    p.createCanvas(500, 500); // 500x500 scale 100
  
    // water and ocean midpoint p.color(23,138,182)
    const ocean = [p.color(4, 85, 176), p.color(6, 59, 171)];
    const water = [p.color(52, 212, 192), p.color(19, 189, 184)]
    const sand = [p.color(246, 215, 176), p.color(242, 210, 169), p.color(236, 204, 162), p.color(231, 196, 150), p.color(225, 191, 146)];
    // darkest grass p.color(20,66,32), p.color(23,87,40),
    const grass = [p.color(25, 107, 47), p.color(49, 122, 55), p.color(72, 137, 62)];
    const stone = [p.color(144, 162, 163), p.color(156), p.color(152, 160, 167), p.color(140, 141, 141), p.color(142, 148, 148)];
  
    const dirt = {
      colors: [p.color(86, 77, 64), p.color(76, 69, 59), p.color(66, 61, 54)],
      count: () => p.random(8,12),
      size: () => p.random(4,8)
    };
    const forest = {
      colors: [p.color(20,66,32), p.color(23,87,40)],
      count: () => p.random(8,12),
      size: () => p.random(6,14)
    };
    const temple = {
      colors: [p.color(255,0,255)],
      count: () => p.random(1,2),
      size: () => 1
    };
  
    const scale = 200;
    const octaves = 3;
    const persistance = 0.5;
    const lacunarity = 2;
  
    let min = 1;
    let max = 0;
  
    for (let x = 0; x < p.width; x++) {
      for (let y = 0; y < p.height; y++) {
        let z = getHeight(x, y, scale, octaves, persistance, lacunarity);
        if (z < min) min = z;
        if (z > max) max = z;
      }
    }
  
    p.loadPixels();
    for (let x = 0; x < p.width; x++) {
      for (let y = 0; y < p.height; y++) {
        let z = p.map(getHeight(x, y, scale, octaves, persistance, lacunarity), min, max, 0, 1);
        let col;
  
        if (z < 0.2) {
          col = p.random(ocean);
        } else if (z < 0.3) {
          col = p.random(water);
        } else if (z < 0.4) {
          col = p.random(sand);
        } else if (z < 0.8) {
          col = p.random(grass);
        } else {
          col = p.random(stone);
        }
  
        p.set(x, y, col);
      }
    }
    for (let patch of [dirt, forest, temple]) {
      for (let l = 0; l < patch.count(); l++) {
        let patchSize;
        let positive;
        let x, y;
        do {
          positive = true;
          patchSize = patch.size();
          x = p.random(1, p.width - 1);
          y = p.random(1, p.height - 1);
          let z = p.map(getHeight(x, y, scale, octaves, persistance, lacunarity), min, max, 0, 1);
          if (z >= 0.4 && z < 0.8) {
            for (let i = x - patchSize; i <= x + patchSize; i++) {
              for (let j = y - patchSize; j <= y + patchSize; j++) {
                if (p.dist(x,y,i,j) > patchSize+0.5) continue;
                let k = p.map(getHeight(i, j, scale, octaves, persistance, lacunarity), min, max, 0, 1);
                if (!(k >= 0.4 && k < 0.8)) {
                  positive = false;
                }
              }
            }
          } else {
            positive = false;
          }
        } while (!positive)
        for (let i = x - patchSize; i <= x + patchSize; i++) {
          for (let j = y - patchSize; j <= y + patchSize; j++) {
            if (p.dist(x,y,i,j) > patchSize+0.5) continue;
            p.set(i, j, p.random(patch.colors));
          }
        }
      }
    }
    // add mineshafts by checking is connected to stone
    p.updatePixels();
  }

});

export default LandmassGenerator;