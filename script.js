const DEFAULT_DATA_SOURCE = "portfolio-data.json";
const DATA_SOURCE = document.body?.dataset.source || DEFAULT_DATA_SOURCE;
const FETCH_TIMEOUT_MS = 8000;
const MAX_FETCH_ATTEMPTS = 2;
const LINK_VARIANTS = new Set(["primary", "secondary", "ghost"]);

const ICONS = {
  brain: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 3a4 4 0 0 0-4 4v.1A4.5 4.5 0 0 0 2 11.4 4.6 4.6 0 0 0 5.3 16 4.2 4.2 0 0 0 9.4 21H10V3H9Zm5 0v18h.6a4.2 4.2 0 0 0 4.1-5A4.6 4.6 0 0 0 22 11.4a4.5 4.5 0 0 0-3-4.3V7a4 4 0 0 0-4-4h-1Z"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.3 18H8a5 5 0 0 1-.8-9.9A7 7 0 0 1 20.7 11 3.6 3.6 0 0 1 19.3 18ZM8 16h11.3a1.6 1.6 0 0 0 .4-3.1l-1.1-.3v-1.1A5 5 0 0 0 9 9.5l-.4.8-.9-.2A3 3 0 0 0 8 16Z"/></svg>',
  code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m8.7 16.6-5-5 5-5 1.4 1.4-3.6 3.6 3.6 3.6-1.4 1.4Zm6.6 0-1.4-1.4 3.6-3.6-3.6-3.6 1.4-1.4 5 5-5 5Zm-3.9 1.2-1.9-.6 3.1-10.4 1.9.6-3.1 10.4Z"/></svg>',
  database: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3c-4.4 0-8 1.4-8 3.2v11.6C4 19.6 7.6 21 12 21s8-1.4 8-3.2V6.2C20 4.4 16.4 3 12 3Zm0 2c3.6 0 5.6.9 6 1.3-.4.4-2.4 1.3-6 1.3s-5.6-.9-6-1.3C6.4 5.9 8.4 5 12 5Zm6 7.4c-.9.7-3.2 1.3-6 1.3s-5.1-.6-6-1.3V9c1.5.7 3.6 1 6 1s4.5-.3 6-1v3.4Zm-6 6.6c-3.6 0-5.6-.9-6-1.3v-3c1.5.7 3.6 1 6 1s4.5-.3 6-1v3c-.4.4-2.4 1.3-6 1.3Z"/></svg>',
  eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 5c5.3 0 9 5.3 9 7s-3.7 7-9 7-9-5.3-9-7 3.7-7 9-7Zm0 2c-4 0-6.7 3.7-7 5 .3 1.3 3 5 7 5s6.7-3.7 7-5c-.3-1.3-3-5-7-5Zm0 2.2A2.8 2.8 0 1 1 12 14.8 2.8 2.8 0 0 1 12 9.2Z"/></svg>',
  external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3ZM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.3 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM9.5 10H6.8v8h2.7v-8Zm.2-2.5a1.6 1.6 0 1 0-3.2 0 1.6 1.6 0 0 0 3.2 0Zm8.3 5.7c0-2.3-1.2-3.4-2.8-3.4-1.3 0-1.9.7-2.2 1.2v-1h-2.7v8H13v-4c0-1.1.2-2.1 1.5-2.1s1.3 1.2 1.3 2.2V18H18v-4.8Z"/></svg>',
  location: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.2-8 5-8-5V6l8 5 8-5v2.2Z"/></svg>',
  network: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 3h4v4h-4V3Zm-7 14h4v4H3v-4Zm14 0h4v4h-4v-4ZM5 9h14v2h-6v3h-2v-3H5V9Zm-1 5h2v2H4v-2Zm14 0h2v2h-2v-2Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.4a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.2 1l-2.2 2.2Z"/></svg>',
  server: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 9h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2Zm13-6v1.8h2V7h-2Zm0 9v1.8h2V16h-2Z"/></svg>'
};

const FAVICON_PATHS = {
  network: [
    '<path d="M32 18v18M14 38h36M14 38v9M50 38v9M32 36v11"/>',
    '<rect x="23" y="8" width="18" height="12" rx="3"/>',
    '<rect x="5" y="45" width="18" height="12" rx="3"/>',
    '<rect x="23" y="45" width="18" height="12" rx="3"/>',
    '<rect x="41" y="45" width="18" height="12" rx="3"/>'
  ].join("")
};

