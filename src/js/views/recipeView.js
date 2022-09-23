import View from "./View.js";

import { getFraction } from "./../helpers";
import { state } from "../models/model.js";
import { ADMIN } from "./../models/userTypes";
import * as bootstrap from "bootstrap";

import removeRecipeIngredientMarkupForUpdateViewHtml from "bundle-text:../../templates/removeRecipeIngredientMarkupForUpdateView.html";

class RecipeView extends View {
  _parentElement = document.querySelector(".recipe");
  _errorMessage = "No recipe found. Please try another one!";
  _message = "";

  _modalElement = document.getElementById("updateRecipeModalToggle");
  _formValidationContainerClassName = "validation-error-message";

  // _addRecipeIngredientsElement = this._modalElement.querySelector(
  //   "#add_update_recipe_ingredients"
  // );

  // _addRecipeIngredientBtn = this._modalElement.querySelector(
  //   ".add_update_recipe_ingredient_btn"
  // );

  _removeRecipeIngredientBtnClassName = "remove_update_recipe_ingredient_btn";
  _ingredientRowClassName = "row-ingredient";

  constructor() {
    super();
  }

  removeRecipeIngredientsMarkup(e) {
    e.preventDefault();
    this.remove();
  }

  addRecipeIngredientsMarkup(e) {
    e.preventDefault();
    const newDiv = document.createElement("div");
    newDiv.classList.add("row", "my-2", this._ingredientRowClassName);
    newDiv.innerHTML = removeRecipeIngredientMarkupForUpdateViewHtml;
    this._addRecipeIngredientsElement.prepend(newDiv);
    const removeBtnElement = newDiv.querySelector(
      `.${this._removeRecipeIngredientBtnClassName}`
    );
    removeBtnElement.addEventListener("click", (e) =>
      this.removeRecipeIngredientsMarkup.bind(newDiv, e)()
    );
  }

  _addHandlerAddRecipeIngredientBtn() {
    this._addRecipeIngredientBtn.addEventListener("click", (e) =>
      this.addRecipeIngredientsMarkup.bind(this, e)()
    );
  }

  _getFormValidationContainer() {
    // console.log(this._modalElement, this._formValidationContainerClassName);
    return this._modalElement.querySelector(
      `.${this._formValidationContainerClassName}`
    );
  }

  _getModalInstance(modalElement = this._modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    return modal;
  }

