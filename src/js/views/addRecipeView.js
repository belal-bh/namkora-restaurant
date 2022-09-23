import View from "./View.js";
import * as bootstrap from "bootstrap";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "Recipe is successfully uploaded!";

  _modalElement = document.getElementById("addRecipeModalToggle");
  _formValidationContainerClassName = "validation-error-message";

  _addRecipeIngredientsElement = this._parentElement.querySelector(
    "#add_recipe_ingredients"
  );

  _addRecipeIngredientBtn = this._parentElement.querySelector(
    ".add_recipe_ingredient_btn"
  );

  _removeRecipeIngredientBtnClassName = "remove_recipe_ingredient_btn";
  _ingredientRowClassName = "ingredient-row";

  _removeRecipeIngredientMarkup = `
    <div class="col-4 m-0 pe-1">
      <input
        type="text"
        class="form-control"
        id="add-recipe--ingredientDescription"
        aria-describedby="add-recipe--ingredientDescriptionHelp"
        required
        name="ingredientDescription[]"
        placeholder="Name"
      />
    </div>
    <div class="col-3 m-0 pe-1">
      <input
        type="number"
        class="form-control"
        id="add-recipe--ingredientQuantity"
        aria-describedby="add-recipe--ingredientQuantityHelp"
        name="ingredientQuantity[]"
        placeholder="Quantity"
      />
    </div>
    <div class="col-3 m-0 pe-1">
      <input
        type="text"
        class="form-control"
        id="add-recipe--ingredientUnit"
        aria-describedby="add-recipe--ingredientUnitHelp"
        name="ingredientUnit[]"
        placeholder="Unit"
      />
    </div>
    <div class="col-2 m-0 ps-2">
      <button
        class="btn btn-outline-cct-russet remove_recipe_ingredient_btn"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  `;

  constructor() {
    super();
    this._addHandlerAddRecipeIngredientBtn();
  }

  removeRecipeIngredientsMarkup(e) {
    e.preventDefault();
    this.remove();
  }

  addRecipeIngredientsMarkup(e) {
    e.preventDefault();
    const newDiv = document.createElement("div");
    newDiv.classList.add("row", "my-2", this._ingredientRowClassName);
    newDiv.innerHTML = this._removeRecipeIngredientMarkup;
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
    // console.log(this._parentElement, this._formValidationContainerClassName);
    return this._parentElement.querySelector(
      `.${this._formValidationContainerClassName}`
    );
  }

  _getModalInstance(modalElement = this._modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    return modal;
  }

  closeModal() {
    const modal = this._getModalInstance(this._modalElement);
    // console.log(modal);
    modal.hide();
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
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

  _generateMarkup() {
    const markup = `
      <div class="text-danger validation-error-message"></div>
      <div class="upload__column">
        <h3 class="text-cct-russet">Recipe data</h3>
        <div class="mb-3">
          <label for="add-recipe--title" class="form-label"
            >Title</label
          >
          <input
            type="text"
            class="form-control"
            id="add-recipe--title"
            aria-describedby="add-recipe--titleHelp"
            required
            name="title"
          />
          <div id="add-recipe--titleHelp" class="form-text">
            Recipe title.
          </div>
        </div>

        <div class="mb-3">
          <label
            for="add-recipe--sourceUrl"
            class="form-label"
            >URL</label
          >
          <input
            type="text"
            class="form-control"
            id="add-recipe--sourceUrl"
            aria-describedby="add-recipe--sourceUrlHelp"
            required
            name="sourceUrl"
          />
          <div
            id="add-recipe--sourceUrlHelp"
            class="form-text"
          >
            Source URL
          </div>
        </div>

        <div class="mb-3">
          <label for="add-recipe--image" class="form-label"
            >Image URL</label
          >
          <input
            type="text"
            class="form-control"
            id="add-recipe--image"
            aria-describedby="add-recipe--imageHelp"
            required
            name="image"
          />
          <div id="add-recipe--imageHelp" class="form-text">
            Recipe Image URL
          </div>
        </div>

        <div class="mb-3">
          <label
            for="add-recipe--publisher"
            class="form-label"
            >Publisher</label
          >
          <input
            type="text"
            class="form-control"
            id="add-recipe--publisher"
            aria-describedby="add-recipe--publisherHelp"
            required
            name="publisher"
          />
          <div
            id="add-recipe--publisherHelp"
            class="form-text"
          >
            Recipe publisher.
          </div>
        </div>

        <div class="mb-3">
          <label
            for="add-recipe--cookingTime"
            class="form-label"
            >Prep time</label
          >
          <input
            type="number"
            class="form-control"
            id="add-recipe--cookingTime"
            aria-describedby="add-recipe--cookingTimeHelp"
            required
            name="cookingTime"
          />
          <div
            id="add-recipe--cookingTimeHelp"
            class="form-text"
          >
            Recipe cookingTime.
          </div>
        </div>

        <div class="mb-3">
          <label for="add-recipe--servings" class="form-label"
            >Servings</label
          >
          <input
            type="number"
            class="form-control"
            id="add-recipe--servings"
            aria-describedby="add-recipe--servingsHelp"
            required
            name="servings"
          />
          <div
            id="add-recipe--servingsHelp"
            class="form-text"
          >
            Number of recipe servings.
          </div>
        </div>
      </div>

      <h3 class="text-cct-russet">Ingredients</h3>
      <div id="add_recipe_ingredients" class="upload__column">
        <div class="row my-2 row-ingredient">
          <div class="col-4 m-0 pe-1">
            <input
              type="text"
              class="form-control"
              id="add-recipe--ingredientDescription"
              aria-describedby="add-recipe--ingredientDescriptionHelp"
              required
              name="ingredientDescription[]"
              placeholder="Name"
            />
          </div>
          <div class="col-3 m-0 pe-1">
            <input
              type="number"
              class="form-control"
              id="add-recipe--ingredientQuantity"
              aria-describedby="add-recipe--ingredientQuantityHelp"
              name="ingredientQuantity[]"
              placeholder="Quantity"
            />
          </div>
          <div class="col-3 m-0 pe-1">
            <input
              type="text"
              class="form-control"
              id="add-recipe--ingredientUnit"
              aria-describedby="add-recipe--ingredientUnitHelp"
              name="ingredientUnit[]"
              placeholder="Unit"
            />
          </div>
          <div class="col-2 m-0 ps-2">
            <button
              class="btn btn-outline-cct-russet add_recipe_ingredient_btn"
            >
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <button class="btn btn-cct-russet my-3">
          <span>Upload</span>
        </button>
      </div>
    `;
    return markup;
  }
}

export default new AddRecipeView();
