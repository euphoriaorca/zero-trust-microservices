export * from './CustomError';
export * from './ErrorReport';
export * from './Logger';
export * from './Paginate';
export * from './Request';

export const formatCurrencyValue = (amount: any) => {
  const { value, currency } = amount;
  return Number(value).toLocaleString('en-US', { style: 'currency', currency });
};
