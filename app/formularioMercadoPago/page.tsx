
'use client';
import FormMecadoPago from '@/app/components/formMecadoPago/formMercadoPago';

export default function FormMecadoPagoPage() {
  const adminEmail = process.env.NEXT_PUBLIC_FIREBASE_ADM_EMAIL_ACCESS;
  console.log("adminEmail", adminEmail);

  return (
    <div className="">
      <FormMecadoPago />
    </div>
  );
}