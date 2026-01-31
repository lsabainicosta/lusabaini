import { cachedSanityFetch } from "./sanity";
import { createSlug } from "./utils";

type ProfileImage = {
  url: string;
  alt?: string;
};

type MediaFile = {
  url: string;
  _key?: string;
};

export type NavLink = {
  label: string;
  href: string;
  _key?: string;
};

export type CtaLink = {
  label?: string;
  href?: string;
};

export type HeaderSettings = {
  navLinks?: NavLink[];
  cta?: CtaLink;
};

export type StoryUserInfo = {
  username?: string;
  timeAgo?: string;
  profileImage?: ProfileImage;
};

export type HeroSectionContent = {
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  description?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  carouselVideos?: HeroCarouselVideo[];
  storyUserInfo?: StoryUserInfo;
};

export type HeroCarouselVideo = {
  title?: string;
  url?: string;
  _key?: string;
};

export type BrandLogoItem = {
  name?: string;
  image?: ProfileImage;
  href?: string;
  _key?: string;
};

export type BrandLogosSectionContent = {
  introText?: string;
  logos?: BrandLogoItem[];
};

export type ServiceItem = {
  title: string;
  description?: string;
  _key?: string;
};

export type ServicesSectionContent = {
  badgeLabel?: string;
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  items?: ServiceItem[];
};

export type SocialLink = {
  icon: "instagram" | "tiktok" | "youtube" | "x" | "linkedin" | "facebook" | "email";
  href: string;
  label?: string;
  emailSubject?: string;
  emailBody?: string;
  _key?: string;
};

export type FooterLink = {
  label: string;
  href: string;
  _key?: string;
};

export type FooterSettings = {
  brandLabel?: string;
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  description?: string;
  legalLinks?: FooterLink[];
};

export type SiteSettings = {
  mainNavigation?: NavLink[];
  ctaButton?: CtaLink;
  socials?: SocialLink[];
  brandColor?: string;
};

const shellQuery = `
{
  "siteSettings": {
    "mainNavigation": *[_type == "navigationSection" && _id == "navigationSection"][0].mainNavigation[]{
      "label": coalesce(label, ""),
      "href": coalesce(href, ""),
      _key
    },
    "ctaButton": {
      "label": coalesce(*[_type == "navigationSection" && _id == "navigationSection"][0].ctaButton.label, ""),
      "href": coalesce(*[_type == "navigationSection" && _id == "navigationSection"][0].ctaButton.href, "")
    },
    "socials": *[_type == "socialMediaSection" && _id == "socialMediaSection"][0].socials[]{
      icon,
      "href": coalesce(href, ""),
      "label": coalesce(label, ""),
      "emailSubject": coalesce(emailSubject, ""),
      "emailBody": coalesce(emailBody, ""),
      _key
    },
    "brandColor": coalesce(*[_type == "brandingSection" && _id == "brandingSection"][0].brandColor.hex, "#f9f3eb")
  },
  "footer": *[_type == "footerSection" && _id == "footerSection"][0]{
    "brandLabel": coalesce(brandLabel, ""),
    "headlineStart": coalesce(headlineStart, ""),
    "headlineEmphasis": coalesce(headlineEmphasis, ""),
    "headlineEnd": coalesce(headlineEnd, ""),
    "description": coalesce(description, ""),
    "legalLinks": legalLinks[]{
      "label": coalesce(label, ""),
      "href": coalesce(href, ""),
      _key
    }
  }
}
`;

export type ClientResultStat = {
  value: string;
  label: string;
  subLabel?: string;
  _key?: string;
};

export type ClientResult = {
  _id: string;
  badgeLabel?: string;
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  description?: string;
  clientName?: string;
  category?: string;
  image?: ProfileImage;
  video?: MediaFile;
  imageOverlayText?: string;
  stats?: ClientResultStat[];
  socials?: SocialLink[];
  additionalVideos?: MediaFile[];
};

export type ThemeSettings = {
  brandColor?: string;
};

