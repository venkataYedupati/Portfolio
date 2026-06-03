const DATA_SOURCE = document.body.dataset.source || "portfolio-data.json";
const THEME_STORAGE_KEY = "portfolio-theme";

const ICONS = {
  code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m8.7 16.6-5-5 5-5 1.4 1.4-3.6 3.6 3.6 3.6-1.4 1.4Zm6.6 0-1.4-1.4 3.6-3.6-3.6-3.6 1.4-1.4 5 5-5 5Zm-3.9 1.2-1.9-.6 3.1-10.4 1.9.6-3.1 10.4Z"/></svg>',
  external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3ZM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.3 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM9.5 10H6.8v8h2.7v-8Zm.2-2.5a1.6 1.6 0 1 0-3.2 0 1.6 1.6 0 0 0 3.2 0Zm8.3 5.7c0-2.3-1.2-3.4-2.8-3.4-1.3 0-1.9.7-2.2 1.2v-1h-2.7v8H13v-4c0-1.1.2-2.1 1.5-2.1s1.3 1.2 1.3 2.2V18H18v-4.8Z"/></svg>',
  location: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.2-8 5-8-5V6l8 5 8-5v2.2Z"/></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 14.7A8.5 8.5 0 0 1 9.3 3a9 9 0 1 0 11.7 11.7Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.4a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.2 1l-2.2 2.2Z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 4V1h2v3h-2Zm0 19v-3h2v3h-2ZM4 13H1v-2h3v2Zm19 0h-3v-2h3v2ZM5.6 7 3.5 4.9l1.4-1.4L7 5.6 5.6 7Zm14.5 14.1L18 19.5l1.4-1.4 2.1 2.1-1.4 1.5ZM18 5.6l2.1-2.1 1.4 1.4L19.4 7 18 5.6ZM3.5 20.2 5.6 18l1.4 1.4-2.1 2.1-1.4-1.3ZM13 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z"/></svg>'
};

const CSS_VAR_MAP = {
  accent: "--accent",
  bg: "--bg",
  bgSoft: "--bg-soft",
  brand: "--brand",
  brand2: "--brand-2",
  line: "--line",
  muted: "--muted",
  panel: "--panel",
  panelStrong: "--panel-strong",
  shadow: "--shadow",
  surface: "--surface",
  text: "--text"
};

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const storage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      return null;
    }
  }
};

const setText = (selector, value) => {
  const element = typeof selector === "string" ? qs(selector) : selector;
  if (element) {
    element.textContent = value || "";
  }
};

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
};

const createIcon = (name) => {
  const icon = createElement("span", "icon");
  icon.innerHTML = ICONS[name] || ICONS.external;
  return icon;
};

const isExternalHref = (href = "") => /^https?:\/\//.test(href);

const createLink = ({ href, label, icon, variant = "secondary", compact = false }) => {
  const link = createElement("a", `btn btn-${variant}${compact ? " btn-compact" : ""}`);
  link.href = href;
  if (isExternalHref(href)) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  if (icon) {
    link.append(createIcon(icon));
  }
  link.append(createElement("span", "", label));
  return link;
};

const loadPortfolioData = async () => {
  const response = await fetch(DATA_SOURCE, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load ${DATA_SOURCE}`);
  }
  return response.json();
};

const applyMeta = (data) => {
  const { site = {} } = data;
  if (site.title) {
    document.title = site.title;
  }

  const description = qs("meta[name='description']");
  if (description && site.description) {
    description.setAttribute("content", site.description);
  }
};

const setFavicon = (initial, theme) => {
  const favicon = qs("#site-favicon");
  if (!favicon || !initial) {
    return;
  }

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">',
    `<rect width="64" height="64" rx="12" fill="${theme.bg || "#10130f"}"/>`,
    `<text x="50%" y="56%" font-size="30" font-weight="800" text-anchor="middle" fill="${theme.brand || "#6ee7b7"}" font-family="Arial, sans-serif">${initial}</text>`,
    "</svg>"
  ].join("");

  favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const applyTheme = (data, themeName) => {
  const themes = data.themes || {};
  const theme = themes[themeName] || themes.dark || {};
  const root = document.documentElement;

  Object.entries(CSS_VAR_MAP).forEach(([key, variable]) => {
    if (theme[key]) {
      root.style.setProperty(variable, theme[key]);
    }
  });

  document.body.dataset.theme = themeName;

  const meta = qs("meta[name='theme-color']");
  if (meta) {
    meta.setAttribute("content", theme.bg || data.site?.themeColor || "#10130f");
  }

  const nextTheme = themeName === "light" ? "dark" : "light";
  setText("[data-theme-label]", `Switch to ${nextTheme} theme`);
  const themeIcon = qs("[data-theme-icon]");
  if (themeIcon) {
    themeIcon.innerHTML = ICONS[themeName === "light" ? "moon" : "sun"];
  }

  setFavicon(data.site?.faviconInitial, theme);
};

const bindThemeToggle = (data) => {
  const themeToggle = qs("#theme-toggle");
  const themes = Object.keys(data.themes || {});
  let activeTheme = storage.get(THEME_STORAGE_KEY) || "dark";

  if (!themes.includes(activeTheme)) {
    activeTheme = themes[0] || "dark";
  }

  applyTheme(data, activeTheme);

  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    activeTheme = activeTheme === "light" ? "dark" : "light";
    if (!themes.includes(activeTheme)) {
      activeTheme = themes[0] || "dark";
    }
    storage.set(THEME_STORAGE_KEY, activeTheme);
    applyTheme(data, activeTheme);
  });
};

