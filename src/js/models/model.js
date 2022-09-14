import * as userModel from "./userModel";
import { UsersStorageKey } from "./storageKeys";
export const state = {
  users: [],
  loggedInUser: new userModel.User(),
};

const init = function () {
  const storage = localStorage.getItem(UsersStorageKey);
  state.users = userModel.parseUsersFromJSON(storage);

  // for clean up storage
  // localStorage.removeItem(UsersStorageKey);
};

init();
