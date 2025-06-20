export const SelectFormulario: React.FC<SelectFormularioProps> = ({
  label,
  nome,
  valor,
  onChange,
  opcoes,
  obrigatorio = false
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      name={nome}
      value={valor}
      onChange={onChange}
      required={obrigatorio}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
    >
      <option value="">Selecione...</option>
      {opcoes.map((opcao) => (
        <option key={opcao.value} value={opcao.value}>
          {opcao.label}
        </option>
      ))}
    </select>
  </div>
);