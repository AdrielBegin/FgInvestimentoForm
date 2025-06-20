import { FormularioInscricaoProps } from '@/src/types/FormularioInscricaoProps';
import React from 'react';
import { CampoFormulario } from '../campoFormulario/CampoFormulario';
import { CabecalhoFormulario } from '../cabecalhoFormulario/CabecalhoFormulario';
import { SelectFormulario } from '../selectFormulario/SelectFormulario';
import { ResumoPagamento } from '../resumoPagamento/ResumoPagamento';
import ModalAssinaturaMentoria from '../modals/ModalAssinaturaMentoria';
import { BotaoEnvio } from '../botaoEnvio/BotaoEnvio';


export const FormularioInscricao: React.FC<FormularioInscricaoProps> = ({
  formData,
  handleChange,
  handleSubmit,
  handlePhoneChange,
  handleCepChange,
  isSubmitting,
  isCursoMentoria,
  modalidadeDeAulas,
  cursos,
  modalAssinaturaMentoriaAberta,
  setModalAssinaturaMentoriaAberta
}) => (
  <div className="w-full md:w-3/5 p-8">
    <CabecalhoFormulario 
      titulo="Complete sua inscrição" 
      subtitulo="Preencha os dados abaixo para garantir sua vaga" 
    />
    
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CampoFormulario
          label="Nome Completo"
          tipo="text"
          nome="nome"
          valor={formData.nome}
          onChange={handleChange}
          obrigatorio
        />
        
        <CampoFormulario
          label="CPF"
          tipo="text"
          nome="cpfCnpj"
          valor={formData.cpfCnpj}
          onChange={handleChange}
          maxLength={18}
          obrigatorio
        />
        
        <CampoFormulario
          label="E-mail"
          tipo="email"
          nome="email"
          valor={formData.email}
          onChange={handleChange}
          obrigatorio
        />
        
        <CampoFormulario
          label="Celular/Telefone"
          tipo="text"
          nome="numeroContato"
          valor={formData.numeroContato}
          onChange={handlePhoneChange}
          obrigatorio
        />
        
        <CampoFormulario
          label="CEP"
          tipo="text"
          nome="cep"
          valor={formData.cep}
          onChange={handleCepChange}
          obrigatorio
        />
        
        <CampoFormulario
          label="Estado"
          tipo="text"
          nome="estado"
          valor={formData.estado}
          onChange={handleChange}
        />
        
        <CampoFormulario
          label="Cidade"
          tipo="text"
          nome="cidade"
          valor={formData.cidade}
          onChange={handleChange}
        />
        
        <CampoFormulario
          label="Logradouro"
          tipo="text"
          nome="logradouro"
          valor={formData.logradouro}
          onChange={handleChange}
        />
        
        <CampoFormulario
          label="Numero da casa"
          tipo="text"
          nome="numeroCasa"
          valor={formData.numeroCasa}
          onChange={handleChange}
        />
        
        <CampoFormulario
          label="Profissão"
          tipo="text"
          nome="profissao"
          valor={formData.profissao}
          onChange={handleChange}
          obrigatorio
        />
        
        <SelectFormulario
          label="Como irá participar do curso"
          nome="modalidadeDeAula"
          valor={formData.modalidadeDeAula}
          onChange={handleChange}
          opcoes={modalidadeDeAulas}
          obrigatorio
        />
      </div>
      
      <SelectFormulario
        label="Curso"
        nome="curso"
        valor={formData.curso}
        onChange={handleChange}
        opcoes={cursos}
      />
      
      <ResumoPagamento isCursoMentoria={isCursoMentoria} />
      
      <BotaoEnvio 
        isSubmitting={isSubmitting} 
        isCursoMentoria={isCursoMentoria}
        setModalAssinaturaMentoriaAberta={setModalAssinaturaMentoriaAberta}
      />
      
      {isCursoMentoria && (
        <ModalAssinaturaMentoria
          isOpen={modalAssinaturaMentoriaAberta} 
          onClose={() => setModalAssinaturaMentoriaAberta(false)} 
        />
      )}
    </form>
  </div>
);
