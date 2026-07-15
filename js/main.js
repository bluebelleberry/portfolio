document.addEventListener('DOMContentLoaded', () => {
  loadPortfolioData();
  setupHamburgerMenu();
  setupActiveNavHighlight();
  setupScrollProgress();
});

function loadPortfolioData() {
  fetch('data/data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      renderProfile(data.profile);
      renderSkills(data.skills);
      renderProjects(data.projects);
      renderExperience(data.experience);
    })
    .catch(error => {
      console.error('Could not load portfolio data:', error);
    });
}

function renderProfile(profile) {
  if (!profile) return;

  document.getElementById('heroName').textContent = profile.name;
  document.getElementById('heroRole').textContent = profile.role;
  document.getElementById('heroTagline').textContent = profile.tagline;

  document.getElementById('aboutBio').textContent = profile.bio;
  document.getElementById('contactEmail').textContent = profile.email;
  document.getElementById('footerName').textContent = profile.name;

  document.title = profile.name + ' — Portfolio';

  const factsContainer = document.getElementById('aboutFacts');
  factsContainer.innerHTML = '';
  const facts = [profile.role, '📍 ' + profile.location];
  facts.forEach(fact => {
    const pill = document.createElement('span');
    pill.className = 'fact-pill';
    pill.textContent = fact;
    factsContainer.appendChild(pill);
  });

  const socialsContainer = document.getElementById('socials');
  socialsContainer.innerHTML = '';
  (profile.socials || []).forEach(social => {
    const link = document.createElement('a');
    link.href = social.url;
    link.textContent = social.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    socialsContainer.appendChild(link);
  });
}

function renderSkills(skills) {
  const grid = document.getElementById('skillsGrid');
  grid.innerHTML = '';
  if (!skills) return;

  skills.forEach(skill => {
    const item = document.createElement('div');
    item.className = 'skill-item';
    item.innerHTML =
      '<div class="skill-top">' +
        '<span>' + skill.name + '</span>' +
        '<span>' + skill.level + '%</span>' +
      '</div>' +
      '<div class="skill-track">' +
        '<div class="skill-fill" data-level="' + skill.level + '"></div>' +
      '</div>';
    grid.appendChild(item);

    const fill = item.querySelector('.skill-fill');
    setTimeout(() => {
      fill.style.width = fill.dataset.level + '%';
    }, 100);
  });
}

function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '';
  if (!projects) return;

  projects.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card';

    let tagsHTML = '';
    (project.tags || []).forEach(tag => {
      tagsHTML += '<span>' + tag + '</span>';
    });

    let linksHTML = '';

    if (project.github) {
      linksHTML +=
        '<a href="' + project.github + '" class="btn-github" target="_blank" rel="noopener noreferrer">GitHub</a>';
    }

    if (project.figma) {
      linksHTML +=
        '<a href="' + project.figma + '" class="btn-figma" target="_blank" rel="noopener noreferrer">Figma</a>';
    }

    card.innerHTML =
      '<div class="project-thumb">' +
          '<img src="' + project.image + '" alt="' + project.title + '">' +
      '</div>' +
      '<div class="project-body">' +
        '<h3>' + project.title + '</h3>' +
        '<p>' + project.description + '</p>' +
        '<div class="project-tags">' + tagsHTML + '</div>' +
        '<div class="project-links">' + linksHTML + '</div>' +
      '</div>';

    grid.appendChild(card);
  });
}

function renderExperience(experience) {
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = '';
  if (!experience) return;

  experience.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML =
      '<p class="timeline-year">' + entry.year + '</p>' +
      '<h3>' + entry.title + '</h3>' +
      '<p class="timeline-place">' + entry.place + '</p>' +
      '<p class="timeline-desc">' + entry.description + '</p>';
    timeline.appendChild(item);
  });
}
function setupHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  });

  const links = navLinks.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupActiveNavHighlight() {
  const sections = document.querySelectorAll('main .section');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const currentId = section.getAttribute('id');
        navLinks.forEach(link => {
          if (link.dataset.section === currentId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
}

function setupScrollProgress() {
  const progressFill = document.getElementById('progressFill');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.height = progress + '%';
  }

  window.addEventListener('scroll', updateProgress);
  updateProgress();
}