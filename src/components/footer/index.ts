import { createSpan } from '../../utils/elementCreator';
import styles from './footer.module.css';

export default class Footer {
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('footer');
    createSpan(styles.info, 'Ⓒ2024 Pet Shop', this.container);
    this.container.classList.add(styles.footer);
  }

  getFooterElement() {
    return this.container;
  }
}
