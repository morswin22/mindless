import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ROUTES } from 'utils/Routes/Routes';

const Wrapper = styled.div``;
const Item = styled(Link)``;

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