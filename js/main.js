(function () {
  const root = document.documentElement;
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('primary-menu');
  const siteNav = document.querySelector('.site-nav');
  const projectsList = document.getElementById('projects-list');
  const insightsList = document.getElementById('insights-list');
  const currentYearEl = document.getElementById('current-year');

  const THEME_STORAGE_KEY = 'portfolio-theme';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const fallbackProjects = [
    {
      title: 'Enterprise IAM Automation Platform',
      slug: 'iam-automation',
      description:
        'PowerShell and Python-driven user provisioning system for 500-user organization across 450+ applications with compliance reporting for financial services regulations.',
      techStack: ['PowerShell', 'Python', 'Okta', 'Azure AD', 'Auth0', 'SQL Server'],
      features: [
        '30% reduction in manual provisioning processes',
        'Automated compliance reporting pipeline for financial services',
        'Integration with Jira ticketing and Monday.com project management'
      ],
      links: {
        github: null,
        live: 'projects/iam-automation.html'
      }
    },
    {
      title: 'SMELS - Small Model Error Log Summarizer',
      slug: 'smels-rs',
      description:
        'Intelligent CLI tool that analyzes and provides actionable fixes for errors across multiple programming languages using local AI models for privacy-focused development workflow enhancement.',
      techStack: ['Rust', 'Ollama', 'AI/ML', 'CLI', 'Multi-language Parsing'],
      features: [
        'Multi-language error detection (Rust, JS, Python, Java)',
        'Local AI processing with privacy-first design',
        'Published as open-source crate on crates.io'
      ],
      links: {
        github: 'https://github.com/etuckerdev/smels-rs',
        live: 'projects/smels-rs.html'
      }
    },
    {
      title: 'Enterprise Billing System Features',
      slug: 'billing-platform',
      description:
        'ASP.NET enterprise billing platform with KnockoutJS frontend, optimized for high-volume financial transaction processing.',
      techStack: ['C#', 'ASP.NET', 'KnockoutJS', 'SQL Server', 'JavaScript'],
      features: [
        'Invoice design system improvements and UI enhancements',
        'Database query optimizations for high-volume billing operations'
      ],
      links: {
        github: null,
        live: 'projects/billing-platform.html'
      }
    },
    {
      title: 'RustAIx - Systems Programming Exploration',
      slug: 'rustrix',
      description:
        'Advanced systems programming project exploring Rust\'s capabilities in AI-adjacent domains, demonstrating modern memory-safe systems development practices.',
      techStack: ['Rust', 'Systems Programming', 'Performance Optimization'],
      features: [
        'Exploration of Rust\'s memory safety in complex systems',
        'Performance-critical implementation patterns'
      ],
      links: {
        github: 'https://github.com/etuckerdev/RustAIx',
        live: 'projects/rustrix.html'
      }
    }
  ];


  function updateThemeIcons(theme) {
    if (!themeToggle) return;
    const sun = themeToggle.querySelector('.icon-sun');
    const moon = themeToggle.querySelector('.icon-moon');
    if (theme === 'dark') {
      if (sun) sun.style.display = 'none';
      if (moon) moon.style.display = '';
    } else {
      if (sun) sun.style.display = '';
      if (moon) moon.style.display = 'none';
    }
  }

  function setTheme(theme) {
    const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = resolvedTheme;
    body.dataset.theme = resolvedTheme;
    themeToggle.setAttribute('aria-pressed', resolvedTheme === 'dark');
    localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);
    updateThemeIcons(resolvedTheme);
  }

  function initTheme() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    let initialTheme;
    if (storedTheme) {
      initialTheme = storedTheme;
    } else if (prefersDark.matches) {
      initialTheme = 'dark';
    } else {
      initialTheme = 'light';
    }
    setTheme(initialTheme);

    const handlePrefChange = (event) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setTheme(event.matches ? 'dark' : 'light');
      }
    };

    if (typeof prefersDark.addEventListener === 'function') {
      prefersDark.addEventListener('change', handlePrefChange);
    } else if (typeof prefersDark.addListener === 'function') {
      prefersDark.addListener(handlePrefChange);
    }

    themeToggle?.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  function initNavigation() {
    if (!navToggle || !siteNav) return;

    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      siteNav.classList.toggle('is-open', !isExpanded);
      if (!isExpanded) {
        const firstLink = navMenu?.querySelector('a');
        if (firstLink) {
          if (typeof firstLink.focus === 'function') {
            try {
              firstLink.focus({ preventScroll: true });
            } catch (error) {
              firstLink.focus();
            }
          }
        }
      }
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('is-open');
      });
    });

    document.addEventListener('click', (event) => {
      if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('is-open');
      }
    });
  }

  async function loadProjects() {
    if (!projectsList) return;

    try {
      const response = await fetch('projects/projects.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      renderProjects(Array.isArray(data?.projects) ? data.projects : fallbackProjects);
    } catch (error) {
      console.warn('Falling back to inline project data', error);
      renderProjects(fallbackProjects);
    }
  }

  async function loadInsights() {
    if (!insightsList) return;

    try {
      const response = await fetch('insights/articles.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      renderInsights(Array.isArray(data?.articles) ? data.articles : []);
    } catch (error) {
      console.warn('Could not load insights', error);
      renderInsights([]);
    }
  }

  function renderProjects(projects) {
    if (!projectsList) return;

    projectsList.innerHTML = '';
    projects.forEach((project) => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.setAttribute('tabindex', '0');

      const title = document.createElement('h3');
      title.className = 'project-card__title';
      title.textContent = project.title;
      card.appendChild(title);

      const description = document.createElement('p');
      description.textContent = project.description;
      card.appendChild(description);

      if (Array.isArray(project.techStack) && project.techStack.length) {
        const techList = document.createElement('ul');
        techList.className = 'project-card__meta';
        project.techStack.forEach((tech) => {
          const item = document.createElement('li');
          item.textContent = tech;
          techList.appendChild(item);
        });
        card.appendChild(techList);
      }

      if (Array.isArray(project.features) && project.features.length) {
        const featureList = document.createElement('ul');
        featureList.className = 'project-card__features';
        project.features.forEach((feature) => {
          const item = document.createElement('li');
          item.textContent = feature;
          featureList.appendChild(item);
        });
        card.appendChild(featureList);
      }

      if (project.links && (project.links.github || project.links.live)) {
        const links = document.createElement('div');
        links.className = 'project-card__links';

        if (project.links.github) {
          const githubLink = document.createElement('a');
          githubLink.href = project.links.github;
          githubLink.target = '_blank';
          githubLink.rel = 'noopener';
          githubLink.textContent = 'GitHub';
          links.appendChild(githubLink);
        }

        if (project.links.live) {
          const liveLink = document.createElement('a');
          liveLink.href = project.links.live;
          liveLink.target = '_blank';
          liveLink.rel = 'noopener';
          liveLink.textContent = 'Read more';
          links.appendChild(liveLink);
        }

        card.appendChild(links);
      }

      projectsList.appendChild(card);
    });
  }

  function renderInsights(articles) {
    if (!insightsList) return;

    insightsList.innerHTML = '';
    
    // Show featured articles first, then others
    const sortedArticles = articles.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.publishDate) - new Date(a.publishDate);
    });

    sortedArticles.forEach((article) => {
      const card = document.createElement('a');
      card.href = `insights/${article.slug}.html`;
      card.className = `insight-card${article.featured ? ' featured' : ''}`;
      card.setAttribute('aria-label', `Read article: ${article.title}`);

      const meta = document.createElement('div');
      meta.className = 'insight-card__meta';
      
      const category = document.createElement('span');
      category.className = 'insight-card__category';
      category.textContent = article.category;
      
      const date = document.createElement('time');
      date.setAttribute('datetime', article.publishDate);
      date.textContent = new Date(article.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const readTime = document.createElement('span');
      readTime.textContent = article.readTime;
      
      meta.appendChild(category);
      meta.appendChild(date);
      meta.appendChild(readTime);

      const title = document.createElement('h3');
      title.textContent = article.title;

      const excerpt = document.createElement('p');
      excerpt.textContent = article.excerpt;

      card.appendChild(meta);
      card.appendChild(title);
      card.appendChild(excerpt);

      insightsList.appendChild(card);
    });
  }

  function setCurrentYear() {
    if (currentYearEl) {
      currentYearEl.textContent = new Date().getFullYear().toString();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    loadProjects();
    loadInsights();
    setCurrentYear();
  });
})();
