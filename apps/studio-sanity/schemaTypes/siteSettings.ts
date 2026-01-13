import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'branding', title: 'Branding'},
    {name: 'navigation', title: 'Navigation'},
    {name: 'socials', title: 'Social Media'},
  ],
  initialValue: {
    mainNavigation: [
      {_type: 'navLink', href: '/', label: 'Home'},
      {_type: 'navLink', href: '/about', label: 'About'},
      {_type: 'navLink', href: '/my-work', label: 'My Work'},
    ],
    ctaButton: {label: 'Book a call', href: '/book-a-call'},
    socials: [
      {_type: 'social', icon: 'instagram', href: 'https://instagram.com', label: 'Instagram'},
    ],
  },
  fields: [
    defineField({
      name: 'brandColor',
      title: 'Primary brand color',
      type: 'color',
      group: 'branding',
      options: {
        disableAlpha: true,
      },
      description: 'Used across backgrounds, accents and buttons',
    }),
    defineField({
      name: 'mainNavigation',
      title: 'Main Navigation',
      type: 'array',
      group: 'navigation',
      description: 'These links appear in both the header and footer.',
      of: [
        defineField({
          name: 'navLink',
          title: 'Nav link',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Href',
              type: 'string',
              description: 'Internal path (e.g. /about) or external URL.',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      group: 'navigation',
      description: 'The main call-to-action button shown in header and footer.',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
        }),
        defineField({
          name: 'href',
          title: 'Href',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'socials',
      title: 'Social Media Links',
      type: 'array',
      group: 'socials',
      description: 'Social media links shown across the site (footer, about page, etc.).',
      of: [
        defineField({
          name: 'social',
          title: 'Social',
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'X (Twitter)', value: 'x'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Facebook', value: 'facebook'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Used for accessibility (e.g. "Follow us on Instagram").',
            }),
          ],
          preview: {
            select: {title: 'icon', subtitle: 'href'},
            prepare({title, subtitle}) {
              const platformNames: Record<string, string> = {
                instagram: 'Instagram',
                tiktok: 'TikTok',
                youtube: 'YouTube',
                x: 'X (Twitter)',
                linkedin: 'LinkedIn',
                facebook: 'Facebook',
              }
              return {
                title: platformNames[title] || title,
                subtitle,
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
