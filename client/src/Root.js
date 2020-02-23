import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GlobalStyle from 'theme/GlobalStyle';
import { ROUTES } from 'utils/Routes/Routes';

import Login from 'views/Login/Login';
import Game from 'views/Game/Game';
import { UserProvider } from 'components/User/User';

// import io from 'socket.io-client';
// import p5 from 'p5'; 
// import Login from './components/Login/Login';
// import Client from './components/Client/Client';
// import User from './components/User/User';

// const socket = io('http://localhost:5000')
// const logger = new Login(document.querySelector('#login'));
// const client = new Client(socket);

// client.login(logger)
//   .then(data => {
//     const user = new User(data);

//     new p5(p => {
//       p.setup = () => {
//         p.createCanvas(p.windowWidth, p.windowHeight);
//       };
    
//       p.windowResized = () => {
//         p.resizeCanvas(p.windowWidth, p.windowHeight);
//       }
    
//       p.draw = () => {
//         p.background(51);
//         p.fill(255);
//         p.rect(p.width/2 - 25, p.height/2 - 25, 50, 50);
//       };
//     }, document.querySelector('#p5'));

//   })
//   .catch(console.error);

const Root = () => (
  <UserProvider>
    <GlobalStyle />
    <Router>

      <Switch>
        <Route exact path={ROUTES.home} component={null} />
        <Route exact path={ROUTES.login} component={Login} />
        <Route exact path={ROUTES.game} component={Game} />
      </Switch>
    </Router>
  </UserProvider>
);

export default Root;