const clientResultFields = `{
  _id,
  "badgeLabel": coalesce(badgeLabel, "Client results"),
  "headlineStart": coalesce(headlineStart, ""),
  "headlineEmphasis": coalesce(headlineEmphasis, ""),
  "headlineEnd": coalesce(headlineEnd, ""),
  "description": coalesce(description, ""),
  "clientName": coalesce(clientName, ""),
  "category": coalesce(category, ""),
  "image": {
    "url": coalesce(image.asset->url, ""),
    "alt": coalesce(image.alt, clientName, "")
  },
  "video": {
    "url": coalesce(video.asset->url, "")
  },
  "imageOverlayText": coalesce(imageOverlayText, clientName, ""),
  "stats": stats[]{
    "value": coalesce(value, ""),
    "label": coalesce(label, ""),
    "subLabel": coalesce(subLabel, ""),
    _key
  },
  "socials": socials[]{
    icon,
    "href": coalesce(href, ""),
    "label": coalesce(label, ""),
    "emailSubject": coalesce(emailSubject, ""),
    "emailBody": coalesce(emailBody, ""),
    _key
  },
  "additionalVideos": additionalVideos[]{
    "url": coalesce(asset->url, ""),
    _key
  }
} `;

const clientResultsBase = `*[_type == "clientResult"] | order(_updatedAt desc)`;

const contentQuery = `
{
  "theme": *[_type == "brandingSection" && _id == "brandingSection"][0]{
    "brandColor": coalesce(brandColor.hex, "#f9f3eb"),
  },
  "header": *[_type == "headerSettings" && _id == "headerSettings"][0]{
    "navLinks": navLinks[]{
      "label": coalesce(label, ""),
      "href": coalesce(href, ""),
      _key
    },
    "cta": {
      "label": coalesce(cta.label, ""),
      "href": coalesce(cta.href, "")
    }
  },
  "hero": *[_type == "heroSection" && _id == "heroSection"][0]{
    "headlineStart": coalesce(headlineStart, ""),
    "headlineEmphasis": coalesce(headlineEmphasis, ""),
    "headlineEnd": coalesce(headlineEnd, ""),
    "description": coalesce(description, ""),
    "primaryCta": {
      "label": coalesce(primaryCta.label, ""),
      "href": coalesce(primaryCta.href, "")
    },
    "secondaryCta": {
      "label": coalesce(secondaryCta.label, ""),
      "href": coalesce(secondaryCta.href, "")
    },
    "carouselVideos": carouselVideos[]{
      "title": coalesce(title, ""),
      "url": coalesce(video.asset->url, ""),
      _key
    },
    "storyUserInfo": storyUserInfo {
      "username": coalesce(username, ""),
      "timeAgo": coalesce(timeAgo, ""),
      "profileImage": profileImage {
        "url": coalesce(asset->url, ""),
        "alt": coalesce(alt, username, "")
      }
    }
  },
  "brandLogos": *[_type == "brandLogosSection" && _id == "brandLogosSection"][0]{
    "introText": coalesce(introText, ""),
    "logos": logos[]{
      "name": coalesce(name, ""),
      "href": coalesce(href, ""),
      "image": {
        "url": coalesce(image.asset->url, ""),
        "alt": coalesce(image.alt, name, "")
      },
      _key
    }
  },
  "servicesSection": *[_type == "servicesSection" && _id == "servicesSection"][0]{
    "badgeLabel": coalesce(badgeLabel, "Services"),
    "headlineStart": coalesce(headlineStart, ""),
    "headlineEmphasis": coalesce(headlineEmphasis, ""),
    "headlineEnd": coalesce(headlineEnd, ""),
    "items": items[]{
      "title": coalesce(title, ""),
      "description": coalesce(description, ""),
      _key
    }
  },
  "footer": *[_type == "footerSection" && _id == "footerSection"][0]{
    "brandLabel": coalesce(brandLabel, ""),
    "headlineStart": coalesce(headlineStart, ""),
    "headlineEmphasis": coalesce(headlineEmphasis, ""),
    "headlineEnd": coalesce(headlineEnd, ""),
    "description": coalesce(description, ""),
    "legalLinks": legalLinks[]{
      "label": coalesce(label, ""),
      "href": coalesce(href, ""),
      _key
    }
  },
  "clientResults": ${clientResultsBase}[0...3]${clientResultFields}
}
`;

