import Image from 'next/image';
import { FC } from 'react';
import { BeneficioItem } from '../beneficioItem/BeneficioItem';
import { InvestimentoCurso } from '../investimentoCurso/InvestimentoCurso';


export const InformacoesCurso: FC<InformacoesCursoProps> = ({ fg, isCursoMentoria }) => (
  <div className="w-full md:w-2/5 bg-blue-600 text-white flex flex-col justify-center items-center p-8 min-h-screen">
    <div className="mb-6 flex justify-center">
      <Image
        src={fg}
        alt="Logo da empresa"
        width={230}
        height={150}
        className="filter brightness-0 invert"
      />
    </div>

    <h2 className="text-2xl font-bold mb-4">Curso CADI</h2>
    <h3 className="text-xl font-semibold mb-6">Carreira do Investidor</h3>

    <div className="space-y-4 mb-8">
      <BeneficioItem texto="Materiais exclusivos" />
      <BeneficioItem texto="Suporte especializado" />
    </div>
    
    <InvestimentoCurso isCursoMentoria={isCursoMentoria} />
  </div>
);
