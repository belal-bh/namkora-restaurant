import "core-js/stable"; // Polyfiling async await
import { async } from "regenerator-runtime";
import "regenerator-runtime/runtime"; // Polyfiling others

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import * as model from "./../models/model";
import * as recipeModel from "./../models/recipeModel";
import registerUserView from "./../views/registerUserView";
import addRecipeView from "./../views/addRecipeView";
import resultsView from "./../views/resultsView";
import { ValidationError } from "./../models/exceptions";
import { wait } from "./../helpers";
import { MODAL_MESSAGE_WAIT_SEC } from "./../config";
import recipeView from "./../views/recipeView";
import paginationView from "./../views/paginationView";
import bookmarksView from "./../views/bookmarksView";
import searchView from "./../views/searchView";

const recipes = async function () {
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

const searchResults = async function () {
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

const pagination = function (goToPage) {
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
};

const servings = function (newServings) {
  // update the recipe servings
  model.updateServings(newServings);

  // update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const addBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const updateRecipe = async function (newRecipe) {
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

const bookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const addRecipe = async function (newRecipe) {
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

export const controlRecipe = () => {
  addRecipeView.addHandlerUpload(addRecipe);
  recipeView.addHandlerRender(recipes);
  recipeView.addHandlerUpdateServings(servings);
  searchView.addHandlerSearch(searchResults);
  paginationView.addHandlerClick(pagination);
  bookmarksView.addHandlerRender(bookmarks);
  recipeView.addHandlerAddBookmark(addBookmark);
  recipeView.addHandlerUpdateRecipe(updateRecipe);
};
