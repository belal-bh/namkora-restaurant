import View from "./View.js";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
        <div></div>
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next  btn btn-cct-russet me-2 ps-1 mt-2">
          <span>Page ${curPage + 1}</span>
          <i class="bi bi-arrow-right"></i>
        </button>
      `;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev  btn btn-cct-russet ms-2 ps-1 mt-2">
          <i class="bi bi-arrow-left"></i>
          <span>Page ${curPage - 1}</span>
        </button>
        <div></div>
      `;
    }

    // Other page
    if (curPage < numPages) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev  btn btn-cct-russet ms-2 ps-1 mt-2">
          <i class="bi bi-arrow-left"></i>
          <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next  btn btn-cct-russet me-2 ps-1 mt-2">
          <span>Page ${curPage + 1}</span>
          <i class="bi bi-arrow-right"></i>
        </button>
      `;
    }

    // Page 1, and there are NO other pages
    return "";
  }
}

export default new PaginationView();
