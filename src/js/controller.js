import "core-js/stable"; // Polyfiling async await
import { async } from "regenerator-runtime";
import "regenerator-runtime/runtime"; // Polyfiling others

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import { v4 as uuidv4 } from "uuid";
import * as model from "./models/model";
import * as userModel from "./models/userModel";
import * as recipeModel from "./models/recipeModel";
import registerUserView from "./views/registerUserView";
import loginUserView from "./views/loginUserView";
import logoutUserView from "./views/logoutUserView";
import userStateView from "./views/userStateView";
import addRecipeView from "./views/addRecipeView";
import resultsView from "./views/resultsView";
import { ValidationError } from "./models/exceptions";
import { wait } from "./helpers";
import { MODAL_MESSAGE_WAIT_SEC } from "./config";
import { ADMIN, CUSTOMER, ANONYMOUS } from "./models/userTypes";
import recipeView from "./views/recipeView";
import paginationView from "./views/paginationView";
import bookmarksView from "./views/bookmarksView";
import * as recipeModel from "./models/recipeModel";
import searchView from "./views/searchView";
// import updateRecipeView from "./views/updateRecipeView";

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    else {
      if (!recipeModel.isValidRecipeId(id)) {
        recipeView.renderMessage(`No recipe found! Invalid recipe id.`);
        return;
      }
    }
    recipeView.renderSpinner();

    // 0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await recipeModel.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);

    // 4) Render recipe update content
    recipeView.renderUpdateRecipeModal(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // render spinner
    resultsView.renderSpinner();

    // 2) Load search results
    const recipeFound = await model.loadSearchResults(query);
    if (!recipeFound) {
      resultsView.renderMessage(`No recipe found! Try with different query!`);
      return;
    }

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(`${err} 💥💥💥`);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings
  model.updateServings(newServings);

  // update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlUpdateRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    recipeView.renderUpdateRecipeModalSpinner();

    // upload the new recipe data
    await recipeModel.updateRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // show success message
    recipeView.renderUpdateRecipeModalMessage(`Recipe successfully updated!`);

    // wait before close the modal
    await wait(MODAL_MESSAGE_WAIT_SEC);

    // close the modal
    recipeView.closeUpdateRecipeModal();

    // rerender form as previous state
    recipeView.renderUpdateRecipeModal(model.state.recipe);

    // change id in url
    // window.history.pushState(null, "", `#${model.state.recipe.id}`);

    console.log(model.state.recipe);
  } catch (err) {
    if (err instanceof ValidationError) {
      // render spinner
      recipeView.renderUpdateRecipeModalSpinner();
      await wait(MODAL_MESSAGE_WAIT_SEC);
      registerUserView.renderUpdateRecipeModal(newUser);
      recipeView.renderUpdateRecipeModalValidationError(err.message);

      console.error("error", err);
    } else {
      console.log(` 💥💥💥 ${err}`);
      recipeView.renderUpdateRecipeModalError(err.message);

      // wait before close the modal
      await wait(MODAL_MESSAGE_WAIT_SEC);

      // close the modal
      recipeView.closeUpdateRecipeModal();

      // rerender form as previous state
      recipeView.renderUpdateRecipeModal(model.state.recipe);
    }
  }
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlRegisterUser = async function (newUser) {
  try {
    // render spinner
    registerUserView.renderSpinner();

    // create new user
    const user = await userModel.createUser(newUser);
    console.log("nweUser:", user);

    // show success message
    registerUserView.renderMessage();

    // wait before close the modal
    await wait(MODAL_MESSAGE_WAIT_SEC);

    // close the modal
    registerUserView.closeModal();

    // rerender form as previous state
    registerUserView.render();

    console.log(model.state.users);
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log(newUser);
      // render spinner
      registerUserView.renderSpinner();
      await wait(MODAL_MESSAGE_WAIT_SEC);
      registerUserView.renderWithData(newUser);
      registerUserView.renderValidationError(err.message);

      // console.log("error", err);
    } else {
      console.log(` 💥💥💥 ${err}`);
      registerUserView.renderError(err.message);

      // wait before close the modal
      await wait(MODAL_MESSAGE_WAIT_SEC);

      // close the modal
      registerUserView.closeModal();

      // rerender form as previous state
      registerUserView.render(model.state.loggedInUser);
    }
  }
};

