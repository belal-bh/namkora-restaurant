import userTypes from "../models/userTypes.js";
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

  // _window = document.querySelector(".add-recipe-window");
  // _overlay = document.querySelector(".overlay");
  // _btnOpen = document.querySelector(".nav__btn--add-recipe");
  // _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
  }

  // toggleWindow() {
  //   this._overlay.classList.toggle("hidden");
  //   this._window.classList.toggle("hidden");
  // }

  // _addHandlerShowWindow() {
  //   this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  // }

  // _addHandlerHideWindow() {
  //   this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
  //   this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  // }

  addHandlerUserStates(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    const markup = `
        <button class="btn btn-cct-russet me-2  user-states--create-recipe-btn" type="button" ${
          state.loggedInUser.userType !== userTypes.ADMIN ? "disabled" : ""
        } >
            Create Recipe
        </button>
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