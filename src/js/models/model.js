import * as userModel from "./userModel";
import * as recipeModel from "./recipeModel";
import {RES_PER_PAGE} from './../config'
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
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  }
};


export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const recipes = await recipeModel.searchRecipeByTitle(query);
    state.search.results = recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image,
        user: rec.user,
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
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
