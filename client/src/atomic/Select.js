import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ROUTES } from 'utils/Routes/Routes';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
`;
const Item = styled(Link)`
  margin: 1em;
  color: #0080ff;
  text-decoration: none;
`;

const Select = ({ subviews }) => (
  <Wrapper>
    {Object.keys(subviews).map( key => (
      <Item key={key} to={ROUTES.atomic.replace(':id?', key)}>
        {key}
      </Item>
    ))}
  </Wrapper>
)

export default Select;