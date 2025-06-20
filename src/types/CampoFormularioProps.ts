import React, { ChangeEvent } from 'react';
export interface CampoFormularioProps {
  label: string;
  tipo: string;
  nome: string;
  valor: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  obrigatorio?: boolean;
  maxLength?: number;
}