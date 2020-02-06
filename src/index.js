import p5 from 'p5'; 

new p5(p => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

  p.draw = () => {
    p.background(51);
    p.fill(255);
    p.rect(p.width/2 - 25, p.height/2 - 25, 50, 50);
  };
}, document.querySelector('#p5'));