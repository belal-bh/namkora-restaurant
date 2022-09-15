import * as userModel from "./userModel";
import { usersStorageKey, loggedInUserCookieKey } from "./storageKeys";
import { getCookie } from "../helpers";
export const state = {
  users: [],
  loggedInUser: new userModel.User(),
};

const restoreLoginSession = function (cookieKey) {
  const loggedInUsername = getCookie(cookieKey);

  console.log(loggedInUsername);

  if (loggedInUsername) {
    const user = userModel.getUser(loggedInUsername);
    if (user) state.loggedInUser = user;
  }
};

const init = function () {
  const storage = localStorage.getItem(usersStorageKey);
  state.users = userModel.parseUsersFromJSON(storage);
  restoreLoginSession(loggedInUserCookieKey);

  // for clean up storage
  // localStorage.removeItem(usersStorageKey);
};

init();
