
import { BigNumber } from 'bignumber.js';

/**
 * Capitalize every word in a string
 *
 * @param str
 */
export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
/**
 * Checks if a text contains a string
 *
 * @param str
 * @param find
 */
export const strContains = (str: string, find: string): boolean => str.indexOf(find) !== -1;
/**
 *
 * @param str1
 * @param str2
 */
export const equalsIgnoreCase = (str1: string, str2: string): boolean => str1.toUpperCase() === str2.toUpperCase();
/**
 * Remove keys with value undefined
 *
 * @param obj
 */
export const cleanObj = (obj: any) => {
  for (let propName in obj) {
    if (obj[propName] === undefined) {
      delete obj[propName];
    }
  }

  return obj;
};
/**
 * Clean sensitive data from a string
 * 
 * @param str 
 * @param filters 
 */
export const replaceByFilters = (str: any, filters: string[]): any => {
  if(typeof str !== 'string') {
    return str;
  }

  filters.forEach(filter => {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regx = new RegExp(filter, 'gi');
    str = str.replace(regx, '****');
  });

  return str;
};
/**
 * Clean sensitive data from object
 * 
 * @param obj 
 * @param filters 
 */
export const replaceObjectValuesByFilters = (obj: any, filters: string[]): any => {
	if('object' !== typeof obj) {
	  return obj;
	}
  
	let _obj: any = {};
  
	for (let [key, value] of Object.entries(obj)) {
	  _obj[key] = 'object' === typeof value ? replaceObjectValuesByFilters(value, filters) : replaceByFilters(value, filters);
	}
  
	return _obj;
};
/**
 * Compute fees
 *
 * @param amount
 * @param fee
 */
export const applyFee = (amount: number, fee: { max: number; min: number; percent: number; flat: number; }): number => {
  const BN_ZERO = new BigNumber(0);
  const BN_AMOUNT = new BigNumber(amount);
  const BN_FEE_MIN = new BigNumber(fee.min);
  const BN_FEE_MAX = new BigNumber(fee.max);

  let feeAMount: BigNumber = BN_ZERO;

  if (fee.percent !== null && fee.percent !== 0) {
    feeAMount = BN_AMOUNT.multipliedBy(fee.percent / 100);
  }

  if (fee.flat !== null && fee.flat !== 0) {
    feeAMount = feeAMount.plus(fee.flat);
  }

  if (fee.min !== null && fee.min !== 0 && BN_FEE_MIN.comparedTo(BN_ZERO) > 0) {
    feeAMount = feeAMount.comparedTo(fee.min) < 0 ? BN_FEE_MIN : feeAMount;
  }

  if (fee.max !== null && fee.max !== 0 && BN_FEE_MAX.comparedTo(BN_ZERO) > 0) {
    feeAMount = feeAMount.comparedTo(fee.max) > 0 ? BN_FEE_MAX : feeAMount;
  }

  return Number(feeAMount.toPrecision(BigNumber.ROUND_HALF_UP));
};
/**
 * Do rounding for crypto
 *
 * @param value
 */
export const roundCryptoCurrency = (value: number) => {
  return parseFloat(value.toFixed(8))
    .toString()
    .replace(/0+$/, '')
    .toLocaleString();
};
/**
 * Do rounding for fiat
 *
 * @param value
 */
export const roundFiatCurrency = (value: number) => {
  return value.toFixed(2).toLocaleString();
};
/**
 * Clean sensitive data from a string
 *
 * @param str
 * @param filters
 */
export const cleanStr = (str: any, filters: string[]): any => {
  if (typeof str !== 'string') {
    return str;
  }

  filters.forEach(filter => {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regx = new RegExp(filter, 'gi');
    str = str.replace(regx, '****');
  });

  return str;
};
/**
 * Clean sensitive data from object
 *
 * @param obj
 * @param filters
 */
export const filterSecretsInObject = (obj: any, filters: string[]): any => {
  if ('object' !== typeof obj) {
    return obj;
  }

  let _obj: any = {};

  for (let [key, value] of Object.entries(obj)) {
    // eslint-disable-next-line security/detect-object-injection
    _obj[key] = 'object' === typeof value ? filterSecretsInObject(value, filters) : cleanStr(value, filters);
  }

  return _obj;
};
