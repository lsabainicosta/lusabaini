import {defineField, defineType} from 'sanity'

export const linktreePage = defineType({
  name: 'linktreePage',
  title: 'Linktree Page',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Display Name',
      type: 'string',
      description: 'Your name as shown on the linktree page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'username',
      title: 'Username',
      type: 'string',
      description: 'Your username/handle (without @). Shown in the share popup.',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 2,
      description: 'A short tagline or bio (max 150 characters).',
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for accessibility.',
        }),
      ],
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      description: 'Add up to 12 links to display on your linktree.',
      of: [
        defineField({
          name: 'link',
          title: 'Link',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Button text (e.g. "Book a Call", "My Portfolio").',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'string',
              description: 'Link destination (e.g. https://example.com or mailto:email@example.com).',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Optional icon to display on the button.',
              options: {
                list: [
                  {title: 'Link', value: 'link'},
                  {title: 'Mail', value: 'mail'},
                  {title: 'Briefcase', value: 'briefcase'},
                  {title: 'Phone', value: 'phone'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Spotify', value: 'spotify'},
                  {title: 'Shopping Bag', value: 'shopping'},
                  {title: 'Calendar', value: 'calendar'},
                  {title: 'Globe', value: 'globe'},
                ],
                layout: 'dropdown',
              },
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'url'},
          },
        }),
      ],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: 'showSocials',
      title: 'Show Social Media Icons',
      type: 'boolean',
      description: 'Display the social media icons from Site Settings at the bottom of the page.',
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Linktree Page'}
    },
  },
})
