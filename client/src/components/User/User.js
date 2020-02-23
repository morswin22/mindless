import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from 'utils/Routes/Routes';
import io from 'socket.io-client';

const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [socket, setSocket] = useState(null);

  const handleUserFromSocket = ({ error, user }) => {
    if (error) {
      console.error(error);
    } else {
      setUser(user);
    }
  };

  useEffect(()=>{ 
    if (!socket) {
      const newSocket = io('http://localhost:5000')
      newSocket.on('connect', () => {
        newSocket.emit('getSession', handleUserFromSocket)
      })
      setSocket(newSocket);
    }
  }, [socket]);

  const login = (credentials) => {
    socket.emit('login', credentials, handleUserFromSocket);
  }

  return socket ? (
    <UserContext.Provider value={{
      user,
      socket,
      login
    }}>
      { children }
    </UserContext.Provider>
  ) : null;
}

export const useAuthorization = ( condition ) => {
  const { user } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (user !== undefined && !condition(user)) history.push(ROUTES.login);
  }, [user, history, condition]);

  return {
    loading: user === undefined,
    error: user === null,
    user
  }
}

export default UserContext;