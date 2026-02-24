/* portfolio.js — Logique interactive du portfolio */

/* CUSTOM CURSOR  */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .project-card, .tool-icon, .tl-card-inner').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '18px';
    cursor.style.height = '18px';
    ring.style.width = '50px';
    ring.style.height = '50px';
    ring.style.opacity = '.3';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    ring.style.width = '36px';
    ring.style.height = '36px';
    ring.style.opacity = '.5';
  });
});

/* NAVBAR — ÉTAT ACTIF AU SCROLL */
const navPills = document.querySelectorAll('.nav-pill');
const sectionIds = ['accueil', 'parcours', 'competences', 'projets'];

function updateNav() {
  let current = 'accueil';

  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (window.scrollY >= el.offsetTop - 120) current = id;
  }

  navPills.forEach(pill => {
    const s = pill.getAttribute('data-section');
    // La section "compétences" est visuellement rattachée à "parcours" dans la nav
    const isActive = s === current || (current === 'competences' && s === 'parcours');
    pill.classList.toggle('active', isActive);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });

/* SMOOTH SCROLL (liens de navigation) */
navPills.forEach(pill => {
  pill.addEventListener('click', e => {
    e.preventDefault();
    const target = pill.getAttribute('href');
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  });
});

/* INTERSECTION OBSERVER — Animations d'apparition */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('visible');

    // Animation spécifique aux cercles de compétences
    if (entry.target.classList.contains('skill-circle')) {
      const pct = parseInt(entry.target.getAttribute('data-pct'));
      const fill = entry.target.querySelector('.skill-ring-fill');
      const circ = 264; // circonférence = 2π × r (r = 42)
      const offset = circ - (pct / 100) * circ;

      setTimeout(() => {
        fill.style.strokeDashoffset = offset;
      }, 100);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-in, .tl-card, .skill-circle, .project-card')
  .forEach(el => observer.observe(el));

/* PROJETS — Données */
const projects = [
  {
    title: "Jeu d'Enquête Python",
    desc: "C'est un mini-projet développé en Python combinant intelligence artificielle et gameplay interactif. Il s’agit d’un jeu d’investigation dans lequel le joueur interroge plusieurs suspects, tandis qu’une IA, intégrée via Ollama et des modèles LLM, génère des réponses contextualisées et des indices dynamiques pour aider dans l’identification de l’imposteur. Le système repose sur des prompts définissant le comportement des suspects, une boucle de gameplay interactive et l’utilisation de bibliothèques comme NumPy et Scikit-learn pour la gestion des données et des logiques d’IA. Ce projet m’a permis de découvrir l’intégration de modèles LLM en local avec Ollama, la conception d’interactions conversationnelles, ainsi que la structuration d’un projet Python mêlant intelligence artificielle, logique de jeu et gestion de données.",
    tags: ['Python', 'LLM'],
    image: 'images/projet-enquete.png'
  },
  {
    title: 'Application Android React',
    desc: "CinéMapps est une application mobile Android développée en Kotlin dans le cadre d’un projet de groupe à l’EPSI (2025-2026). Elle permet aux utilisateurs de créer un compte, de se connecter via un QR Code lié à une carte de fidélité, de consulter une liste de films récupérés via un WebService, ainsi que d’accéder aux détails des films (résumé, durée, images et bande-annonce YouTube). L’application propose également une carte interactive des salles de cinéma avec leurs informations complètes (adresse, transports, parking) et un espace utilisateur permettant la gestion et la modification du profil. Ce projet m’a permis de travailler en équipe sur un cycle de développement mobile complet, en utilisant Kotlin, Android Studio, Git et des outils de gestion de projet comme Trello.",
    tags: ['Kotlin', 'Trello'],
    image: 'images/projet-enquete.png'
  },
  {
    title: 'Application mobile "Survival Trade"',
    desc: "Survival Trade est une application mobile multiplateforme développée en React Native (TypeScript) avec Expo, pensée pour fonctionner entièrement hors-ligne. Elle permet aux utilisateurs d’échanger des biens et services via un système de troc local, de communiquer grâce à une messagerie pair-à-pair en Bluetooth et de partager l’application via QR code, sans dépendre d’Internet ni d’un serveur centralisé. Le projet met l’accent sur la résilience numérique, la sécurité des données stockées en local et l’autonomie des utilisateurs en contexte critique. Réalisé en équipe avec une organisation agile (Jira, GitHub/GitLab), il m’a également permis de concevoir un design system complet sur Figma (composants réutilisables, palette de couleurs, typographie et guidelines), tout en développant des compétences en développement mobile, UX/UI, architecture hors-ligne et travail collaboratif.",
    tags: ['Figma', 'CSS', 'Design System'],
    image: 'images/projet-enquete.png'
  }
];

/* PROJETS — Panneau de détail */
let openId = null;
const detail = document.getElementById('project-detail');

document.querySelectorAll('.project-card').forEach((card, i) => {
  card.addEventListener('click', () => {
    // Clic sur une carte déjà ouverte → fermer
    if (openId === i) {
      closeDetail();
      return;
    }

    openId = i;
    const p = projects[i];

    document.getElementById('detail-title').textContent = p.title;
    document.getElementById('detail-desc').textContent = p.desc;

    const tagsEl = document.getElementById('detail-tags');
    tagsEl.innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');

    const imgEl = document.getElementById('detail-img');
    imgEl.innerHTML = `<div class="detail-img-placeholder">${p.emoji}</div>`;

    detail.classList.add('open');
    detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

function closeDetail() {
  openId = null;
  detail.classList.remove('open');
}

// Exposer closeDetail globalement (utilisé via onclick dans le HTML)
window.closeDetail = closeDetail;
