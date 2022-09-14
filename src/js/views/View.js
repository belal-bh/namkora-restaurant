import icons from "url:../../img/icons.svg";
import "bootstrap-icons/font/bootstrap-icons.css";

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // console.log(curEl, newEl.isEqualNode(curEl));
      // console.log(newEl);

      // updates changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        // console.log('💥', newEl.firstChild?.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // update changed attribute
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner(loadingMessage = null) {
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
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
			<div class="error">
				<div>
					<svg>
					<use href="${icons}#icon-alert-triangle"></use>
					</svg>
				</div>
				<p>${message}</p>
			</div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message text-align-center">
        <div>
          <p class="text-center text-cct-russet"><span class="me-2"><i class="bi bi-check2-circle"></i></span>${message}</p>
        </div>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
