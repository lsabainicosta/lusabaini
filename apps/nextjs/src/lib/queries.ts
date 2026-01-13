import { cachedSanityFetch } from "./sanity";

type ProfileImage = {
  url: string;
  alt?: string;
};

type MediaFile = {
  url: string;
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

export type HeroSectionContent = {
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  description?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  carouselVideos?: HeroCarouselVideo[];
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
  videoSrc?: string;
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
  icon: "instagram" | "tiktok" | "youtube" | "x" | "linkedin" | "facebook";
  href: string;
  label?: string;
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
  "siteSettings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    "mainNavigation": mainNavigation[]{
      "label": coalesce(label, ""),
      "href": coalesce(href, ""),
      _key
    },
    "ctaButton": {
      "label": coalesce(ctaButton.label, ""),
      "href": coalesce(ctaButton.href, "")
    },
    "socials": socials[]{
      icon,
      "href": coalesce(href, ""),
      "label": coalesce(label, ""),
      _key
    }
  },
  "footer": *[_type == "footerSettings" && _id == "footerSettings"][0]{
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
  }
}`;

const clientResultsBase = `*[_type == "clientResult"] | order(order asc, _createdAt desc)`;

const contentQuery = `
{
  "theme": *[_type == "siteSettings" && _id == "siteSettings"][0]{
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
      "videoSrc": coalesce(video.asset->url, videoSrc, ""),
      _key
    }
  },
  "footer": *[_type == "footerSettings" && _id == "footerSettings"][0]{
    "brandLabel": coalesce(brandLabel, ""),
    "headlineStart": coalesce(headlineStart, ""),
    "headlineEmphasis": coalesce(headlineEmphasis, ""),
    "headlineEnd": coalesce(headlineEnd, ""),
    "description": coalesce(description, ""),
    "socials": socials[]{
      icon,
      "href": coalesce(href, ""),
      "label": coalesce(label, ""),
      _key
    },
    "navigationLinks": navigationLinks[]{
      "label": coalesce(label, ""),
      "href": coalesce(href, ""),
      _key
    },
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
      "videoSrc": coalesce(video.asset->url, videoSrc, ""),
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
*[_type == "siteSettings" && _id == "siteSettings"][0]{
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
*[_type == "aboutPage" && _id == "aboutPage"][0]{
  "badgeLabel": coalesce(badgeLabel, "About me"),
  "headlineStart": coalesce(headlineStart, ""),
  "headlineEmphasis": coalesce(headlineEmphasis, ""),
  "headlineEnd": coalesce(headlineEnd, ""),
  "heroDescription": coalesce(heroDescription, ""),
  "profileImage": {
    "url": coalesce(profileImage.asset->url, ""),
    "alt": coalesce(profileImage.alt, "Profile photo")
  },
  "storyTitle": coalesce(storyTitle, ""),
  "storyContent": coalesce(storyContent, ""),
  "storyImage": {
    "url": coalesce(storyImage.asset->url, ""),
    "alt": coalesce(storyImage.alt, "Story image")
  },
  "philosophyTitle": coalesce(philosophyTitle, ""),
  "philosophyContent": coalesce(philosophyContent, ""),
  "values": values[]{
    "title": coalesce(title, ""),
    "description": coalesce(description, ""),
    "icon": coalesce(icon, "sparkles"),
    _key
  },
  "journeyTitle": coalesce(journeyTitle, ""),
  "journeyItems": journeyItems[]{
    "year": coalesce(year, ""),
    "title": coalesce(title, ""),
    "description": coalesce(description, ""),
    _key
  },
  "ctaHeadlineStart": coalesce(ctaHeadlineStart, ""),
  "ctaHeadlineEmphasis": coalesce(ctaHeadlineEmphasis, ""),
  "ctaHeadlineEnd": coalesce(ctaHeadlineEnd, ""),
  "ctaDescription": coalesce(ctaDescription, ""),
  "ctaButton": {
    "label": coalesce(ctaButton.label, ""),
    "href": coalesce(ctaButton.href, "")
  }
}
`;

export async function getAboutPageContent(): Promise<AboutPageContent | null> {
  return cachedSanityFetch(aboutPageQuery, {
    tags: ["about-page"],
    revalidate: 12 * 60 * 60,
  });
}