const CSS_VAR_MAP = {
  accent: "--accent",
  bg: "--bg",
  bgSoft: "--bg-soft",
  brand: "--brand",
  brand2: "--brand-2",
  heroAccent: "--hero-accent",
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
const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const asRecord = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : {});
const asArray = (value) => (Array.isArray(value) ? value : []);
const asText = (value) => (value === null || value === undefined ? "" : String(value).trim());
const asTextArray = (value) => asArray(value).map(asText).filter(Boolean);
const normalizeLinkVariant = (value) => {
  const variant = asText(value);
  return LINK_VARIANTS.has(variant) ? variant : "secondary";
};

const normalizeHref = (href = "") => {
  const value = asText(href);
  if (!value) {
    return "";
  }

  if (value.startsWith("#")) {
    return /^#[A-Za-z][\w-]*$/.test(value) ? value : "";
  }

  try {
    const url = new URL(value, window.location.href);
    const allowedProtocols = ["http:", "https:", "mailto:", "tel:"];
    if (!allowedProtocols.includes(url.protocol)) {
      return "";
    }

    if (url.origin === window.location.origin) {
      return `${url.pathname}${url.search}${url.hash}`;
    }

    return url.href;
  } catch {
    return "";
  }
};

const isExternalHref = (href = "") => {
  try {
    const url = new URL(href, window.location.href);
    return ["http:", "https:"].includes(url.protocol) && url.origin !== window.location.origin;
  } catch {
    return false;
  }
};

const normalizeTextBlock = (value = {}) => {
  const block = asRecord(value);
  return {
    eyebrow: asText(block.eyebrow),
    summary: asText(block.summary),
    title: asText(block.title)
  };
};

const normalizeTimelineItem = (value = {}) => {
  const item = asRecord(value);
  return {
    label: asText(item.label),
    period: asText(item.period),
    place: asText(item.place),
    summary: asText(item.summary),
    title: asText(item.title),
    tools: asTextArray(item.tools)
  };
};

