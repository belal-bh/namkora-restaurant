import "core-js/stable"; // Polyfiling async await
import { async } from "regenerator-runtime";
import "regenerator-runtime/runtime"; // Polyfiling others

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
// import {
//   // Alert,
//   Button,
//   Carousel,
//   Collapse,
//   Dropdown,
//   Modal,
//   Offcanvas,
//   Popover,
//   ScrollSpy,
//   Tab,
//   Toast,
//   Tooltip,
// } from "bootstrap";

import { v4 as uuidv4 } from "uuid";
import * as model from "./models/model";
import * as userModel from "./models/userModel";
import * as recipeModel from "./models/recipeModel";
import registerUserView from "./views/registerUserView";
import loginUserView from "./views/loginUserView";
import logoutUserView from "./views/logoutUserView";
import userStateView from "./views/userStateView";
import addRecipeView from "./views/addRecipeView";
import { ValidationError } from "./models/exceptions";
import { wait } from "./helpers";
import { MODAL_MESSAGE_WAIT_SEC } from "./config";
import { ADMIN, CUSTOMER, ANONYMOUS } from "./models/userTypes";
import recipeView from "./views/recipeView";
import * as recipeModel from './models/recipeModel'


const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) update results view to mark selected search result
    // resultsView.update(model.getSearchResultsPage());

    // 1) updating bookmarks view
    // bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await recipeModel.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};


const controlRegisterUser = async function (newUser) {
  try {
    // render spinner TODO
    registerUserView.renderSpinner();

    // create new user
    const user = await userModel.createUser(newUser);
    // console.log("nweUser:", user);

    // show success message
    registerUserView.renderMessage();

    // wait before close the modal
    await wait(MODAL_MESSAGE_WAIT_SEC);

    // close the modal
    registerUserView.closeModal();

    // rerender form as previous state
    registerUserView.render(model.state.loggedInUser);

    console.log(model.state.users);
  } catch (err) {
    if (err instanceof ValidationError) {
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
    // render spinner TODO
    // loginUserView.renderSpinner();

    // login user
    const user = await userModel.loginUser(newUser);
    console.log("logged in user:", user);

    // show success message
    loginUserView.renderMessage();

    // update user state stutus
    userStateView.render(model.state.loggedInUser);

    // wait before close the modal
    await wait(MODAL_MESSAGE_WAIT_SEC);

    // close the modal
    loginUserView.closeModal();

    // rerender form as previous state
    loginUserView.render(model.state.loggedInUser);

    console.log(model.state.loggedInUser);
  } catch (err) {
    if (err instanceof ValidationError) {
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
    // render spinner TODO
    // logoutUserView.renderSpinner();

    // user logout
    await userModel.logoutUser();
    console.log("User logged out");

    // show success message
    logoutUserView.renderMessage(`You are successfully logged out!`);

    // update user state stutus
    userStateView.render(model.state.loggedInUser);

    // wait before close the modal
    await wait(MODAL_MESSAGE_WAIT_SEC);

    // close the modal
    logoutUserView.closeModal();

    // rerender form as previous state
    logoutUserView.render(model.state.loggedInUser);

    console.log(model.state.loggedInUser);
  } catch (err) {
    if (err instanceof ValidationError) {
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
};

init();
