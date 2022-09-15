import "core-js/stable"; // Polyfiling async await
import { async } from "regenerator-runtime";
import "regenerator-runtime/runtime"; // Polyfiling others

export const wait = (seconds) => {
  // console.log(`Waiting for ${seconds} seconds...`);
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
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
