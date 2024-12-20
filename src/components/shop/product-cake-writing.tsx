'use client';

import { useState } from 'react';
import CakeWriting from './cake-writing';

interface ProductCakeWritingProps {
  onChange?: (text: string) => void;
}

export default function ProductCakeWriting({ onChange }: ProductCakeWritingProps) {
  const [cakeWriting, setCakeWriting] = useState('');
  
  const handleChange = (text: string) => {
    setCakeWriting(text);
    if (onChange) {
      onChange(text);
    }
  };

  return (
    <CakeWriting
      value={cakeWriting}
      onChange={handleChange}
    />
  );
}