const controlLoginUser = async function (newUser) {
  try {
    // render spinner
    loginUserView.renderSpinner();

    // login user
    const user = await userModel.loginUser(newUser);
    console.log("logged in user:", user);

    // show success message
    loginUserView.renderMessage();

    // update user state stutus
    userStateView.render(model.state.loggedInUser);

    // re-render if recipe already renderd
    const id = window.location.hash.slice(1);
    if (id && recipeModel.isValidRecipeId(id)) {
      recipeView.render(model.state.recipe);
    }

    // re-render bookmark view
    bookmarksView.render();

    // wait before close the modal
    await wait(MODAL_MESSAGE_WAIT_SEC);

    // close the modal
    loginUserView.closeModal();

    // rerender form as previous state
    loginUserView.render(model.state.loggedInUser);

    console.log(model.state.loggedInUser);
  } catch (err) {
    if (err instanceof ValidationError) {
      // render spinner
      loginUserView.renderSpinner();
      await wait(MODAL_MESSAGE_WAIT_SEC);
      loginUserView.renderWithData(newUser);
      loginUserView.renderValidationError(err.message);

      // console.log("error", err);
    } else {
      console.log(` 💥💥💥 ${err}`);
      loginUserView.renderError(err.message);

      // wait before close the modal
      await wait(MODAL_MESSAGE_WAIT_SEC);

      // close the modal
      loginUserView.closeModal();

      // rerender form as previous state
      loginUserView.render(model.state.loggedInUser);
    }
  }
};

const controlLogoutUser = async function () {
  try {
    // render spinner
    logoutUserView.renderSpinner();

    // user logout
    await userModel.logoutUser();
    console.log("User logged out");

    // show success message
    logoutUserView.renderMessage(`You are successfully logged out!`);

    // update user state stutus
    userStateView.render();

    // re-render if recipe already renderd
    const id = window.location.hash.slice(1);
    if (id && recipeModel.isValidRecipeId(id)) {
      recipeView.render(model.state.recipe);
    }

    // re-render bookmark view
    bookmarksView.render();

    // wait before close the modal
    await wait(MODAL_MESSAGE_WAIT_SEC);

    // close the modal
    logoutUserView.closeModal();

    // rerender form as previous state
    logoutUserView.render();

    console.log(model.state.loggedInUser);
  } catch (err) {
    if (err instanceof ValidationError) {
      // render spinner
      logoutUserView.renderSpinner();
      await wait(MODAL_MESSAGE_WAIT_SEC);
      logoutUserView.render();
      logoutUserView.renderValidationError(err.message);
      // console.log("error", err);
    } else {
      // console.log(` 💥💥💥 ${err}`);
      logoutUserView.renderError(err.message);

      // wait before close the modal
      await wait(MODAL_MESSAGE_WAIT_SEC);

      // close the modal
      logoutUserView.closeModal();

      // rerender form as previous state
      logoutUserView.render(model.state.loggedInUser);
    }
  }
};

const controlUserStates = function () {
  userStateView.render(model.state.loggedInUser);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    // addRecipeView.renderSpinner();

    // upload the new recipe data
    await recipeModel.uploadRecipe(newRecipe);

    // render recipe
    // recipeView.render(model.state.recipe);

    // show success message
    addRecipeView.renderMessage();

    // wait before close the modal
    await wait(MODAL_MESSAGE_WAIT_SEC);

    // close the modal
    addRecipeView.closeModal();

    // rerender form as previous state
    addRecipeView.render(model.state.recipe);

    // change id in url
    // window.history.pushState(null, "", `#${model.state.recipe.id}`);

    console.log(model.state.recipe);
  } catch (err) {
    if (err instanceof ValidationError) {
      addRecipeView.renderValidationError(err.message);

      console.error("error", err);
    } else {
      console.log(` 💥💥💥 ${err}`);
      addRecipeView.renderError(err.message);

      // wait before close the modal
      await wait(MODAL_MESSAGE_WAIT_SEC);

      // close the modal
      addRecipeView.closeModal();

      // rerender form as previous state
      addRecipeView.render(model.state.recipe);
    }
  }
};

const init = () => {
  console.log("state:", model.state);

  userStateView.addHandlerUserStates(controlUserStates);
  registerUserView.addHandlerRegisterUser(controlRegisterUser);
  loginUserView.addHandlerLoginUser(controlLoginUser);
  logoutUserView.addHandlerLogoutUser(controlLogoutUser);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerUpdateRecipe(controlUpdateRecipe);
};

init();
