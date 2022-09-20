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
    this.render(data);
    /*
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
    */
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
				<div class="d-flex justify-content-center">
          <i class="bi bi-exclamation-triangle text-cct-russet fs-1"></i>
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
        <div class="d-flex justify-content-center">
          <i class="bi bi-check2-circle text-cct-russet fs-1"></i>
        </div>
        <p class="text-center text-cct-russet">${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
