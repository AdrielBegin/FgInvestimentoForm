import { ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react';
import { DadosFormulario } from './DadosFormulario';

export interface FormularioInscricaoProps {
  formData: DadosFormulario;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handlePhoneChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCepChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  isCursoMentoria: boolean;
  modalidadeDeAulas: Option[];
  cursos: Option[];
  modalAssinaturaMentoriaAberta: boolean;
  setModalAssinaturaMentoriaAberta: Dispatch<SetStateAction<boolean>>;  
}