export async function getHomepageContent(): Promise<{
  theme?: ThemeSettings;
  header?: HeaderSettings;
  hero?: HeroSectionContent;
  brandLogos?: BrandLogosSectionContent;
  servicesSection?: ServicesSectionContent;
  footer?: FooterSettings;
  clientResults?: ClientResult[];
}> {
  return cachedSanityFetch(contentQuery, {
    tags: ["homepage-content"],
    revalidate: 12 * 60 * 60,
  });
}

export async function getShellContent(): Promise<{
  siteSettings?: SiteSettings;
  footer?: FooterSettings;
}> {
  return cachedSanityFetch(shellQuery, {
    tags: ["shell-content"],
    revalidate: 12 * 60 * 60,
  });
}

const homeSectionsQuery = `
{
  "hero": *[_type == "heroSection" && _id == "heroSection"][0]{
    "headlineStart": coalesce(headlineStart, ""),
    "headlineEmphasis": coalesce(headlineEmphasis, ""),
    "headlineEnd": coalesce(headlineEnd, ""),
    "description": coalesce(description, ""),
    "primaryCta": {
      "label": coalesce(primaryCta.label, ""),
      "href": coalesce(primaryCta.href, "")
    },
    "secondaryCta": {
      "label": coalesce(secondaryCta.label, ""),
      "href": coalesce(secondaryCta.href, "")
    },
    "carouselVideos": carouselVideos[]{
      "title": coalesce(title, ""),
      "url": coalesce(video.asset->url, ""),
      _key
    },
    "storyUserInfo": storyUserInfo {
      "username": coalesce(username, ""),
      "timeAgo": coalesce(timeAgo, ""),
      "profileImage": profileImage {
        "url": coalesce(asset->url, ""),
        "alt": coalesce(alt, username, "")
      }
    }
  },
  "brandLogos": *[_type == "brandLogosSection" && _id == "brandLogosSection"][0]{
    "introText": coalesce(introText, ""),
    "logos": logos[]{
      "name": coalesce(name, ""),
      "href": coalesce(href, ""),
      "image": {
        "url": coalesce(image.asset->url, ""),
        "alt": coalesce(image.alt, name, "")
      },
      _key
    }
  },
  "servicesSection": *[_type == "servicesSection" && _id == "servicesSection"][0]{
    "badgeLabel": coalesce(badgeLabel, "Services"),
    "headlineStart": coalesce(headlineStart, ""),
    "headlineEmphasis": coalesce(headlineEmphasis, ""),
    "headlineEnd": coalesce(headlineEnd, ""),
    "items": items[]{
      "title": coalesce(title, ""),
      "description": coalesce(description, ""),
      _key
    }
  },
  "clientResults": ${clientResultsBase}[0...3]${clientResultFields}
}
`;

export async function getHomeSectionsContent(): Promise<{
  hero?: HeroSectionContent;
  brandLogos?: BrandLogosSectionContent;
  servicesSection?: ServicesSectionContent;
  clientResults?: ClientResult[];
}> {
  return cachedSanityFetch(homeSectionsQuery, {
    tags: ["home-sections"],
    revalidate: 12 * 60 * 60,
  });
}

const themeQuery = `
*[_type == "brandingSection" && _id == "brandingSection"][0]{
  "brandColor": coalesce(brandColor.hex, "#ff7edb"),
}
`;

export async function getThemeSettings(): Promise<ThemeSettings> {
  return cachedSanityFetch(themeQuery, {
    tags: ["theme-settings"],
    revalidate: 12 * 60 * 60,
  });
}

export async function getClientResults(options?: {
  limit?: number;
}): Promise<ClientResult[]> {
  const limitSlice =
    typeof options?.limit === "number" ? `[0...${options.limit}]` : "";

  const query = `
${clientResultsBase}${limitSlice}${clientResultFields}
`;

  return cachedSanityFetch(query, {
    tags: ["client-results"],
    revalidate: 12 * 60 * 60,
  });
}

