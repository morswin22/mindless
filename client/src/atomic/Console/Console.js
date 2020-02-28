import Console from 'components/Console/Console';

const ConsoleIntegration = p => {
  const cli = new Console(p);

  p.setup = () => {
    p.createCanvas(500, 500);
  }

  p.draw = () => {
    cli.draw();
  }
}

export default ConsoleIntegration;