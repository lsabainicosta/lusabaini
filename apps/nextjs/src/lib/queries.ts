import { cachedSanityFetch } from "./sanity";

type HeaderButton = {
  label: string;
  href: string;
  icon?: string;
  _key?: string;
};

type ProfileImage = {
  url: string;
  alt?: string;
};

type ProfileHeaderContent = {
  name?: string;
  image?: ProfileImage;
  buttons?: HeaderButton[];
};

type SocialLink = {
  label: string;
  url: string;
  icon?: string;
  _key?: string;
  color?: string;
  backgroundColor?: string;
};

export type ThemeSettings = {
  brandColor?: string;
  fontFamily?: string;
};

const contentQuery = `
{
  "profileHeader": *[_type == "profileHeader"][0]{
    "name": coalesce(name, ""),
    "image": {
      "url": coalesce(profileImage.asset->url, ""),
      "alt": coalesce(profileImage.alt, name, "")
    },
    "buttons": buttons[]{
      "label": coalesce(label, ""),
      "href": coalesce(href, ""),
      icon,
      _key
    }
  },
  "socialLinks": *[_type == "socialButtons"][0].links[]{
    "label": coalesce(label, ""),
    "url": coalesce(url, ""),
    icon,
    "color": coalesce(color.hex, ""),
    "backgroundColor": coalesce(backgroundColor.hex, ""),
    _key
  },
  "theme": *[_type == "siteSettings"][0]{
    "brandColor": coalesce(brandColor.hex, "#ff7edb"),
    "fontFamily": coalesce(fontFamily, "var(--font-geist-sans), sans-serif")
  }
}
`;

export async function getHomepageContent(): Promise<{
  profileHeader?: ProfileHeaderContent;
  socialLinks?: SocialLink[];
  theme?: ThemeSettings;
}> {
  return cachedSanityFetch(contentQuery, {
    tags: ["homepage-content"],
    revalidate: 300,
  });
}

const themeQuery = `
*[_type == "siteSettings"][0]{
  "brandColor": coalesce(brandColor.hex, "#ff7edb"),
  "fontFamily": coalesce(fontFamily, "var(--font-geist-sans), sans-serif")
}
`;

export async function getThemeSettings(): Promise<ThemeSettings> {
  return cachedSanityFetch(themeQuery, {
    tags: ["theme-settings"],
    revalidate: 300,
  });
}
