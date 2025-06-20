import React from 'react';
import { CampoFormularioProps } from "@/src/types/CampoFormularioProps";

export const CampoFormulario: React.FC<CampoFormularioProps> = ({
  label,
  tipo,
  nome,
  valor,
  onChange,
  obrigatorio = false,
  maxLength
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={tipo}
      name={nome}
      value={valor}
      onChange={onChange}
      maxLength={maxLength}
      required={obrigatorio}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
    />
  </div>
);