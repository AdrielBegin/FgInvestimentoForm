type SelectFormularioProps = {
  label: string;
  nome: string;
  valor: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  opcoes: OpcaoSelect[];
  obrigatorio?: boolean;
};