const normalizePortfolioData = (value = {}) => {
  const data = asRecord(value);
  const site = asRecord(data.site);
  const profile = asRecord(data.profile);
  const hero = asRecord(data.hero);
  const heroPanel = asRecord(hero.panel);
  const sections = asRecord(data.sections);
  const contact = asRecord(data.contact);
  const themes = asRecord(data.themes);
  const darkTheme = asRecord(themes.dark);

  return {
    site: {
      copyrightName: asText(site.copyrightName),
      description: asText(site.description),
      faviconIcon: asText(site.faviconIcon),
      faviconInitial: asText(site.faviconInitial),
      themeColor: asText(site.themeColor),
      title: asText(site.title)
    },
    profile: {
      email: asText(profile.email),
      fullName: asText(profile.fullName),
      location: asText(profile.location),
      phoneDisplay: asText(profile.phoneDisplay),
      phoneHref: normalizeHref(profile.phoneHref),
      resumeLabel: asText(profile.resumeLabel),
      resumeUrl: normalizeHref(profile.resumeUrl),
      role: asText(profile.role),
      shortName: asText(profile.shortName)
    },
    navigation: asArray(data.navigation)
      .map((item) => {
        const navItem = asRecord(item);
        return {
          href: normalizeHref(navItem.href),
          label: asText(navItem.label)
        };
      })
      .filter((item) => item.href && item.label),
    hero: {
      actions: asArray(hero.actions)
        .map((action) => {
          const item = asRecord(action);
          return {
            href: normalizeHref(item.href),
            icon: asText(item.icon),
            label: asText(item.label),
            variant: normalizeLinkVariant(item.variant)
          };
        })
        .filter((action) => action.href && action.label),
      eyebrow: asText(hero.eyebrow),
      headlineParts: asArray(hero.headlineParts)
        .map((part) => {
          const item = asRecord(part);
          return {
            accent: Boolean(item.accent),
            text: asText(item.text)
          };
        })
        .filter((part) => part.text),
      panel: {
        eyebrow: asText(heroPanel.eyebrow),
        items: asArray(heroPanel.items)
          .map((item) => {
            const panelItem = asRecord(item);
            return {
              label: asText(panelItem.label),
              value: asText(panelItem.value)
            };
          })
          .filter((item) => item.label || item.value),
        summary: asText(heroPanel.summary),
        title: asText(heroPanel.title)
      },
      signals: asTextArray(hero.signals),
      summary: asText(hero.summary)
    },
    stats: asArray(data.stats)
      .map((stat) => {
        const item = asRecord(stat);
        return {
          label: asText(item.label),
          value: asText(item.value)
        };
      })
      .filter((stat) => stat.label || stat.value),
    sections: {
      contact: normalizeTextBlock(sections.contact),
      education: normalizeTextBlock(sections.education),
      experience: normalizeTextBlock(sections.experience),
      skills: normalizeTextBlock(sections.skills),
      work: normalizeTextBlock(sections.work)
    },
    skills: asArray(data.skills)
      .map((skill) => {
        const item = asRecord(skill);
        return {
          icon: asText(item.icon),
          summary: asText(item.summary),
          title: asText(item.title),
          tools: asTextArray(item.tools)
        };
      })
      .filter((skill) => skill.title || skill.summary),
    projects: asArray(data.projects)
      .map((project) => {
        const item = asRecord(project);
        return {
          actionLabel: asText(item.actionLabel),
          categories: asTextArray(item.categories),
          description: asText(item.description),
          href: normalizeHref(item.href),
          icon: asText(item.icon),
          metrics: asTextArray(item.metrics),
          title: asText(item.title)
        };
      })
      .filter((project) => project.title || project.description),
    experience: asArray(data.experience).map(normalizeTimelineItem).filter((item) => item.title || item.place),
    education: asArray(data.education).map(normalizeTimelineItem).filter((item) => item.title || item.place),
    contact: {
      channels: asArray(contact.channels)
        .map((channel) => {
          const item = asRecord(channel);
          return {
            href: normalizeHref(item.href),
            icon: asText(item.icon),
            label: asText(item.label),
            value: asText(item.value)
          };
        })
        .filter((channel) => channel.label || channel.value),
      socials: asArray(contact.socials)
        .map((social) => {
          const item = asRecord(social);
          return {
            href: normalizeHref(item.href),
            icon: asText(item.icon),
            label: asText(item.label),
            value: asText(item.value)
          };
        })
        .filter((social) => social.href && (social.label || social.value))
    },
    themes: {
      dark: Object.fromEntries(
        Object.keys(CSS_VAR_MAP)
          .map((key) => [key, asText(darkTheme[key])])
          .filter(([, themeValue]) => themeValue)
      )
    }
  };
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

const createLink = ({ href, label, icon, variant = "secondary", compact = false }) => {
  const safeVariant = normalizeLinkVariant(variant);
  const link = createElement("a", `btn btn-${safeVariant}${compact ? " btn-compact" : ""}`);
  const safeHref = normalizeHref(href);
  if (!safeHref) {
    link.href = "#";
    link.tabIndex = -1;
    link.setAttribute("aria-disabled", "true");
  } else {
    link.href = safeHref;
  }
  if (isExternalHref(safeHref)) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  if (icon) {
    link.append(createIcon(icon));
  }
  link.append(createElement("span", "", label));
  return link;
};

const loadPortfolioData = async () => {
  let lastError;

  for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt += 1) {
    const controller = "AbortController" in window ? new AbortController() : null;
    const timeout = controller
      ? window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
      : null;

    try {
      const response = await fetch(DATA_SOURCE, {
        cache: "no-store",
        signal: controller?.signal
      });
      if (!response.ok) {
        throw new Error(`Unable to load ${DATA_SOURCE}: ${response.status}`);
      }
      return normalizePortfolioData(await response.json());
    } catch (error) {
      lastError = error;
      if (attempt < MAX_FETCH_ATTEMPTS) {
        await wait(250 * attempt);
      }
    } finally {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    }
  }

  throw lastError || new Error(`Unable to load ${DATA_SOURCE}`);
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

const setFavicon = (site = {}, theme = {}) => {
  const favicon = qs("#site-favicon");
  if (!favicon) {
    return;
  }

  const iconPath = FAVICON_PATHS[site.faviconIcon] || FAVICON_PATHS.network;
  const fallbackInitial = asText(site.faviconInitial).slice(0, 1);
  const foreground = theme.brand || "#2997ff";
  const background = theme.bg || "#000000";
  const symbol = iconPath
    ? `<g fill="none" stroke="${foreground}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${iconPath}</g>`
    : `<text x="50%" y="56%" font-size="30" font-weight="800" text-anchor="middle" fill="${foreground}" font-family="Arial, sans-serif">${fallbackInitial || "V"}</text>`;

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">',
    `<rect width="64" height="64" rx="14" fill="${background}"/>`,
    symbol,
    "</svg>"
  ].join("");

  favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const applyTheme = (data) => {
  const themes = data.themes || {};
  const theme = themes.dark || {};
  const root = document.documentElement;

  Object.entries(CSS_VAR_MAP).forEach(([key, variable]) => {
    if (theme[key]) {
      root.style.setProperty(variable, theme[key]);
    }
  });

  document.body.dataset.theme = "dark";

  const meta = qs("meta[name='theme-color']");
  if (meta) {
    meta.setAttribute("content", theme.bg || data.site?.themeColor || "#10130f");
  }

  setFavicon(data.site, theme);
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
      const value = createElement("strong", "stat-value", stat.value);
      value.dataset.finalValue = stat.value;
      card.append(value);
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
      card.dataset.projectCard = "";
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
      if (skill.icon) {
        const icon = createIcon(skill.icon);
        icon.classList.add("skill-icon");
        card.append(icon);
      }
      card.append(createElement("h3", "", skill.title));
      card.append(createElement("p", "", skill.summary));

      const tools = createElement("div", "tag-row");
      tools.replaceChildren(...(skill.tools || []).map((tool) => createElement("span", "tag", tool)));
      card.append(tools);

      return card;
    })
  );
};