export async function getClientResultById(id: string): Promise<ClientResult | null> {
  // Sanitize id to prevent injection (it should only contain alphanumeric and hyphens)
  const sanitizedId = id.replace(/[^a-zA-Z0-9-]/g, '');
  const query = `
*[_type == "clientResult" && _id == "${sanitizedId}"][0]${clientResultFields}
`;

  return cachedSanityFetch(query, {
    tags: ["client-results"],
    revalidate: 12 * 60 * 60,
  });
}

export async function getClientResultBySlug(slug: string): Promise<ClientResult | null> {
  // Fetch all results and match by slug on the client side
  // This is simpler than trying to do complex string matching in GROQ
  const allResults = await getClientResults();
  
  return allResults.find((result) => {
    if (!result.clientName) return false;
    const resultSlug = createSlug(result.clientName);
    return resultSlug === slug.toLowerCase();
  }) || null;
}

// About Page Types
export type AboutValue = {
  title: string;
  description?: string;
  icon?:
    | "sparkles"
    | "target"
    | "heart"
    | "zap"
    | "star"
    | "users"
    | "lightbulb"
    | "rocket";
  _key?: string;
};

export type AboutJourneyItem = {
  year: string;
  title: string;
  description?: string;
  _key?: string;
};

export type AboutPageContent = {
  badgeLabel?: string;
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  heroDescription?: string;
  profileImage?: {
    url: string;
    alt?: string;
  };
  storyTitle?: string;
  storyContent?: string;
  storyImage?: {
    url: string;
    alt?: string;
  };
  philosophyTitle?: string;
  philosophyContent?: string;
  values?: AboutValue[];
  journeyTitle?: string;
  journeyItems?: AboutJourneyItem[];
  ctaHeadlineStart?: string;
  ctaHeadlineEmphasis?: string;
  ctaHeadlineEnd?: string;
  ctaDescription?: string;
  ctaButton?: CtaLink;
};

const aboutPageQuery = `
{
  "hero": *[_type == "aboutHeroSection" && _id == "aboutHeroSection"][0]{
    "badgeLabel": coalesce(badgeLabel, "About me"),
    "headlineStart": coalesce(headlineStart, ""),
    "headlineEmphasis": coalesce(headlineEmphasis, ""),
    "headlineEnd": coalesce(headlineEnd, ""),
    "heroDescription": coalesce(heroDescription, ""),
    "profileImage": {
      "url": coalesce(profileImage.asset->url, ""),
      "alt": coalesce(profileImage.alt, "Profile photo")
    }
  },
  "story": *[_type == "aboutStorySection" && _id == "aboutStorySection"][0]{
    "storyTitle": coalesce(storyTitle, ""),
    "storyContent": coalesce(storyContent, ""),
    "storyImage": {
      "url": coalesce(storyImage.asset->url, ""),
      "alt": coalesce(storyImage.alt, "Story image")
    }
  },
  "values": *[_type == "aboutValuesSection" && _id == "aboutValuesSection"][0]{
    "philosophyTitle": coalesce(philosophyTitle, ""),
    "philosophyContent": coalesce(philosophyContent, ""),
    "values": values[]{
      "title": coalesce(title, ""),
      "description": coalesce(description, ""),
      "icon": coalesce(icon, "sparkles"),
      _key
    }
  },
  "journey": *[_type == "aboutJourneySection" && _id == "aboutJourneySection"][0]{
    "journeyTitle": coalesce(journeyTitle, ""),
    "journeyItems": journeyItems[]{
      "year": coalesce(year, ""),
      "title": coalesce(title, ""),
      "description": coalesce(description, ""),
      _key
    }
  },
  "cta": *[_type == "aboutCtaSection" && _id == "aboutCtaSection"][0]{
    "ctaHeadlineStart": coalesce(ctaHeadlineStart, ""),
    "ctaHeadlineEmphasis": coalesce(ctaHeadlineEmphasis, ""),
    "ctaHeadlineEnd": coalesce(ctaHeadlineEnd, ""),
    "ctaDescription": coalesce(ctaDescription, ""),
    "ctaButton": {
      "label": coalesce(ctaButton.label, ""),
      "href": coalesce(ctaButton.href, "")
    }
  }
}
`;

