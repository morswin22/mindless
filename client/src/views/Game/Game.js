import React from 'react';
import { useAuthorization } from 'components/User/User';

const Game = () => {
  const { user } = useAuthorization(user => user);

  // console.log(user);

  return (<></>)
}

export default Game;