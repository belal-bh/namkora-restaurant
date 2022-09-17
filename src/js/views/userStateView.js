import { ADMIN, CUSTOMER, ANONYMOUS } from "../models/userTypes.js";
import View from "./View.js";
import { state } from "../models/model.js";

class UserStateView extends View {
  _parentElement = document.querySelector(".user-states");
  _message = "Successfully logged in!";

  _user_states__create_recipe_btn = this._parentElement.querySelector(
    ".user-states--create-recipe-btn"
  );
  _user_states__favorite_btn = this._parentElement.querySelector(
    ".user-states--favorite-btn"
  );
  _user_states__profile_status_btn = this._parentElement.querySelector(
    ".user-states--profile-status-btn"
  );

  constructor() {
    super();
  }

  addHandlerUserStates(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    const markup = `
        ${
          state.loggedInUser.userType === ADMIN
            ? `<a
                  class="btn btn-cct-russet me-2 user-states--create-recipe-btn"
                  data-bs-toggle="modal"
                  href="#addRecipeModalToggle"
                  role="button"
                >
                  Create Recipe
                </a>`
            : ""
        }
        <button class="btn btn-cct-russet me-2 user-states--favorite-btn" type="button">
            Favorite
        </button>
        ${
          state.loggedInUser.username
            ? `
            <a
                class="btn btn-cct-russet me-2 user-states--profile-status-btn"
                data-bs-toggle="modal"
                href="#logoutModalToggle"
                role="button"
                >Logout</a
            >
            `
            : `
            <a
                class="btn btn-cct-russet me-2 user-states--profile-status-btn"
                data-bs-toggle="modal"
                href="#loginModalToggle"
                role="button"
                >Login</a
            >
        `
        }
        
    `;
    return markup;
  }
}

export default new UserStateView();
