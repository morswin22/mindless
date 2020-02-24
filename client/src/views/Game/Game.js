import React from 'react';
import { useAuthorization } from 'components/User/User';

const Game = () => {
  /* const { user } = */ useAuthorization(user => user);

  return (<></>)
}

export default Game;