const renderTimeline = (items = [], selector = "[data-experience]", options = {}) => {
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
      if (options.companyFirst) {
        content.append(createElement("h3", "", item.place));
        content.append(createElement("p", "timeline-role", item.title));
        content.append(createElement("p", "timeline-meta", item.period));
      } else {
        content.append(createElement("h3", "", item.title));
        content.append(createElement("p", "timeline-meta", `${item.place} | ${item.period}`));
      }
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

const parseStatValue = (value = "") => {
  const match = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return null;
  }

  return {
    decimals: match[1].includes(".") ? match[1].split(".")[1].length : 0,
    number: Number(match[1]),
    suffix: match[2] || ""
  };
};

const formatStatValue = (value, suffix, decimals = 0) => {
  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
  return `${formatted}${suffix}`;
};

const animateStat = (element) => {
  const finalValue = element.dataset.finalValue || element.textContent || "";
  const parsed = parseStatValue(finalValue);

  if (!parsed || prefersReducedMotion) {
    element.textContent = finalValue;
    return;
  }

  const duration = 880;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = parsed.number * eased;
    element.textContent = formatStatValue(current, parsed.suffix, parsed.decimals);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
      return;
    }

    element.textContent = finalValue;
  };

  element.textContent = formatStatValue(0, parsed.suffix, parsed.decimals);
  window.requestAnimationFrame(tick);
};

const setupAnimatedStats = () => {
  const statValues = qsa(".stat-value");
  if (!statValues.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    statValues.forEach(animateStat);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  statValues.forEach((element) => observer.observe(element));
};

const setupInteractiveCards = () => {
  if (!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  const selector = ".project-card, .skill-card, .timeline-content, .contact-panel, .metric-card";
  document.addEventListener("pointermove", (event) => {
    const card = event.target instanceof Element ? event.target.closest(selector) : null;
    if (!card) {
      return;
    }

    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
};

const setupTopbarState = () => {
  const topbar = qs(".topbar");
  if (!topbar) {
    return;
  }

  const updateTopbar = () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  window.addEventListener("scroll", updateTopbar, { passive: true });
  updateTopbar();
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
  applyTheme(data);
  renderNavigation(data);
  renderHero(data);
  renderStats(data.stats);
  renderSectionHeading("work", data.sections?.work);
  renderProjects(data.projects);
  renderSectionHeading("skills", data.sections?.skills);
  renderSkills(data.skills);
  renderSectionHeading("experience", data.sections?.experience);
  renderTimeline(data.experience, "[data-experience]", { companyFirst: true });
  renderSectionHeading("education", data.sections?.education);
  renderTimeline(data.education, "[data-education]");
  renderContact(data);
  setupReveal();
  setupAnimatedStats();
  setupInteractiveCards();
  setupTopbarState();
  setupActiveNavigation();
  document.body.classList.add("is-loaded");
};

const renderDataError = (error) => {
  console.error("Portfolio data load failed", error);
  const main = qs("main");
  if (!main) {
    return;
  }

  const section = createElement("section", "error-state shell");
  section.append(createElement("h1", "", "Portfolio data was not loaded"));
  section.append(createElement("p", "", "Refresh the page to retry loading the portfolio data."));
  const actions = createElement("div", "error-actions");
  const retry = createElement("button", "btn btn-primary", "Retry");
  retry.type = "button";
  retry.addEventListener("click", () => window.location.reload());
  actions.append(retry);
  section.append(actions);
  main.replaceChildren(section);
};

loadPortfolioData()
  .then(renderPortfolio)
  .catch(renderDataError);