const renderNavigation = ({ navigation = [], profile = {} }) => {
  setText("[data-brand]", profile.shortName);

  const nav = qs("[data-nav]");
  if (nav) {
    nav.replaceChildren(
      ...navigation.map((item) => {
        const link = createElement("a", "", item.label);
        link.href = item.href;
        return link;
      })
    );
  }

  const resumeLink = qs("[data-resume-link]");
  if (resumeLink && profile.resumeUrl) {
    resumeLink.hidden = false;
    resumeLink.href = profile.resumeUrl;
    resumeLink.textContent = profile.resumeLabel || "";
  }
};

const renderHero = ({ hero = {} }) => {
  setText("[data-hero-eyebrow]", hero.eyebrow);
  setText("[data-hero-summary]", hero.summary);

  const title = qs("[data-hero-title]");
  if (title) {
    title.replaceChildren();
    (hero.headlineParts || []).forEach((part, index, parts) => {
      const node = createElement(part.accent ? "span" : "span", part.accent ? "gradient-text" : "", part.text);
      title.append(node);
      if (index < parts.length - 1) {
        title.append(document.createElement("br"));
      }
    });
  }

  const actions = qs("[data-hero-actions]");
  if (actions) {
    actions.replaceChildren(...(hero.actions || []).map(createLink));
  }

  const signals = qs("[data-hero-signals]");
  if (signals) {
    signals.replaceChildren(
      ...(hero.signals || []).map((signal) => createElement("span", "signal", signal))
    );
  }

  const panel = hero.panel || {};
  setText("[data-hero-panel-eyebrow]", panel.eyebrow);
  setText("[data-hero-panel-title]", panel.title);
  setText("[data-hero-panel-summary]", panel.summary);

  const panelItems = qs("[data-hero-panel-items]");
  if (panelItems) {
    panelItems.replaceChildren(
      ...(panel.items || []).map((item) => {
        const row = createElement("div", "brief-item");
        row.append(createElement("small", "", item.label));
        row.append(createElement("strong", "", item.value));
        return row;
      })
    );
  }
};

const renderStats = (stats = []) => {
  const grid = qs("[data-stats]");
  if (!grid) {
    return;
  }

  grid.replaceChildren(
    ...stats.map((stat) => {
      const card = createElement("article", "metric-card");
      card.append(createElement("strong", "", stat.value));
      card.append(createElement("span", "", stat.label));
      return card;
    })
  );
};

const renderSectionHeading = (key, section = {}) => {
  setText(`[data-${key}-eyebrow]`, section.eyebrow);
  setText(`[data-${key}-title]`, section.title);
  setText(`[data-${key}-summary]`, section.summary);
};

const renderProjects = (projects = []) => {
  const grid = qs("[data-projects]");
  if (!grid) {
    return;
  }

  grid.replaceChildren(
    ...projects.map((project) => {
      const card = createElement("article", "project-card");
      const icon = createIcon(project.icon);
      icon.classList.add("project-icon");

      const header = createElement("div", "project-header");
      header.append(icon, createElement("h3", "", project.title));

      const description = createElement("p", "project-description", project.description);
      const metricList = createElement("div", "tag-row");
      metricList.replaceChildren(
        ...(project.metrics || []).map((metric) => createElement("span", "tag", metric))
      );

      card.append(header, description, metricList);

      if (project.href) {
        const action = createLink({
          href: project.href,
          icon: project.icon,
          label: project.actionLabel,
          variant: "ghost",
          compact: true
        });
        card.append(createElement("div", "project-actions"));
        card.lastElementChild.append(action);
      }

      return card;
    })
  );
};

