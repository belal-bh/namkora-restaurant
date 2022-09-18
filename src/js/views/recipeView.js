import View from './View.js';

import { getFraction } from './../helpers';
import { state } from '../models/model.js';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'No recipe found. Please try another one!';
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      // console.log(btn);
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  // addHandlerAddBookmark(handler) {
  //   this._parentElement.addEventListener('click', function (e) {
  //     const btn = e.target.closest('.btn--bookmark');
  //     if (!btn) return;
  //     handler();
  //   });
  // }

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
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    return `
      <figure class="figure text-center w-100">
        <img src="${this._data.image}" class="figure-img img-fluid" alt="${
          this._data.title
        }" style="max-height: 250px; width: 100%;">
        <figcaption class="figure-caption"><h1 class="recipe__title">
          <span class="text-uppercase text-cct-russet d-flex justify-content-center text-center">${this._data.title}</span>
        </h1></figcaption>
      </figure>

      <div class="d-flex justify-content-around mx-4 my-4 py-2 text-uppercase fs-4">
        <div class="d-inline">
          <i class="bi bi-clock text-cct-dc-orange"></i>
          <span class="fw-bold">${
            this._data.cookingTime
          }</span>
          <span class="">minutes</span>
        </div>
        <div class="d-inline">
          <i class="bi bi-people text-cct-dc-orange"></i>
          <span class="fw-bold">${
            this._data.servings
          }</span>
          <span class="">servings</span>

          <div class="d-inline">
            <button class="fs-4 btn btn-sm rounded-circle btn--update-servings" data-update-to="${
              this._data.servings - 1
            }">
              <i class="bi bi-dash-circle text-cct-dc-orange"></i>
            </button>
            <button class="fs-4 btn btn-sm rounded-circle btn--update-servings" data-update-to="${
              this._data.servings + 1
            }">
              <i class="bi bi-plus-circle text-cct-dc-orange"></i>
            </button>
          </div>
        </div>

        <div>
          <i class="fs-4 bi bi-person text-cct-dc-orange ${this._data.user === state.loggedInUser.username ? '' : 'd-none'}" ></i>
        </div>
        <button class="fs-4 btn btn-sm rounded btn--bookmark">
          <i class="bi bi-bookmark text-cct-dc-orange"></i>
          <!-- <i class="bi bi-bookmark-fill text-cct-dc-orange"></i> -->
        </button>
      </div>

      <div class="bg-cct-gray py-5">
        <h2 class="d-flex justify-content-center text-uppercase pb-4">Recipe ingredients</h2>
        <div class="container mx-5 px-2">
          <ul class="row list-unstyled">
            ${this._data.ingredients
              .map(ing => this._generateMarkupIngredient(ing))
              .join('')}
            <li class="col-md-6 col-sm-12 d-inline">
              <i class="bi bi-check2 text-cct-dc-orange"></i>
              <span>0.5</span>
              <span>
                <span>cup</span>
                ricotta cheese
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="m-4 p-4">
        <h2 class="heading--2 d-flex justify-content-center text-uppercase mb-3">How to cook it</h2>
        <div class="text-center mx-5">
          <p class="">
            This recipe was carefully designed and tested by
            <span class="text-capitalize text-cct-dc-orange">${this._data.publisher}</span>. Please check out
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
        <i class="bi bi-check2 text-cct-dc-orange"></i>
        <span>${
          ing.quantity ? getFraction(ing.quantity.toFixed(2)) : ''
        }</span>
        <span>
          <span>${ing.unit}</span>
          ${ing.description}
        </span>
      </li>
    `;
  }
}

export default new RecipeView();
