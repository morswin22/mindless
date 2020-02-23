import io from 'socket.io-client';
import p5 from 'p5'; 
import Login from './components/Login/Login';
import Client from './components/Client/Client';
import User from './components/User/user';

const socket = io('http://localhost:5000')
const logger = new Login(document.querySelector('#login'));
const client = new Client(socket);

client.login(logger)
  .then(user => {
    const user = new User(user);

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

  })
  .catch(console.error);