export async function getAboutPageContent(): Promise<AboutPageContent | null> {
  const data = await cachedSanityFetch<{
    hero?: {
      badgeLabel?: string;
      headlineStart?: string;
      headlineEmphasis?: string;
      headlineEnd?: string;
      heroDescription?: string;
      profileImage?: {
        url: string;
        alt?: string;
      };
    };
    story?: {
      storyTitle?: string;
      storyContent?: string;
      storyImage?: {
        url: string;
        alt?: string;
      };
    };
    values?: {
      philosophyTitle?: string;
      philosophyContent?: string;
      values?: AboutValue[];
    };
    journey?: {
      journeyTitle?: string;
      journeyItems?: AboutJourneyItem[];
    };
    cta?: {
      ctaHeadlineStart?: string;
      ctaHeadlineEmphasis?: string;
      ctaHeadlineEnd?: string;
      ctaDescription?: string;
      ctaButton?: CtaLink;
    };
  }>(aboutPageQuery, {
    tags: ["about-page"],
    revalidate: 12 * 60 * 60,
  });

  if (!data) return null;

  // Flatten the nested structure to match the expected type
  return {
    badgeLabel: data.hero?.badgeLabel,
    headlineStart: data.hero?.headlineStart,
    headlineEmphasis: data.hero?.headlineEmphasis,
    headlineEnd: data.hero?.headlineEnd,
    heroDescription: data.hero?.heroDescription,
    profileImage: data.hero?.profileImage,
    storyTitle: data.story?.storyTitle,
    storyContent: data.story?.storyContent,
    storyImage: data.story?.storyImage,
    philosophyTitle: data.values?.philosophyTitle,
    philosophyContent: data.values?.philosophyContent,
    values: data.values?.values,
    journeyTitle: data.journey?.journeyTitle,
    journeyItems: data.journey?.journeyItems,
    ctaHeadlineStart: data.cta?.ctaHeadlineStart,
    ctaHeadlineEmphasis: data.cta?.ctaHeadlineEmphasis,
    ctaHeadlineEnd: data.cta?.ctaHeadlineEnd,
    ctaDescription: data.cta?.ctaDescription,
    ctaButton: data.cta?.ctaButton,
  };
}

// My Work Page Types
export type MyWorkPageContent = {
  badgeLabel?: string;
  headline?: string;
  description?: string;
};

const myWorkPageQuery = `
*[_type == "myWorkPage" && _id == "myWorkPage"][0]{
  "badgeLabel": coalesce(badgeLabel, "Partnerships"),
  "headline": coalesce(headline, "My best work"),
  "description": coalesce(description, "")
}
`;

export async function getMyWorkPageContent(): Promise<MyWorkPageContent | null> {
  return cachedSanityFetch(myWorkPageQuery, {
    tags: ["my-work-page"],
    revalidate: 12 * 60 * 60,
  });
}

// Not Found Page Types
export type NotFoundPageContent = {
  badgeLabel?: string;
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  description?: string;
  primaryButton?: CtaLink;
  secondaryButton?: CtaLink;
  profileImage?: {
    url: string;
    alt?: string;
  };
  errorNumber?: string;
  errorSubtitle?: string;
};

