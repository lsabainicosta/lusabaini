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

export type FooterSocial = {
  icon: "x" | "instagram" | "linkedin";
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
  socials?: FooterSocial[];
  navigationLinks?: FooterLink[];
  legalLinks?: FooterLink[];
};

const shellQuery = `
{
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
  header?: HeaderSettings;
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
