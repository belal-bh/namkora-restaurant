import View from "./View.js";
import { state } from "./../models/model";

class PreviewView extends View {
  _parentElement = "";

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    console.log(this._data.id === id, this._data.id, id);
    const markup = `
      <a
        href="#${this._data.id}"
        class="list-group-item list-group-item-action dropdown-item rounded-0 py-3  ${
          this._data.id === id ? "active" : ""
        }"
        aria-current="true"
      >
        <div class="d-flex w-100 justify-content-between">
          <div class="d-flex d-inline">
            <img
              class="rounded-circle me-2"
              src="${this._data.image}"
              alt="${this._data.title}"
              style="height: 50px; width: 50px"
            />
            <div class="">
              <h5 class="mb-1">
                ${this._data.title}
              </h5>
              <p class="mb-1">${this._data.publisher}</p>
            </div>
          </div>
          <div class="justify-content-end">
            <i class="fs-4 bi bi-person text-cct-dc-orange ${
              this._data.user === state.loggedInUser.username ? "" : "d-none"
            }"></i>
          </div>
        </div>
      </a>
    `;

    return markup;
  }
}

export default new PreviewView();
