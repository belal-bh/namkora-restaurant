import "core-js/stable"; // Polyfiling async await
import { async } from "regenerator-runtime";
import "regenerator-runtime/runtime"; // Polyfiling others

export const wait = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const isEmptyObjectOrNullOrUndefined = (obj) => {
  // it is not accourate solution for checking empty object
  // but it will work for my application
  // SEE details at: https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object

  // check is it null or undefined
  if (!obj) return true;
  // check is it empty object or not
  return Object.keys(obj).length === 0;
};

const getGCD = function (a, b) {
  return b == 0 ? a : getGCD(b, a % b);
};

export const getFraction = function (num) {
  if (typeof num !== "number") {
    num = Number.parseFloat(num);
  }

  if (!Number.isFinite(num)) return NaN;

  let wholePart, numerator, denominator; // format: a b/c
  wholePart = Math.trunc(num);

  const decimalPart = num - wholePart;
  denominator = 100;
  numerator = Math.trunc(decimalPart * denominator);

  const gcd = getGCD(numerator, denominator);
  numerator = Math.trunc(numerator / gcd);
  denominator = Math.trunc(denominator / gcd);

  const result = [];
  if (wholePart != 0) result.push(wholePart);
  if (numerator != 0)
    result.push(
      (wholePart === 0 ? numerator : Math.abs(numerator)) + "/" + denominator
    );
  return result.length > 0 ? result.join(" ") : 0;
};

export const getUtcDate = function (date) {
  const dateUtc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
};

export const getCookie = function (cookieKey) {
  const cookies = document.cookie
    .split(";")
    .map((cookie) => cookie.split("="))
    .reduce(
      (accumulator, [key, value]) => ({
        ...accumulator,
        [key.trim()]: decodeURIComponent(value),
      }),
      {}
    );
  // check cookie key exists or not
  if (!Object.hasOwn(cookies, cookieKey)) return false;

  return cookies[cookieKey];
};

export const setCookie = function (cookieKey, value, expiresDate = null) {
  if (!expiresDate) {
    document.cookie = `${cookieKey}=${value}`;
  } else {
    document.cookie = `${cookieKey}=${value}; expires=${getUtcDate(
      expiresDate
    )}`;
  }
};

export const deleteCookie = function (cookieKey) {
  let date = new Date();
  date.setDate(date.getDate() - 1);
  const pastData = date;
  document.cookie = `${cookieKey}=; expires=${getUtcDate(pastData)}`;
};
