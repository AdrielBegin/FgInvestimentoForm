export const BeneficioItem: React.FC<BeneficioItemProps> = ({ texto }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center mr-3 mt-1">
      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span>{texto}</span>
  </div>
);