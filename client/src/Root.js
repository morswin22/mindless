import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GlobalStyle from 'theme/GlobalStyle';
import { ROUTES } from 'utils/Routes/Routes';

import Login from 'views/Login/Login';
import Game from 'views/Game/Game';
import { UserProvider } from 'components/User/User';

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
