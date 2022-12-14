import "core-js/stable"; // Polyfiling async await
import { async } from "regenerator-runtime";
import "regenerator-runtime/runtime"; // Polyfiling others

import { SPINNER_WAIT_SEC } from "./../config";
import { usersStorageKey, loggedInUserCookieKey } from "./storageKeys";
import { ADMIN, CUSTOMER, ANONYMOUS } from "./userTypes";
import { deleteCookie, setCookie, wait } from "./../helpers";
import * as model from "./model";
import { ValidationError } from "./exceptions";

export class User {
  username = "";
  _password = "";
  userType = ANONYMOUS;

  constructor(username = "", rawPassword = "", userType = ANONYMOUS) {
    this.username = username;
    this._password = rawPassword ? encriptPassword(rawPassword) : "";
    if (userType === CUSTOMER || userType === ADMIN) this.userType = userType;
    else this.userType = ANONYMOUS;
  }
}

User.prototype.getPasswordHash = function () {
  return this._password;
};

User.prototype.normalizeUsername = function () {
  this.username = normalizeUsername(this.username);
  return this;
};

User.prototype.resetPassword = function (rawPassword) {
  this._password = rawPassword ? encriptPassword(rawPassword) : "";
  persistUsers();
};

User.prototype.isCorrectPassword = function (rawPassword) {
  return encriptPassword(rawPassword) === this.getPasswordHash();
};

User.prototype.save = function () {
  const user = getUser(this.username);
  if (!user) {
    // new user
    model.state.users.push(this);
  } else {
    // Same user. Early return
    if (user === this) return this;

    user.username = this.username;
    user._password = this.getPasswordHash();
    user.userType = this.userType;
  }

  // synce to local storage
  persistUsers();
  return this;
};

export const getUser = (username) => {
  username = normalizeUsername(username);
  for (let i = 0; i < model.state.users.length; i++) {
    if (model.state.users[i].username === username) return model.state.users[i];
  }
  return false;
};

const isUsernameExist = (username) => {
  username = normalizeUsername(username);
  let found = false;
  for (let i = 0; i < model.state.users.length && !found; i++) {
    if (model.state.users[i].username === username) return true;
  }
  return found;
};

const normalizeUsername = (username) => {
  return typeof username === "string" ? username.trim() : "";
};

const encriptPassword = (rawPassword) => {
  // TODO: Implement real encription algorithm
  const hashPrefix = "super#duper#";
  const hashPostfix = "#password";
  return `${hashPrefix}${rawPassword}${hashPostfix}`;
};

const _decriptPassword = (encriptedPassword) => {
  // TODO: Implement real dencription algorithm
  const hashPrefix = "super#duper#";
  const hashPostfix = "#password";
  const rawPassword =
    encriptedPassword &&
    encriptedPassword.length > hashPrefix.length + hashPostfix.length
      ? encriptedPassword.slice(hashPrefix.length, -hashPostfix.length)
      : encriptedPassword;
  // console.log(rawPassword, encriptedPassword);
  if (encriptedPassword !== encriptPassword(rawPassword)) {
    throw new ValidationError("Corrupted password!");
  }
  return rawPassword;
};

const persistUsers = () => {
  localStorage.setItem(usersStorageKey, JSON.stringify(model.state.users));
};

const isValidUserType = (userType) => {
  if (!userType || userType === ANONYMOUS) return false;
  if (!(userType === CUSTOMER || userType === ADMIN)) return false;
  return true;
};

export const parseUser = (newUser) => {
  try {
    const rawPassword = _decriptPassword(newUser._password);
    const username = newUser.username;
    const userType = isValidUserType(newUser.userType)
      ? newUser.userType
      : undefined;
    if (!userType) throw new ValidationError("Corrupted user type!");

    const user = new User(username, rawPassword, userType);
    return user;
  } catch (err) {
    throw err;
  }
};

export const parseUsersFromJSON = (storage) => {
  if (!storage) return [];
  const initialUsers = [];
  const userList = JSON.parse(storage).reduce((users, userData) => {
    try {
      const user = parseUser(userData);
      users.push(user);
      return users;
    } catch (err) {
      console.log(`IGNORING User: ${err}`);
    }
  }, initialUsers);

  return userList;
};

export const createUser = async function (newUser) {
  try {
    if (!newUser?.username || !newUser?.rawPassword)
      throw new ValidationError("Username and/or password required");
    if (isUsernameExist(newUser.username))
      throw new ValidationError(
        `The given username (${newUser.username}) is already exist! Try another one!`
      );
    const user = new User(
      newUser.username,
      newUser.rawPassword,
      newUser.userType
    );
    user.normalizeUsername().resetPassword(newUser.rawPassword);
    user.userType = newUser.userType === ADMIN ? ADMIN : CUSTOMER;

    const savedUser = user.save();

    await wait(SPINNER_WAIT_SEC);

    return savedUser;
  } catch (err) {
    throw err;
  }
};

export const loginUser = async function (newUser) {
  try {
    if (!newUser?.username || !newUser?.rawPassword)
      throw new ValidationError("Username and/or password required");
    const user = getUser(newUser.username);
    if (!user) throw new ValidationError(`User does not exist!`);
    if (!user.isCorrectPassword(newUser.rawPassword))
      throw new ValidationError(`Invalid credential!`);

    model.state.loggedInUser = user;
    setCookie(loggedInUserCookieKey, user.username);

    // Refresh user bookmarks
    model.refetchUserBookmarks();

    await wait(SPINNER_WAIT_SEC);

    return user;
  } catch (err) {
    throw err;
  }
};

export const logoutUser = async function () {
  try {
    if (!model.state.loggedInUser.username) return;

    model.state.loggedInUser = new User();
    deleteCookie(loggedInUserCookieKey);

    // Refresh user bookmarks
    model.refetchUserBookmarks();

    await wait(SPINNER_WAIT_SEC);

    return;
  } catch (err) {
    throw err;
  }
};
