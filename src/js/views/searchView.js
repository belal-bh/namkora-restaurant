import View from "./View";

class SearchView extends View {
  _parentElement = document.querySelector(".search");

  getQuery() {
    let query = this._parentElement.querySelector(".search_field").value;
    query = query.trim();
    console.log(`query="${query}"`);
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector(".search_field").value = "";
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
