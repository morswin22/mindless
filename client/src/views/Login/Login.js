import React, { useContext, useState } from 'react';
import UserContext from 'components/User/User';
import styled from 'styled-components';

const Wrapper = styled.form``;
const Input = styled.input``;

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(UserContext);

  const handleName = ({ target: { value } }) => setName(value);
  const handlePassword = ({ target: { value } }) => setPassword(value);

  const handleLogin = e => {
    e.preventDefault();
    login({ name, password });
  }

  return (
    <Wrapper onSubmit={handleLogin}>
      <Input type="text" onChange={handleName} value={name} />
      <Input type="password" onChange={handlePassword} value={password} />
      <Input type="submit" /> 
    </Wrapper>
  )
};

export default Login;