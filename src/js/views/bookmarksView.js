import View from "./View.js";
import previewView from "./previewView.js";
import { state } from "./../models/model";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it!";
  _message = "";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    let markup;
    if (
      !state.bookmarks ||
      (Array.isArray(state.bookmarks) && state.bookmarks.length === 0)
    )
      markup = `
      <div class="message text-align-center">
        <div class="d-flex justify-content-center">
          <i class="bi bi-check2-circle text-cct-russet fs-1"></i>
        </div>
        <p class="text-center text-cct-russet">Your favorite recipe list is empty!</p>
      </div>
    `;
    else
      markup = state.bookmarks
        .map((bookmark) => previewView.render(bookmark, false))
        .join("");
    // console.log(markup);
    return markup;
  }
}

export default new BookmarksView();
