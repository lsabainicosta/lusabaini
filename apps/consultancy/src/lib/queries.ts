import { cachedSanityFetch } from "./sanity";

export type NavLink = { href: string; label: string };
export type Cta = { label?: string; href?: string };

export type ThemeSettings = {
  brandColor: string;
} | null;

export type ShellContent = {
  siteSettings: {
    mainNavigation: NavLink[];
    ctaButton: Cta | null;
    brandColor: string;
  };
  footer: {
    brandLabel?: string;
    headlineStart?: string;
    headlineEmphasis?: string;
    headlineEnd?: string;
    description?: string;
  } | null;
};

export type ServiceItem = {
  title: string;
  description: string;
  icon?: string;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type Testimonial = {
  name: string;
  role?: string;
  quote: string;
};

export type SanityImage = {
  url: string;
  alt?: string;
} | null;

export type Stat = {
  value: string;
  label: string;
};

export type StoryBlock = {
  title: string;
  body: string;
};

export type Milestone = {
  period: string;
  title: string;
  description?: string;
};

export type HomeContent = {
  hero: {
    seoTitle?: string;
    seoDescription?: string;
    badgeLabel?: string;
    headlineStart?: string;
    headlineEmphasis?: string;
    headlineEnd?: string;
    description?: string;
    heroImage?: SanityImage;
    primaryCta?: Cta;
    secondaryCta?: Cta;
  } | null;
  services: {
    headline?: string;
    intro?: string;
    services?: ServiceItem[];
  } | null;
  process: {
    headline?: string;
    intro?: string;
    steps?: ProcessStep[];
  } | null;
  about: {
    badgeLabel?: string;
    headlineStart?: string;
    headlineEmphasis?: string;
    headlineEnd?: string;
    teaser?: string;
  } | null;
  faq: {
    headline?: string;
    items?: FaqItem[];
  } | null;
  testimonials: Testimonial[];
};

const REVALIDATE = 12 * 60 * 60;

const themeQuery = `
*[_type == "brandingSection" && _id == "brandingSection"][0]{
  "brandColor": coalesce(brandColorHex, "#f9f3eb"),
}
`;

export async function getThemeSettings(): Promise<ThemeSettings> {
  return cachedSanityFetch(themeQuery, {
    tags: ["theme-settings"],
    revalidate: REVALIDATE,
  });
}

const shellQuery = `
{
  "siteSettings": {
    "mainNavigation": *[_type == "navigationSection" && _id == "navigationSection"][0].mainNavigation[]{
      label,
      href
    },
    "ctaButton": *[_type == "navigationSection" && _id == "navigationSection"][0].ctaButton{
      label,
      href
    },
    "brandColor": coalesce(*[_type == "brandingSection" && _id == "brandingSection"][0].brandColorHex, "#f9f3eb")
  },
  "footer": *[_type == "footerSection" && _id == "footerSection"][0]{
    brandLabel,
    headlineStart,
    headlineEmphasis,
    headlineEnd,
    description
  }
}
`;

export async function getShellContent(): Promise<ShellContent> {
  const data = await cachedSanityFetch<ShellContent>(shellQuery, {
    tags: ["shell-content"],
    revalidate: REVALIDATE,
  });

  return {
    siteSettings: {
      mainNavigation: data?.siteSettings?.mainNavigation ?? [],
      ctaButton: data?.siteSettings?.ctaButton ?? null,
      brandColor: data?.siteSettings?.brandColor ?? "#f9f3eb",
    },
    footer: data?.footer ?? null,
  };
}

const homeQuery = `
{
  "hero": *[_type == "heroSection" && _id == "heroSection"][0]{
    seoTitle,
    seoDescription,
    badgeLabel,
    headlineStart,
    headlineEmphasis,
    headlineEnd,
    description,
    "heroImage": select(
      defined(heroImage.asset) => {
        "url": heroImage.asset->url,
        "alt": heroImage.alt
      },
      null
    ),
    primaryCta{label, href},
    secondaryCta{label, href}
  },
  "services": *[_type == "servicesSection" && _id == "servicesSection"][0]{
    headline,
    intro,
    services[]{title, description, icon}
  },
  "process": *[_type == "processSection" && _id == "processSection"][0]{
    headline,
    intro,
    steps[]{title, description}
  },
  "about": *[_type == "aboutSection" && _id == "aboutSection"][0]{
    badgeLabel,
    headlineStart,
    headlineEmphasis,
    headlineEnd,
    teaser
  },
  "faq": *[_type == "faqSection" && _id == "faqSection"][0]{
    headline,
    items[]{question, answer}
  },
  "testimonials": *[_type == "testimonial"] | order(order asc)[0...6]{
    name,
    role,
    quote
  }
}
`;

export async function getHomeContent(): Promise<HomeContent> {
  const data = await cachedSanityFetch<HomeContent>(homeQuery, {
    tags: ["home-sections"],
    revalidate: REVALIDATE,
  });

  return {
    hero: data?.hero ?? null,
    services: data?.services ?? null,
    process: data?.process ?? null,
    about: data?.about ?? null,
    faq: data?.faq ?? null,
    testimonials: data?.testimonials ?? [],
  };
}

const servicesPageQuery = `
*[_type == "servicesSection" && _id == "servicesSection"][0]{
  seoTitle,
  seoDescription,
  headline,
  intro,
  services[]{title, description, icon}
}
`;

export async function getServicesPageContent() {
  return cachedSanityFetch<{
    seoTitle?: string;
    seoDescription?: string;
    headline?: string;
    intro?: string;
    services?: ServiceItem[];
  } | null>(servicesPageQuery, {
    tags: ["services-page"],
    revalidate: REVALIDATE,
  });
}

const aboutPageQuery = `
*[_type == "aboutSection" && _id == "aboutSection"][0]{
  seoTitle,
  seoDescription,
  badgeLabel,
  headlineStart,
  headlineEmphasis,
  headlineEnd,
  intro,
  "profileImage": select(
    defined(profileImage.asset) => {
      "url": profileImage.asset->url,
      "alt": profileImage.alt
    },
    null
  ),
  stats[]{value, label},
  storySections[]{title, body},
  journey[]{period, title, description},
  teaser
}
`;

export type AboutPageContent = {
  seoTitle?: string;
  seoDescription?: string;
  badgeLabel?: string;
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  intro?: string;
  profileImage?: SanityImage;
  stats?: Stat[];
  storySections?: StoryBlock[];
  journey?: Milestone[];
  teaser?: string;
} | null;

export async function getAboutPageContent() {
  return cachedSanityFetch<AboutPageContent>(aboutPageQuery, {
    tags: ["about-page"],
    revalidate: REVALIDATE,
  });
}

const contactPageQuery = `
*[_type == "contactPage" && _id == "contactPage"][0]{
  seoTitle,
  seoDescription,
  headline,
  intro,
  supportingText
}
`;

export async function getContactPageContent() {
  return cachedSanityFetch<{
    seoTitle?: string;
    seoDescription?: string;
    headline?: string;
    intro?: string;
    supportingText?: string;
  } | null>(contactPageQuery, {
    tags: ["contact-page"],
    revalidate: REVALIDATE,
  });
}

export type Guide = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: SanityImage;
  price: number;
};

const guidesQuery = `
*[_type == "tourGuide" && available != false && defined(price)] | order(order asc){
  _id,
  title,
  "slug": slug.current,
  description,
  "coverImage": select(
    defined(coverImage.asset) => {
      "url": coverImage.asset->url,
      "alt": coverImage.alt
    },
    null
  ),
  price
}
`;

export async function getGuides(): Promise<Guide[]> {
  const data = await cachedSanityFetch<Guide[]>(guidesQuery, {
    tags: ["guides"],
    revalidate: REVALIDATE,
  });
  return data ?? [];
}

export function formatEuro(amount: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
