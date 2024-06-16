import Router from '../../router';
import Page from '../Page';
import styles from './aboutPage.module.css';
import rsLogo from '../../assets/logo-rsschool.png';
import photoIrina from '../../assets/photo-Irina.png';
import photoVitalii from '../../assets/photo-Vitalii.jpg';
import photoAnton from '../../assets/photo-Anton.jpg';
import {
  createDiv,
  createImg,
  createLink,
  createList,
  createListElement,
  createParagraph,
} from '../../utils/elementCreator';

class AboutPage extends Page {
  constructor(router: Router, parentElement: HTMLElement) {
    super(router, parentElement);
    this.container.classList.add(styles.container);
    const teamMembers = [
      {
        name: 'Anton Markov',
        role: 'Team Lead',
        bio: `I am an information security specialist currently studying front-end development. My experience covers
              various areas of information security, including incident management, risk management, network security, and
              audits. Programming is an important part of my life, and I am fascinated with front-end development, which
              I now aspire to do daily. With each project and challenge, I have discovered my passion for front-end development
              and am ready to continue my journey towards becoming a professional in the field.`,
        contributions: ['Registration page', 'Profile page', 'Cart page'],
        github: 'https://github.com/amrkov5',
        photo: photoAnton,
      },
      {
        name: 'Irina Kolotilkina',
        role: 'Developer',
        bio: `With a background in finance and linguistics, I started my journey into front-end development at
              RS School Stage 1 in November 2023. Before beginning studies at RS School, I worked for several years
              as a financial analyst for a bank and then as a corporate and private English teacher. Despite some
              ups and downs along the way, I have undeniably found my passion in this new field. I truly enjoy the
              challenges and mental exercise it provides. Looking forward to embarking on stage 3 of this amazing course.`,
        contributions: ['Login page', 'Catalog page'],
        github: 'https://github.com/kolirina',
        photo: photoIrina,
      },
      {
        name: 'Vitalii Zomsha',
        role: 'Developer',
        bio: `I am a third-year student majoring in Software Engineering. My background has primarily been in working
              with C# and Java, where I have gained a solid understanding of programming principles and practices.
              Recently, I have decided to venture into the exciting world of web development. I am passionate about
              expanding my knowledge and skills, and I am eager to see where this path in web development will take me.`,
        contributions: ['Main page', 'Product page', 'Error page'],
        github: 'https://github.com/veta306',
        photo: photoVitalii,
      },
    ];

    const teamContainer = createDiv(styles.teamContainer, this.container);
    teamMembers.forEach((member) => {
      const memberCard = createDiv(styles.memberCard, teamContainer);
      const photoContainer = createDiv(styles.photoContainer, memberCard);
      createImg(
        styles.memberPhoto,
        member.photo,
        `${member.name}'s photo`,
        photoContainer
      );
      createParagraph(styles.memberName, member.name, memberCard);
      createParagraph(styles.memberRole, member.role, memberCard);
      createParagraph(styles.memberBio, member.bio, memberCard);
      createParagraph(
        styles.memberContributionHead,
        'Contribution to the development:',
        memberCard
      );
      const contributions = createList(styles.contributions, memberCard);
      member.contributions.forEach((contribution) => {
        createListElement(styles.contribution, contribution, contributions);
      });
      const githubLink = createLink(
        styles.memberGithub,
        'GitHub Profile ↗',
        member.github,
        memberCard
      );
      githubLink.target = '_blank';
    });
    const detailedInfo = createDiv(styles.detailedInfo, this.container);
    const infoContainer = createDiv(styles.infoContainer, detailedInfo);
    createParagraph(styles.infoHead, 'Detailed information:', infoContainer);
    createParagraph(
      styles.info,
      `Our application allows you to browse, search, and discover the perfect products for your pets.
      Register and log in to explore detailed descriptions, add items to your cart, and enjoy the
      convenience of categorization and sorting features. The application is designed to perform
      flawlessly on any device, ensuring a smooth shopping experience regardless of screen size.
      Together, we've collaborated to build key pages such as the login, registration, profile,
      and cart pages, ensuring a seamless user experience from start to finish. Each member has
      made significant contributions to various aspects of the application, from crafting elegant
      user interfaces to implementing robust backend functionality. With our collective skills
      and dedication, we're excited to continue innovating and delivering top-notch solutionsfor
      our customers at PetShop.`,
      infoContainer
    );
    const logoContainer = createDiv(styles.logoContainer, detailedInfo);
    createParagraph(
      styles.logoText,
      'Created with the encouragement of:',
      logoContainer
    );
    const logoImage = createImg(
      styles.logo,
      rsLogo,
      'RS School Logo',
      logoContainer
    );
    logoImage.addEventListener('click', () => {
      window.open('https://rs.school/', '_blank');
    });
  }
}

export default AboutPage;
