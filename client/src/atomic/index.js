import React from 'react';
import Select from './Select';
import { useParams } from 'react-router-dom';

import LandmassGenerator from './LandmassGenerator/LandmassGenerator';
import ConsoleIntegration from './Console/Console';
const subviews = { LandmassGenerator, ConsoleIntegration };

const Atomic = () => {
  const { id } = useParams();

  return id ? subviews[id]() : <Select subviews={subviews} />;
}

export default Atomic;