import View from "./View.js";
import * as bootstrap from "bootstrap";

import loginUserViewHtml from "bundle-text:../../templates/loginUserView.html";

class LoginUserView extends View {
  _parentElement = document.querySelector(".login");
  _message = "Successfully logged in!";

  _modalElement = document.getElementById("loginModalToggle");
  _formValidationContainerClassName = "validation-error-message";

  constructor() {
    super();
    this._modalElement.addEventListener(
      "shown.bs.modal",
      this._handleModalOpen.bind(this)
    );
    this._modalElement.addEventListener(
      "hidden.bs.modal",
      this._handleModalClose.bind(this)
    );
  }
  _handleModalOpen() {
    this.render(this._data);
  }
  _handleModalClose() {
    // console.log(this);
    this.render(this._data);
  }

  _getFormValidationContainer() {
    return this._parentElement.querySelector(
      `.${this._formValidationContainerClassName}`
    );
  }

  _getModalInstance(modalElement = this._modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    return modal;
  }

  async closeModal() {
    const modal = this._getModalInstance(this._modalElement);
    // console.log(modal);
    modal.hide();
  }

  addHandlerLoginUser(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      const newUserData = {
        username: data.username,
        rawPassword: data.rawPassword,
      };
      // console.log(newUserData);
      handler(newUserData);
    });
  }

  renderValidationError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <p><span><i class="bi bi-exclamation-triangle me-2"></i></span>${message}</p>
      </div>
    `;
    const container = this._getFormValidationContainer();
    container.innerHTML = markup;
  }

  renderWithData(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    const markup = `
      <div class="text-center"><h5>Login with Namkora Account</h5></hr></div>
      <div class="text-danger validation-error-message"></div>
      <div class="mb-3">
        <label for="login--username" class="form-label"
          >Username</label
        >
        <input
          type="text"
          class="form-control"
          id="login--username"
          aria-describedby="login--usernameHelp"
          required
          name="username"
          value="${data.username}"
        />
        <div id="login--usernameHelp" class="form-text">
          Enter your uniqe username.
        </div>
      </div>
      <div class="mb-3">
        <label for="login--rawPassword" class="form-label"
          >Password</label
        >
        <input
          type="password"
          class="form-control"
          id="login--rawPassword"
          required
          name="rawPassword"
        />
      </div>
      <button type="submit" class="btn btn-cct-russet">
        Login
      </button>
      <div class="text-center">
        </hr></hr>
        <p>Do not have a Namkora Account? 
          <a
            class="text-decoration-none"
            data-bs-target="#registrationModalToggle"
            data-bs-toggle="modal"
            href="#registrationModalToggle"
          >
            Register Here!
          </a>
        </p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup() {
    // const markup = ``;
    return loginUserViewHtml;
  }
}

export default new LoginUserView();
