import "core-js/stable"; // Polyfiling async await
import { async } from "regenerator-runtime";
import "regenerator-runtime/runtime"; // Polyfiling others

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import * as model from "../models/model";
import { controleAuthentication } from "./authController";
import { controlRecipe } from "./recipeController";

const init = () => {
  console.log("state:", model.state);
  controleAuthentication();
  controlRecipe();
};

export default init;
