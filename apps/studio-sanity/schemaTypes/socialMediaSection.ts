import {defineField, defineType} from 'sanity'

export const socialMediaSection = defineType({
  name: 'socialMediaSection',
  title: 'Social Media',
  type: 'document',
  initialValue: {
    socials: [
      {_type: 'social', icon: 'instagram', href: 'https://instagram.com', label: 'Instagram'},
    ],
  },
  fields: [
    defineField({
      name: 'socials',
      title: 'Social Media Links',
      type: 'array',
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
                  {title: 'Email', value: 'email'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              validation: (Rule) =>
                Rule.required().custom((value, context) => {
                  if (!value) return true;
                  // Allow mailto: links for email icons
                  if (typeof value === 'string' && value.startsWith('mailto:')) {
                    return true;
                  }
                  // Validate as URL for other cases
                  try {
                    new URL(value);
                    return true;
                  } catch {
                    return 'Must be a valid URL or mailto: link';
                  }
                }),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Used for accessibility (e.g. "Follow us on Instagram").',
            }),
            defineField({
              name: 'emailSubject',
              title: 'Email Subject',
              type: 'string',
              description: 'Optional default subject for email links. Only used when icon is "Email".',
              hidden: ({parent}) => parent?.icon !== 'email',
            }),
            defineField({
              name: 'emailBody',
              title: 'Email Body',
              type: 'text',
              rows: 3,
              description: 'Optional default body text for email links. Only used when icon is "Email".',
              hidden: ({parent}) => parent?.icon !== 'email',
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
                email: 'Email',
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
      return {title: 'Social Media'}
    },
  },
})
