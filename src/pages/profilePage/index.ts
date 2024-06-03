import { Address, ClientResponse } from '@commercetools/platform-sdk';
import { getUserById } from '../../api/SDK';
import Router from '../../router';
import {
  createBtn,
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
import ProfileAccountBlock from './accountInfoBlock';
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

  public profileAccountBlock?: ProfileAccountBlock;

  public newAddressButton?: HTMLButtonElement;

  public addressBlocksArr: ProfileAddressBlock[];

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

    this.newAddressButton = createBtn(
      styles.newAddressButton,
      'Add a new address',
      this.profileAddressBlock
    );

    this.addressBlocksArr = [];

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
    if (target === this.passwordLink) {
      this.createAccountInfo();
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
      this.profileAddressBlock = createDiv(
        styles.addressesWrapper,
        this.mainBlockForm
      );
      const addressesHeading = createH3(
        styles.addressesHeading,
        'Registered addresses'
      );
      this.profileAddressBlock?.append(addressesHeading);

      userInfo.body.addresses.forEach((e: Address) => {
        const block = new ProfileAddressBlock(
          userInfo.body.id,
          userInfo.body.defaultShippingAddressId,
          userInfo.body.defaultBillingAddressId,
          false,
          e
        );
        this.profileAddressBlock?.append(block.getBlock());
        this.addressBlocksArr.push(block);
      });
      if (this.newAddressButton) {
        this.profileAddressBlock?.append(this.newAddressButton);
      }
      this.mainBlockForm.prepend(this.profileAddressBlock);

      this.newAddressButton?.addEventListener('click', (e) => {
        const newAddress = this.addNewAddress.bind(this, e, userInfo);
        newAddress();
      });
    } else {
      throw new Error('There is no such user');
    }
  }

  private addNewAddress(e: Event, UserInfo: ClientResponse) {
    e.preventDefault();

    const newBlock = new ProfileAddressBlock(
      UserInfo.body.id,
      UserInfo.body.defaultShippingAddressId,
      UserInfo.body.defaultBillingAddressId,
      true
    );
    this.newAddressButton?.insertAdjacentElement(
      'beforebegin',
      newBlock.getBlock()
    );
  }

  private async createAccountInfo() {
    this.mainBlockForm.firstChild?.remove();
    const userId = localStorage.getItem('id');

    if (userId) {
      const userInfo = await getUserById(userId);
      this.profileAccountBlock = new ProfileAccountBlock(userInfo.body);
      this.mainBlockForm.prepend(this.profileAccountBlock.getBlock());
    } else {
      throw new Error('There is no such user');
    }
  }
}
export default ProfilePage;
