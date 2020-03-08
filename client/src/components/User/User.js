import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from 'utils/Routes/Routes';
import io from 'socket.io-client';

const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [socket, setSocket] = useState(null);

  useEffect(()=>{ 
    if (!socket) {
      const newSocket = io('http://localhost:5000');
      newSocket.sessionEmit = function() {
        const params = Array.prototype.slice.call(arguments);
        newSocket.emit(params.shift(), localStorage.getItem('sid'), ...params);
      }
      newSocket.on('connect', () => {
        newSocket.sessionEmit('authorize', ({ error, user, sid }) => {
          if (user) {
            setUser(user);
          } else {
            setUser(null);
            if (error) console.error(error);
            if (sid) localStorage.setItem('sid', sid);
          }
        });
      })
      setSocket(newSocket);
    }
  }, [socket]);

  const login = (credentials) => {
    return new Promise((resolve, reject) => {
      socket.sessionEmit('login', credentials, ({ error, user }) => {
        if (error) {
          reject(error);
        } else {
          setUser(user);
          resolve(user);
        }
      });
    })
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