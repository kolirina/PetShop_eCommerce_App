import { Address } from '@commercetools/platform-sdk';
import { getUserById } from '../../api/SDK';
import Router from '../../router';
import {
  createDiv,
  createForm,
  createH3,
  createLink,
  createList,
  createListElement,
} from '../../utils/elementCreator';
import Page from '../Page';
import ProfileAddressBlock from './addressBlock';
import ProfilePersonalBlock from './personalBlock';
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

  public mainBlockForm: HTMLFormElement;

  public profilePersonalBlock?: ProfilePersonalBlock;

  public profileAddressBlock?: HTMLDivElement;

  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
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
      'Account information',
      '',
      this.passwordListElement
    );

    this.profileMainBlock = createDiv(styles.profileMainBlock, this.container);
    this.mainBlockForm = createForm(
      styles.mainBlockForm,
      this.profileMainBlock
    );
    this.optionList.addEventListener(
      'click',
      this.handleOptionClick.bind(this)
    );
    this.createPersonalInfo();
  }

  private handleOptionClick(e: Event) {
    const target: HTMLAnchorElement = e.target as HTMLAnchorElement;
    e.preventDefault();
    if (target === this.personalLink) {
      this.createPersonalInfo();
    }
    if (target === this.addressLink) {
      this.createAddressInfo();
    }
  }

  private async createPersonalInfo() {
    this.mainBlockForm.firstChild?.remove();
    const userId = localStorage.getItem('id');
    this.personalLink.classList.add('link-active');
    if (userId) {
      const userInfo = await getUserById(userId);
      this.profilePersonalBlock = new ProfilePersonalBlock(userInfo.body);
      this.profilePersonalBlock.setFirstName(await userInfo.body.firstName);
      this.profilePersonalBlock.setLastName(await userInfo.body.lastName);
      this.profilePersonalBlock.setDateOfBirth(await userInfo.body.dateOfBirth);
      this.mainBlockForm.prepend(this.profilePersonalBlock.getBlock());
      this.profilePersonalBlock.saveBtn.dataset.block = 'personal';
    } else {
      throw new Error('There is no such user');
    }
  }

  private async createAddressInfo() {
    this.mainBlockForm.firstChild?.remove();
    const userId = localStorage.getItem('id');

    if (userId) {
      const userInfo = await getUserById(userId);
      const addressesWrapper = createDiv(
        styles.addressesWrapper,
        this.mainBlockForm
      );
      const addressesHeading = createH3(
        styles.addressesHeading,
        'Registered addresses'
      );
      addressesWrapper.append(addressesHeading);

      userInfo.body.addresses.forEach((e: Address) => {
        const block = new ProfileAddressBlock(
          e,
          userInfo.body.defaultBillingAddressId,
          userInfo.body.defaultShippingAddressId,
          userInfo.body.id
        );
        addressesWrapper.append(block.getBlock());
      });
      this.profileAddressBlock = addressesWrapper;
      this.mainBlockForm.prepend(this.profileAddressBlock);
    } else {
      throw new Error('There is no such user');
    }
  }
}

export default ProfilePage;
