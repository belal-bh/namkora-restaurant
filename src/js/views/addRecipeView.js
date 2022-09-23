import View from "./View.js";
import * as bootstrap from "bootstrap";

import addRecipeViewHtml from "bundle-text:../../templates/addRecipeView.html";
import removeRecipeIngredientMarkupForAddViewHtml from "bundle-text:../../templates/removeRecipeIngredientMarkupForAddView.html";

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
    newDiv.innerHTML = removeRecipeIngredientMarkupForAddViewHtml;
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
    // const markup = ``;
    return addRecipeViewHtml;
  }
}

export default new AddRecipeView();
