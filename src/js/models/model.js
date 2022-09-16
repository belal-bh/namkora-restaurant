import * as userModel from "./userModel";
import * as recipeModel from "./recipeModel";
import {
  usersStorageKey,
  loggedInUserCookieKey,
  recipesStorageKey,
} from "./storageKeys";
import { getCookie } from "../helpers";
import addRecipeView from "../views/addRecipeView";
export const state = {
  recipe: {},
  recipes: [],
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
  const usersStorage = localStorage.getItem(usersStorageKey);
  state.users = userModel.parseUsersFromJSON(usersStorage);

  const recipesStorage = localStorage.getItem(recipesStorageKey);
  state.recipes = recipeModel.parseRecipesFromJSON(recipesStorage);

  restoreLoginSession(loggedInUserCookieKey);

  // for clean up storage
  // localStorage.removeItem(usersStorageKey);
  // localStorage.removeItem(recipesStorageKey);
};

init();
