import "core-js/stable"; // Polyfiling async await
import { async } from "regenerator-runtime";
import "regenerator-runtime/runtime"; // Polyfiling others

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import * as model from "./../models/model";
import * as userModel from "./../models/userModel";
import * as recipeModel from "./../models/recipeModel";
import registerUserView from "./../views/registerUserView";
import loginUserView from "./../views/loginUserView";
import logoutUserView from "./../views/logoutUserView";
import userStateView from "./../views/userStateView";
import { ValidationError } from "./../models/exceptions";
import { wait } from "./../helpers";
import { MODAL_MESSAGE_WAIT_SEC } from "./../config";
import recipeView from "./../views/recipeView";
import bookmarksView from "./../views/bookmarksView";
import * as recipeModel from "./../models/recipeModel";

const registerUser = async function (newUser) {
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

const loginUser = async function (newUser) {
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

const logoutUser = async function () {
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

const userStates = function () {
  userStateView.render(model.state.loggedInUser);
};

export const controleAuthentication = () => {
  userStateView.addHandlerUserStates(userStates);
  registerUserView.addHandlerRegisterUser(registerUser);
  loginUserView.addHandlerLoginUser(loginUser);
  logoutUserView.addHandlerLogoutUser(logoutUser);
};