const notFoundPageQuery = `
{
  "content": *[_type == "notFoundContentSection" && _id == "notFoundContentSection"][0]{
    "badgeLabel": coalesce(badgeLabel, "404 — Not found"),
    "headlineStart": coalesce(headlineStart, "This page went"),
    "headlineEmphasis": coalesce(headlineEmphasis),
    "headlineEnd": coalesce(headlineEnd),
    "description": coalesce(description, "The link might be broken, or the page may have been moved. Let's get you back to something good.")
  },
  "buttons": *[_type == "notFoundButtonsSection" && _id == "notFoundButtonsSection"][0]{
    "primaryButton": {
      "label": coalesce(primaryButton.label, "Back home"),
      "href": coalesce(primaryButton.href, "/")
    },
    "secondaryButton": {
      "label": coalesce(secondaryButton.label, "See my work"),
      "href": coalesce(secondaryButton.href, "/my-work")
    }
  },
  "visual": *[_type == "notFoundVisualSection" && _id == "notFoundVisualSection"][0]{
    "profileImage": {
      "url": coalesce(profileImage.asset->url, ""),
      "alt": coalesce(profileImage.alt, "Profile photo")
    },
    "errorNumber": coalesce(errorNumber, "404"),
    "errorSubtitle": coalesce(errorSubtitle, "Lost, but still looking good.")
  }
}
`;

export async function getNotFoundPageContent(): Promise<NotFoundPageContent | null> {
  const data = await cachedSanityFetch<{
    content?: {
      badgeLabel?: string;
      headlineStart?: string;
      headlineEmphasis?: string;
      headlineEnd?: string;
      description?: string;
    };
    buttons?: {
      primaryButton?: CtaLink;
      secondaryButton?: CtaLink;
    };
    visual?: {
      profileImage?: {
        url: string;
        alt?: string;
      };
      errorNumber?: string;
      errorSubtitle?: string;
    };
  }>(notFoundPageQuery, {
    tags: ["not-found-page"],
    revalidate: 12 * 60 * 60,
  });

  if (!data) return null;

  // Flatten the nested structure to match the expected type
  return {
    badgeLabel: data.content?.badgeLabel,
    headlineStart: data.content?.headlineStart,
    headlineEmphasis: data.content?.headlineEmphasis,
    headlineEnd: data.content?.headlineEnd,
    description: data.content?.description,
    primaryButton: data.buttons?.primaryButton,
    secondaryButton: data.buttons?.secondaryButton,
    profileImage: data.visual?.profileImage,
    errorNumber: data.visual?.errorNumber,
    errorSubtitle: data.visual?.errorSubtitle,
  };
}

// Linktree Page Types
export type LinktreeLink = {
  label: string;
  url: string;
  icon?: string;
  _key?: string;
};

export type LinktreePageContent = {
  name?: string;
  username?: string;
  bio?: string;
  profileImage?: {
    url: string;
    alt?: string;
  };
  links?: LinktreeLink[];
  showSocials?: boolean;
  socials?: SocialLink[];
};

const linktreePageQuery = `
{
  "page": *[_type == "linktreePage" && _id == "linktreePage"][0]{
    "name": coalesce(name, ""),
    "username": coalesce(username, ""),
    "bio": coalesce(bio, ""),
    "profileImage": {
      "url": coalesce(profileImage.asset->url, ""),
      "alt": coalesce(profileImage.alt, name, "Profile")
    },
    "links": links[]{
      "label": coalesce(label, ""),
      "url": coalesce(url, ""),
      "icon": coalesce(icon, "link"),
      _key
    },
    "showSocials": coalesce(showSocials, true)
  },
  "socials": *[_type == "socialMediaSection" && _id == "socialMediaSection"][0].socials[]{
    icon,
    "href": coalesce(href, ""),
    "label": coalesce(label, ""),
    "emailSubject": coalesce(emailSubject, ""),
    "emailBody": coalesce(emailBody, ""),
    _key
  }
}
`;

export async function getLinktreePageContent(): Promise<LinktreePageContent | null> {
  const data = await cachedSanityFetch<{
    page?: {
      name?: string;
      bio?: string;
      profileImage?: { url: string; alt?: string };
      links?: LinktreeLink[];
      showSocials?: boolean;
    };
    socials?: SocialLink[];
  }>(linktreePageQuery, {
    tags: ["linktree-page"],
    revalidate: 12 * 60 * 60,
  });

  if (!data?.page) return null;

  return {
    ...data.page,
    socials: data.page.showSocials ? data.socials : undefined,
  };
}
