/* eslint-disable no-extend-native */
import { clone, isEqual as _isEqual, uniq, zipObject } from 'lodash';
import format from './format';

Object.defineProperty(Array.prototype, 'dedupe', {
  value(match) {
    const array = [];
    return this.filter(item => {
      if (!array.length || !array.find(exist => match(exist, item))) {
        array.push(item);
        return true;
      }
      return false;
    });
  }
});

export const diff = (lValue, rValue) => {
  if (_isEqual(lValue, rValue)) {
    return {};
  }
  const keys = uniq(Object.keys(lValue).concat(Object.keys(rValue))).filter(key => !_isEqual(lValue[key], rValue[key]));
  const values = keys.map(key => rValue[key]);
  return zipObject(keys, values);
};

export const lazyUpdate = (oValue, { isEqual = _isEqual, onlyDiff = false, delay = 1500 }) => {
  let lValue = clone(oValue);
  let timer;
  return value =>
    new Promise(resolve => {
      clearTimeout(timer);
      if (isEqual(lValue, value)) {
        return;
      }
      timer = setTimeout(() => {
        console.log(lValue, value, isEqual(lValue, value));
        console.log(`执行更新 ${JSON.stringify(value)}`);
        resolve(onlyDiff ? diff(lValue, value) : value);
        lValue = clone(value);
        clearTimeout(timer);
      }, delay);
    });
};

export default { lazyUpdate };

/**
 * 睡眠方法
 * @param time {Number} 模版
 * @returns {Promise}
 */
export const sleep = time =>
  new Promise(resolve => {
    const timer = setTimeout(() => {
      resolve();
      clearTimeout(timer);
    }, time);
  });

export { format };
