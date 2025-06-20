    import { Dispatch, SetStateAction } from "react";

    type DadosFormulario = {
    [key: string]: string | number | boolean;
    };

    type SelectOption = {
    label: string;
    value: string;
    };

    export type PaginaInscricaoProps = {
    fg: string;
    formData: DadosFormulario;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCepChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isSubmitting: boolean;
    isCursoMentoria: boolean;
    modalAssinaturaMentoriaAberta: boolean;
    setModalAssinaturaMentoriaAberta: Dispatch<SetStateAction<boolean>>;
    modalidadeDeAulas: SelectOption[];
    cursos: SelectOption[];
    };
