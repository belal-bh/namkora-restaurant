import * as userModel from "./userModel";
import * as recipeModel from "./recipeModel";
import { RES_PER_PAGE } from "./../config";
import {
  usersStorageKey,
  loggedInUserCookieKey,
  recipesStorageKey,
  userBookmarksKeyLastPart,
} from "./storageKeys";
import { getCookie } from "../helpers";
import addRecipeView from "../views/addRecipeView";

export const state = {
  recipe: {},
  recipes: [],
  users: [],
  loggedInUser: new userModel.User(),
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const recipes = await recipeModel.searchRecipeByTitle(query);
    state.search.results = recipes.map((rec) => {
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

export const getUserBookmarksKey = () => {
  return state.loggedInUser.username + userBookmarksKeyLastPart;
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  // control bookmarks per user
  const userBookmarksKey = getUserBookmarksKey();
  localStorage.setItem(userBookmarksKey, JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const usersStorage = localStorage.getItem(usersStorageKey);
  state.users = userModel.parseUsersFromJSON(usersStorage);

  const recipesStorage = localStorage.getItem(recipesStorageKey);
  state.recipes = recipeModel.parseRecipesFromJSON(recipesStorage);

  restoreLoginSession(loggedInUserCookieKey);

  if (state.loggedInUser.username) {
    const userBookmarksKey = getUserBookmarksKey();
    const storage = localStorage.getItem(userBookmarksKey);

    if (storage) state.bookmarks = JSON.parse(storage);
  }

  // TEST
  // state.bookmarks = state.recipes;

  console.log("bookmarks", state.bookmarks);

  // for clean up storage
  // localStorage.removeItem(usersStorageKey);
  // localStorage.removeItem(recipesStorageKey);
};

init();
