// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import * as model from "./models/model";
import * as userModel from "./models/userModel";
import userTypes from "./models/userTypes";
import registerUserView from "./views/registerUserView";
import loginUserView from "./views/loginUserView";
import logoutUserView from "./views/logoutUserView";
import userStateView from "./views/userStateView";
import { ValidationError } from "./models/exceptions";
import { wait } from "./helpers";
import { MODAL_MESSAGE_WAIT_SEC } from "./config";

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

const init = () => {
  console.log("state:", model.state);

  userStateView.addHandlerUserStates(controlUserStates);
  registerUserView.addHandlerRegisterUser(controlRegisterUser);
  loginUserView.addHandlerLoginUser(controlLoginUser);
  logoutUserView.addHandlerLogoutUser(controlLogoutUser);
};

init();
