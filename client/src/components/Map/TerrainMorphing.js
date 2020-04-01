export const TERRAIN_BASIC_TYPES = [
  'sea',
  'water',
  'sand',
  'grass',
  'stone'
];

export const TERRAIN_TYPES = (() => {

  const types = ['sea','water','sand','grass','stone'];
  const textures = [1,4,6,4,1];
  const itextures = [0,4,6,0,1];

  const morphed = {};
  let current = 0;

  for (const type of types) {
    if (type === 'sea') {
      morphed[`${type}00`] = current++;
    } else {
      for (let i = 0; i < textures.length; i++) {
        for (let j = 0; j < textures[i]; j++) {
          morphed[`${type}${i}${j}`] = current++;
        }
      }
    }
    if (type !== 'stone') {
      for (let i = 0; i < itextures.length; i++) {
        for (let j = 0; j < itextures[i]; j++) {
          morphed[`${type}i${i}${j}`] = current++;
        }
      }
    }
  }

  return morphed;  
})();

export const terrainFilter = input => {

  const self = input[4];
  const z = TERRAIN_BASIC_TYPES.indexOf(self);

  const table = input.map(type => {
    const cell = TERRAIN_BASIC_TYPES.indexOf(type);
    let r = null;
    if (cell > z) {
      r = 1;
    } else if (cell === z) {
      r = 0;
    } else if (cell < z) {
      r = -1;
    } else if (cell === -1) {
      r = 0;
    }
    return r;
  });

  const getAt = (x, y) => table[y * 3 + x] !== -1;
  const getAt2 = (x, y) => table[y * 3 + x] === 1;

  const morphed = {
    n: 0, 
    d: 0, 
    nCorners: Array(4).fill(false),
    dCorners: Array(4).fill(false),
    m: 0,
    d2: 0,
    mCorners: Array(4).fill(false),
  };

  // THIS CHECKS FOR SAME TYPE

  if (getAt(0,0)) { // top left
    morphed.nCorners[0] = true;
    morphed.dCorners[0] = true;
  }
  if (getAt(1,0)) { // top middle
    morphed.nCorners[0] = true;
    morphed.nCorners[1] = true;
  }
  if (getAt(2,0)) { // top right
    morphed.nCorners[1] = true;
    morphed.dCorners[1] = true;
  }

  if (getAt(0,1)) { // middle left
    morphed.nCorners[0] = true;
    morphed.nCorners[2] = true;
  }
  if (getAt(2,1)) { // middle right
    morphed.nCorners[1] = true;
    morphed.nCorners[3] = true;
  }

  if (getAt(0,2)) { // bottom left
    morphed.nCorners[2] = true;
    morphed.dCorners[2] = true;
  }
  if (getAt(1,2)) { // bottom middle
    morphed.nCorners[2] = true;
    morphed.nCorners[3] = true;
  }
  if (getAt(2,2)) { // bottom right
    morphed.nCorners[3] = true;
    morphed.dCorners[3] = true;
  }

  morphed.n = 4 - morphed.nCorners.reduce((acc, val) => acc + Number(val), 0);

  switch(morphed.n) {
    case 1:
      if ((morphed.dCorners[0] || getAt(1,0) || getAt(0,1)) && (getAt(1,0) || morphed.dCorners[1]) && (getAt(0,1) || morphed.dCorners[2])) { // top left
        morphed.d = 0;
      } else if ((morphed.dCorners[1] || getAt(1,0) || getAt(2,1)) && (morphed.dCorners[0] || getAt(1,0)) && (getAt(2,1) || morphed.dCorners[3])) { // top right
        morphed.d = 1;
      } else if ((morphed.dCorners[2] || getAt(0,1) || getAt(1,2)) && (getAt(0,1) || morphed.dCorners[0]) && (getAt(1,2) || morphed.dCorners[3])) { // bottom left
        morphed.d = 2;
      } else if ((morphed.dCorners[3] || getAt(2,1) || getAt(1,2)) && (getAt(2,1) || morphed.dCorners[1]) && (getAt(1,2) || morphed.dCorners[2])) { // bottom right
        morphed.d = 3;
      }
      break;
    case 2:
      if (morphed.dCorners.indexOf(true) === -1) { // 1 on side
        if (getAt(1,0)) {
          morphed.d = 0;
        } else if (getAt(1,2)) {
          morphed.d = 3;
        } else if (getAt(0,1)) {
          morphed.d = 1;
        } else if (getAt(2,1)) {
          morphed.d = 2;
        }
      } else { // 2 on corners
        const bars = {
          top: Number(getAt(0,0)) + Number(getAt(1,0)) + Number(getAt(2,0)),
          bottom: Number(getAt(0,2)) + Number(getAt(1,2)) + Number(getAt(2,2)),
          left: Number(getAt(0,0)) + Number(getAt(0,1)) + Number(getAt(0,2)),
          right: Number(getAt(2,0)) + Number(getAt(2,1)) + Number(getAt(2,2)),
        };
        if (bars.top > 1 && bars.left <= 1 && bars.right <= 1) { // top bar
          morphed.d = 0;
        } else if (bars.bottom > 1 && bars.left <= 1 && bars.right <= 1) { // bottom bar
          morphed.d = 3;
        } else if (bars.left > 1 && bars.top <= 1 && bars.bottom <= 1) { // bottom bar
          morphed.d = 1;
        } else if (bars.right > 1 && bars.top <= 1 && bars.bottom <= 1) { // bottom bar
          morphed.d = 2;
        } else if (getAt(0,0) && getAt(2,2)) { // diagonals top left and down right
          morphed.d = 4;
        } else if (getAt(0,2) && getAt(2,0)) { // diagonals top right and down left
          morphed.d = 5;
        }
      }
      break;
    case 3:
      morphed.d = morphed.dCorners.indexOf(true);
      break;
    default:
  }

  // THIS CHECKS FOR TYPE ABOVE

  // need to check only close neighbours
  if (getAt2(1,0) && getAt2(0, 1)) morphed.mCorners[0] = true; // top left
  if (getAt2(1,0) && getAt2(2, 1)) morphed.mCorners[1] = true; // top right
  if (getAt2(1,2) && getAt2(0, 1)) morphed.mCorners[2] = true; // bottom left
  if (getAt2(1,2) && getAt2(2, 1)) morphed.mCorners[3] = true; // bottom right

  morphed.m = morphed.mCorners.reduce((acc, val) => acc + Number(val), 0);

  switch(morphed.m) {
    case 1:
      morphed.d2 = morphed.mCorners.indexOf(true);
      break;
    case 2:
      if (morphed.mCorners[0] && morphed.mCorners[1]) { // top bar
        morphed.d2 = 0;
      } else if (morphed.mCorners[2] && morphed.mCorners[3]) { // bottom bar
        morphed.d2 = 3;
      } else if (morphed.mCorners[0] && morphed.mCorners[2]) { // left bar
        morphed.d2 = 1;
      } else if (morphed.mCorners[1] && morphed.mCorners[3]) { // right bar
        morphed.d2 = 2;
      } else if (morphed.mCorners[0] && morphed.mCorners[3]) { // diagonal top left and bottom right
        morphed.d2 = 4;
      } else if (morphed.mCorners[1] && morphed.mCorners[2]) { // diagonal top right and bottom left
        morphed.d2 = 5;
      }
      break;
    case 3:
      console.error('This should never happen');
      break;
    default:
  }

  const r = [`${self}${morphed.n}${morphed.d}`];
  if (morphed.m !== 0) r.push(`${self}i${morphed.m}${morphed.d2}`);
  if (morphed.n !== 0) r.unshift(`${TERRAIN_BASIC_TYPES[z-1]}00`);

  return r;
}