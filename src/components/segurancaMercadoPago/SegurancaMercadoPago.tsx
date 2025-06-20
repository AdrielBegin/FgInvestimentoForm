import Script from 'next/script';

export const SegurancaMercadoPago = () => (
  <Script
    src="https://www.mercadopago.com/v2/security.js"
    data-view="item"
    strategy="afterInteractive"
  />
);