const renderSkills = (skills = []) => {
  const grid = qs("[data-skills]");
  if (!grid) {
    return;
  }

  grid.replaceChildren(
    ...skills.map((skill) => {
      const card = createElement("article", "skill-card");
      card.append(createElement("h3", "", skill.title));
      card.append(createElement("p", "", skill.summary));

      const tools = createElement("div", "tag-row");
      tools.replaceChildren(...(skill.tools || []).map((tool) => createElement("span", "tag", tool)));
      card.append(tools);

      return card;
    })
  );
};

const renderTimeline = (items = [], selector = "[data-experience]") => {
  const timeline = qs(selector);
  if (!timeline) {
    return;
  }

  timeline.replaceChildren(
    ...items.map((item) => {
      const row = createElement("article", "timeline-item");
      const marker = createElement("div", "timeline-marker");
      const content = createElement("div", "timeline-content");
      content.append(createElement("p", "timeline-label", item.label));
      content.append(createElement("h3", "", item.title));
      content.append(createElement("p", "timeline-meta", `${item.place} | ${item.period}`));
      content.append(createElement("p", "timeline-summary", item.summary));
      if (item.tools?.length) {
        const tools = createElement("div", "tag-row");
        tools.replaceChildren(...item.tools.map((tool) => createElement("span", "tag", tool)));
        content.append(tools);
      }
      row.append(marker, content);
      return row;
    })
  );
};

const renderContact = ({ contact = {}, sections = {}, site = {} }) => {
  renderSectionHeading("contact", sections.contact);

  const channels = qs("[data-contact-channels]");
  if (channels) {
    channels.replaceChildren(
      ...(contact.channels || []).map((channel) => {
        const tag = channel.href ? "a" : "div";
        const item = createElement(tag, "contact-item");
        if (channel.href) {
          item.href = channel.href;
        }
        item.append(createIcon(channel.icon));

        const content = createElement("span", "contact-copy");
        content.append(createElement("small", "", channel.label));
        content.append(createElement("strong", "", channel.value));
        item.append(content);
        return item;
      })
    );
  }

  const socials = qs("[data-social-links]");
  if (socials) {
    socials.replaceChildren(
      ...(contact.socials || []).map((social) => {
        const link = createLink({
          href: social.href,
          icon: social.icon,
          label: social.value || social.label,
          variant: "ghost",
          compact: true
        });
        link.setAttribute("aria-label", social.label);
        return link;
      })
    );
  }

  setText("[data-copyright]", `\u00a9 ${new Date().getFullYear()} ${site.copyrightName || ""}`);
};

const setupReveal = () => {
  const revealTargets = qsa("[data-reveal]");
  revealTargets.forEach((element) => element.classList.add("reveal"));

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((element) => observer.observe(element));
};

const setupActiveNavigation = () => {
  const navLinks = qsa(".nav a[href^='#']");
  const sections = navLinks
    .map((link) => qs(link.getAttribute("href")))
    .filter(Boolean);

  const setActiveNav = () => {
    let currentId = "";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  };

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();
};

const renderPortfolio = (data) => {
  applyMeta(data);
  bindThemeToggle(data);
  renderNavigation(data);
  renderHero(data);
  renderStats(data.stats);
  renderSectionHeading("work", data.sections?.work);
  renderProjects(data.projects);
  renderSectionHeading("skills", data.sections?.skills);
  renderSkills(data.skills);
  renderSectionHeading("experience", data.sections?.experience);
  renderTimeline(data.experience, "[data-experience]");
  renderSectionHeading("education", data.sections?.education);
  renderTimeline(data.education, "[data-education]");
  renderContact(data);
  setupReveal();
  setupActiveNavigation();
  document.body.classList.add("is-loaded");
};

const renderDataError = () => {
  const main = qs("main");
  if (!main) {
    return;
  }

  const section = createElement("section", "error-state shell");
  section.append(createElement("h1", "", "Portfolio data was not loaded"));
  section.append(createElement("p", "", "Serve this folder with a local web server so the JSON data file can be loaded."));
  main.replaceChildren(section);
};

loadPortfolioData()
  .then(renderPortfolio)
  .catch(renderDataError);
