import { useExchangeRate } from '../../contexts/ExchangeRateContext';

export default function PriceDisplay({ priceUsd, className = '', showBs = true }) {
  const { toBs, loading } = useExchangeRate();

  if (loading || !showBs) {
    return <span className={`font-semibold text-green-600 ${className}`}>${parseFloat(priceUsd).toFixed(2)}</span>;
  }

  const priceBs = toBs(parseFloat(priceUsd));

  return (
    <div className={className}>
      <span className="font-semibold text-green-600">${parseFloat(priceUsd).toFixed(2)}</span>
      <span className="text-gray-500 text-xs ml-1">/ Bs. {priceBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
  );
}
