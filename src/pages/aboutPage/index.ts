import Router from '../../router';
import Page from '../Page';
import styles from './aboutPage.module.css';
import rsLogo from '../../assets/logo-rsschool.png';
import {
  createDiv,
  createImg,
  createLink,
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
        bio: 'bio',
        github: 'https://github.com/amrkov5',
        photo: rsLogo,
      },
      {
        name: 'Irina Kolotilkina',
        role: 'Developer',
        bio: 'bio',
        github: 'https://github.com/kolirina',
        photo: rsLogo,
      },
      {
        name: 'Vitalii Zomsha',
        role: 'Developer',
        bio: 'bio',
        github: 'https://github.com/veta306',
        photo: rsLogo,
      },
    ];

    const teamContainer = createDiv(styles.teamContainer, this.container);
    teamMembers.forEach((member) => {
      const memberCard = createDiv(styles.memberCard, teamContainer);
      createImg(
        styles.memberPhoto,
        member.photo,
        `${member.name}'s photo`,
        memberCard
      );
      createParagraph(styles.memberName, member.name, memberCard);
      createParagraph(styles.memberRole, member.role, memberCard);
      createParagraph(styles.memberBio, member.bio, memberCard);
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
    createParagraph(styles.infoHead, 'Detailed Introduction:', infoContainer);
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
