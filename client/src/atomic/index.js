import React from 'react';
import P5Wrapper from 'react-p5-wrapper';
import Select from './Select';
import { useParams } from 'react-router-dom';

const subviews = { /* insert atomic view-like components here */ };

const Atomic = () => {
  const { id } = useParams();

  return id ? <P5Wrapper sketch={subviews[id]} /> : <Select subviews={subviews} />;
}

export default Atomic;