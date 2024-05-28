// import { ClientResponse } from '@commercetools/platform-sdk';
// import { getUserById } from '../../api/SDK';
import Router from '../../router';
import {
  createDiv,
  // createInput,
  // createLabel,
  createLink,
  createList,
  createListElement,
} from '../../utils/elementCreator';
import Page from '../Page';
import styles from './profilePage.module.css';

class ProfilePage extends Page {
  public asideBlock: HTMLDivElement;

  public optionList: HTMLUListElement;

  public personalListElement: HTMLLIElement;

  public personalLink: HTMLAnchorElement;

  public addressListElement: HTMLLIElement;

  public addressLink: HTMLAnchorElement;

  public passwordListElement: HTMLLIElement;

  public passwordLink: HTMLAnchorElement;

  public profileMainBlock: HTMLDivElement;

  public mainBlockWrapper: HTMLDivElement;

  // public userId: string;

  // public userInfo: ClientResponse;

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    // this.userId = localStorage.getItem('id')
    //   ? JSON.parse(localStorage.getItem('id'))
    //   : null;
    // this.userInfo = getUserById(this.userId);
    this.container.classList.add(styles.container);
    this.asideBlock = createDiv(styles.asideBlock, this.container);
    this.optionList = createList(styles.optionsList, this.asideBlock);
    this.personalListElement = createListElement(
      styles.optionsListEl,
      '',
      this.optionList
    );
    this.personalLink = createLink(
      styles.optionLink,
      'Personal information',
      '',
      this.personalListElement
    );
    this.addressListElement = createListElement(
      styles.optionsListEl,
      '',
      this.optionList
    );
    this.addressLink = createLink(
      styles.optionLink,
      'Address information',
      '',
      this.addressListElement
    );
    this.passwordListElement = createListElement(
      styles.optionsListEl,
      '',
      this.optionList
    );
    this.passwordLink = createLink(
      styles.optionLink,
      'Change password',
      '',
      this.passwordListElement
    );

    this.profileMainBlock = createDiv(styles.profileMainBlock, this.container);
    this.mainBlockWrapper = createDiv(
      styles.mainBlockWrapper,
      this.profileMainBlock
    );

    // this.optionList.addEventListener(
    //   'click',
    //   this.handleOptionClick.bind(this)
    // );
  }

  // private handleOptionClick(e: Event) {
  //   const target: HTMLAnchorElement = e.target as HTMLAnchorElement;
  //   e.preventDefault();
  //   if (target === this.personalLink) {
  //     this.createPersonalInfo();
  //   }
  //   if (target === this.addressLink) {
  //   }
  //   if (target === this.passwordLink) {
  //   }
  // }

  // private createPersonalInfo() {
  //   const firstNameLabel = createLabel(
  //     styles.inputLabel,
  //     'First name:',
  //     this.mainBlockWrapper
  //   );
  //   const firstNameInput = createInput({
  //     className: styles.input,
  //     type: 'text',
  //     isActive: false,
  //     parentElement: firstNameLabel,
  //   });
  // }
}

export default ProfilePage;
