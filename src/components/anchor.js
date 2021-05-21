export default class Anchor {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.anchor = document.querySelector(selector);

    return refs;
  }

  show() {
    this.refs.anchor.classList.remove('is-hidden');
  }

  hide() {
    this.refs.anchor.classList.add('is-hidden');
  }
}