  closeUpdateRecipeModal() {
    const modal = this._getModalInstance(this._modalElement);
    // console.log(modal);
    modal.hide();
  }

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler)
    );
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--update-servings");
      if (!btn) return;
      // console.log(btn);
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--bookmark");
      if (!btn) return;
      handler();
    });
  }

  addHandlerUpdateRecipe(handler) {
    const updateRecipeFormElement = document.querySelector(".update");
    // console.log("addHandlerUpdateRecipe", updateRecipeFormElement);
    updateRecipeFormElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      // console.log(dataArr);
      let data = { ...Object.fromEntries(dataArr), ingredients: [] };
      // console.log(data, this);

      let ingredientDescriptionInputs = document.getElementsByName(
        "ingredientDescription[]"
      );
      let ingredientQuantityInputs = document.getElementsByName(
        "ingredientQuantity[]"
      );
      let ingredientUnitInputs = document.getElementsByName("ingredientUnit[]");

      const maxLength = Math.min(
        ingredientDescriptionInputs.length,
        ingredientQuantityInputs.length,
        ingredientUnitInputs.length
      );
      // const ingredients = [];

      for (let i = 0; i < maxLength; i++) {
        data.ingredients.push({
          description: ingredientDescriptionInputs[i].value,
          quantity: ingredientQuantityInputs[i].value,
          unit: ingredientUnitInputs[i].value,
        });
      }

      // console.log(data);
      handler(data);
    });
  }

  renderUpdateRecipeModalMessage(message) {
    const markup = `
			<div class="message">
				<div>
          <i class="bi bi-emoji-smile text-cct-russet"></i>
				</div>
				<p>${message}</p>
			</div>
    `;
    const updateRecipeFormElement = document.querySelector(".update");
    updateRecipeFormElement.innerHTML = markup;
  }

  renderMessage(message = this._message) {
    const markup = `
			<div class="message">
				<div>
          <i class="bi bi-emoji-smile text-cct-russet"></i>
				</div>
				<p>${message}</p>
			</div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderUpdateRecipeModalValidationError(message) {
    const markup = `
			<div class="error">
				<div class="d-flex justify-content-center">
          <i class="bi bi-exclamation-triangle text-cct-russet fs-1"></i>
				</div>
				<p>${message}</p>
			</div>
    `;
    const updateRecipeFormElement = document.querySelector(".update");
    updateRecipeFormElement.innerHTML = markup;
  }

  renderUpdateRecipeModalError(message) {
    const markup = `
			<div class="error">
				<div class="d-flex justify-content-center">
          <i class="bi bi-exclamation-triangle text-cct-russet fs-1"></i>
				</div>
				<p>${message}</p>
			</div>
    `;
    const updateRecipeFormElement = document.querySelector(".update");
    updateRecipeFormElement.innerHTML = markup;
  }

  _generateMarkup() {
    return `
      <figure class="figure text-center w-100">
        <img src="${this._data.image}" class="figure-img img-fluid" alt="${
      this._data.title
    }" style="max-height: 250px; width: 100%;">
        <figcaption class="figure-caption"><h1 class="recipe__title">
          <span class="text-uppercase text-cct-russet d-flex justify-content-center text-center">${
            this._data.title
          }</span>
        </h1></figcaption>
      </figure>

      <div class="d-flex justify-content-around mx-4 my-4 py-2 text-uppercase fs-4">
        <div class="d-inline">
          <i class="bi bi-clock text-cct-dc-orange"></i>
          <span class="fw-bold">${this._data.cookingTime}</span>
          <span class="">minutes</span>
        </div>
        <div class="d-inline">
          <i class="bi bi-people text-cct-dc-orange"></i>
          <span class="fw-bold">${this._data.servings}</span>
          <span class="">servings</span>

          <div class="d-inline">
            <button class="fs-4 border-0 btn btn-sm rounded-circle btn--update-servings" data-update-to="${
              this._data.servings - 1
            }" ${!(state.loggedInUser.userType === ADMIN) ? "disabled" : ""}>
              <i class="bi bi-dash-circle text-cct-dc-orange"></i>
            </button>
            <button class="fs-4 border-0 btn btn-sm rounded-circle btn--update-servings" data-update-to="${
              this._data.servings + 1
            }" ${!(state.loggedInUser.userType === ADMIN) ? "disabled" : ""}>
              <i class="bi bi-plus-circle text-cct-dc-orange"></i>
            </button>
          </div>
        </div>

        <div>
          <i class="fs-4 border-0 bi bi-person text-cct-dc-orange ${
            this._data.user === state.loggedInUser.username ? "" : "d-none"
          }" ></i>
        </div>
        <button class="fs-4 border-0 btn btn-sm rounded btn--bookmark" ${
          !state.loggedInUser.username ? "disabled" : ""
        }>
          <i class="bi bi-bookmark${
            this._data?.bookmarked ? "-fill" : ""
          } text-cct-dc-orange"></i>
          <!-- <i class="bi bi-bookmark-fill text-cct-dc-orange"></i> -->
        </button>
        ${
          state.loggedInUser.userType === ADMIN
            ? `<a
                  id="update_recipe_modal_btn"
                  class="fs-4 border-0 btn btn-sm rounded"
                  data-bs-toggle="modal"
                  href="#updateRecipeModalToggle"
                  role="button"
                >
                <i class="bi bi-pencil-square text-cct-dc-orange"></i>
                </a>`
            : ""
        }
      </div>

      <div class="bg-cct-gray py-5">
        <h2 class="d-flex justify-content-center text-uppercase pb-4">Recipe ingredients</h2>
        <div class="container mx-5 px-2">
          <ul class="row list-unstyled">
            ${this._data.ingredients
              .map((ing) => this._generateMarkupIngredient(ing))
              .join("")}
          </ul>
        </div>
      </div>

      <div class="m-4 p-4">
        <h2 class="heading--2 d-flex justify-content-center text-uppercase mb-3">How to cook it</h2>
        <div class="text-center mx-5">
          <p class="">
            This recipe was carefully designed and tested by
            <span class="text-capitalize text-cct-dc-orange">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="recipe__btn btn btn-cct-russet"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span class="text-uppercase">Directions</span>
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
  }

  _generateMarkupIngredient(ing) {
    return `
      <li class="col-md-6 col-sm-12 d-inline">
        <i class="bi bi-check2 text-cct-dc-orange fs-4"></i>
        <span>${ing.quantity ? getFraction(ing.quantity.toFixed(2)) : ""}</span>
        <span>
          <span>${ing.unit}</span>
          ${ing.description}
        </span>
      </li>
    `;
  }

  renderUpdateRecipeModal(data = this._data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    // this._data = data;
    let markup;
    let res;
    let rows;
    try {
      res = this._generateUpdateRecipeModalMarkup();
      markup = res[0];
      rows = res[1];
    } catch (err) {
      console.error(err);
    }

    const updateRecipeFormElement = document.querySelector(".update");
    // console.log(updateRecipeFormElement);

    updateRecipeFormElement.innerHTML = markup;

    const rowParent = updateRecipeFormElement.querySelector(
      "#add_update_recipe_ingredients"
    );

    rows.forEach((newDiv) => rowParent.prepend(newDiv));

    this._addRecipeIngredientBtn = this._modalElement.querySelector(
      ".add_update_recipe_ingredient_btn"
    );

    // console.log(this._addRecipeIngredientBtn);

    this._addRecipeIngredientsElement = this._modalElement.querySelector(
      "#add_update_recipe_ingredients"
    );

    // console.log(this._addRecipeIngredientsElement);

    this._addHandlerAddRecipeIngredientBtn();
  }

  renderUpdateRecipeModalSpinner(loadingMessage = null) {
    const markup = loadingMessage
      ? `
      <div class="d-flex align-items-center">
        <strong>${loadingMessage}...</strong>
        <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div>
      `
      : `
      <div class="text-center text-cct-russet">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;

    const updateRecipeFormElement = document.querySelector(".update");
    // console.log(updateRecipeFormElement);

    updateRecipeFormElement.innerHTML = markup;
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message text-align-center m-5 p-2">
        <div class="d-flex justify-content-center">
          <i class="bi bi-exclamation-triangle text-cct-russet fs-1"></i>
        </div>
        <p class="text-center text-cct-russet">${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _generateUpdateRecipeModalMarkup() {
    const markup = `
      <div class="text-center"><h5>Update Recipe!</h5></hr></div>
      <div class="text-danger validation-error-message"></div>
      <div class="update__column">
        <div class="mb-3">
          <label for="update-recipe--title" class="form-label"
            >Title</label
          >
          <input
            type="text"
            class="form-control"
            id="update-recipe--title"
            aria-describedby="update-recipe--titleHelp"
            required
            name="title"
            value="${this._data.title}"
          />
          <div id="update-recipe--titleHelp" class="form-text">
            Recipe title.
          </div>
        </div>

        <div class="mb-3">
          <label
            for="update-recipe--sourceUrl"
            class="form-label"
            >URL</label
          >
          <input
            type="text"
            class="form-control"
            id="update-recipe--sourceUrl"
            aria-describedby="update-recipe--sourceUrlHelp"
            required
            name="sourceUrl"
            value="${this._data.sourceUrl}"
          />
          <div
            id="update-recipe--sourceUrlHelp"
            class="form-text"
          >
            Source URL
          </div>
        </div>

        <div class="mb-3">
          <label for="update-recipe--image" class="form-label"
            >Image URL</label
          >
          <input
            type="text"
            class="form-control"
            id="update-recipe--image"
            aria-describedby="update-recipe--imageHelp"
            required
            name="image"
            value="${this._data.image}"
          />
          <div id="update-recipe--imageHelp" class="form-text">
            Recipe Image URL
          </div>
        </div>

        <div class="mb-3">
          <label
            for="update-recipe--publisher"
            class="form-label"
            >Publisher</label
          >
          <input
            type="text"
            class="form-control"
            id="update-recipe--publisher"
            aria-describedby="update-recipe--publisherHelp"
            required
            name="publisher"
            value="${this._data.publisher}"
          />
          <div
            id="update-recipe--publisherHelp"
            class="form-text"
          >
            Recipe publisher.
          </div>
        </div>

        <div class="mb-3">
          <label
            for="update-recipe--cookingTime"
            class="form-label"
            >Prep time</label
          >
          <input
            type="number"
            class="form-control"
            id="update-recipe--cookingTime"
            aria-describedby="update-recipe--cookingTimeHelp"
            required
            name="cookingTime"
            value="${this._data.cookingTime}"
          />
          <div
            id="update-recipe--cookingTimeHelp"
            class="form-text"
          >
            Recipe cookingTime.
          </div>
        </div>

        <div class="mb-3">
          <label for="update-recipe--servings" class="form-label"
            >Servings</label
          >
          <input
            type="number"
            class="form-control"
            id="update-recipe--servings"
            aria-describedby="update-recipe--servingsHelp"
            required
            name="servings"
            value="${this._data.servings}"
          />
          <div
            id="update-recipe--servingsHelp"
            class="form-text"
          >
            Number of recipe servings.
          </div>
        </div>
      </div>

      <h5 class="text-cct-russet">Ingredients</h3>
      <div id="add_update_recipe_ingredients" class="update__column">
        
      </div>
      <div class="d-flex justify-content-center">
        <button class="btn btn-cct-russet my-3">
          <span>Save Changes</span>
        </button>
      </div>
    `;
    return [markup, this._generateUpdateRecipeIngedientMarkup()];
  }

  _makeIngredientRow(ingredient, ingKey, addBtn = false) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("row", "my-2", this._ingredientRowClassName);

    const removeRecipeIngredientMarkup = `
      <div class="col-4 m-0 pe-1">
        <input
          type="text"
          class="form-control"
          required
          name="ingredientDescription[]"
          placeholder="Name"
          value="${ingredient?.description ? ingredient.description : ""}"
        />
      </div>
      <div class="col-3 m-0 pe-1">
        <input
          type="number"
          class="form-control"
          name="ingredientQuantity[]"
          placeholder="Quantity"
          value="${ingredient?.quantity ? ingredient.quantity : ""}"
        />
      </div>
      <div class="col-3 m-0 pe-1">
        <input
          type="text"
          class="form-control"
          name="ingredientUnit[]"
          placeholder="Unit"
          value="${ingredient?.unit ? ingredient.unit : ""}"
        />
      </div>
      <div class="col-2 m-0 ps-2">
        ${
          addBtn
            ? `
          <button
            class="btn btn-outline-cct-russet add_update_recipe_ingredient_btn"
          >
            <i class="bi bi-plus-lg"></i>
          </button>
        `
            : `
          <button
            class="btn btn-outline-cct-russet remove_update_recipe_ingredient_btn"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        `
        }
      </div>
    `;

    newDiv.innerHTML = removeRecipeIngredientMarkup;

    if (addBtn) return newDiv;

    const removeBtnElement = newDiv.querySelector(
      `.${this._removeRecipeIngredientBtnClassName}`
    );
    removeBtnElement.addEventListener("click", (e) =>
      this.removeRecipeIngredientsMarkup.bind(newDiv, e)()
    );

    return newDiv;
  }

  _generateUpdateRecipeIngedientMarkup() {
    const rows = [];
    let i = 0;
    try {
      if (this._data.ingredients.length >= 1) {
        // console.log("if1", this._data.ingredients[i]);
        rows.push(this._makeIngredientRow(this._data.ingredients[i], i, true));
        i++;

        while (i < this._data.ingredients.length) {
          // console.log("while", this._data.ingredients[i]);
          rows.push(this._makeIngredientRow(this._data.ingredients[i], i));
          i++;
        }
      }

      if (this._data.ingredients.length === 0) {
        // console.log("I am hitted!", this._data.ingredients.length);
        rows.push(this._makeIngredientRow(undefined, i, true));
      }
    } catch (err) {
      console.error(err);
    }
    // console.log("_generateUpdateRecipeIngedientMarkup", rows);
    return rows;
  }
}

export default new RecipeView();
