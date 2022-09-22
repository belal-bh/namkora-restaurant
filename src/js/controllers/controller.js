import "core-js/stable"; // Polyfiling async await
import { async } from "regenerator-runtime";
import "regenerator-runtime/runtime"; // Polyfiling others

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import { v4 as uuidv4 } from "uuid";
import * as model from "../models/model";
import * as userModel from "../models/userModel";
import * as recipeModel from "../models/recipeModel";
import registerUserView from "../views/registerUserView";
import loginUserView from "../views/loginUserView";
import logoutUserView from "../views/logoutUserView";
import userStateView from "../views/userStateView";
import addRecipeView from "../views/addRecipeView";
import resultsView from "../views/resultsView";
import { ValidationError } from "../models/exceptions";
import { wait } from "../helpers";
import { MODAL_MESSAGE_WAIT_SEC } from "../config";
import { ADMIN, CUSTOMER, ANONYMOUS } from "../models/userTypes";
import recipeView from "../views/recipeView";
import paginationView from "../views/paginationView";
import bookmarksView from "../views/bookmarksView";
import * as recipeModel from "../models/recipeModel";
import searchView from "../views/searchView";
// import updateRecipeView from "./views/updateRecipeView";

import { controleAuthentication } from "./authController";
import { controlRecipe } from "./recipeController";

const init = () => {
  console.log("state:", model.state);
  controleAuthentication();
  controlRecipe();
};

export default init;
