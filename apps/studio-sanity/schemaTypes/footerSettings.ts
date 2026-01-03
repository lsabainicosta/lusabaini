import {defineField, defineType} from 'sanity'

export const footerSettings = defineType({
  name: 'footerSettings',
  title: 'Footer',
  type: 'document',
  initialValue: {
    brandLabel: 'lusabaini',
    headlineStart: 'Short-form that turns attention into',
    headlineEmphasis: 'customers',
    headlineEnd: '.',
    description:
      'I create TikTok & Instagram content designed to convert views into booked calls and sales.',
    navigationLinks: [
      {_type: 'link', label: 'Home', href: '/'},
      {_type: 'link', label: 'My Work', href: '/my-work'},
    ],
    legalLinks: [],
    socials: [
      {_type: 'social', icon: 'instagram', href: 'https://instagram.com', label: 'Instagram'},
    ],
  },
  fields: [
    defineField({
      name: 'brandLabel',
      title: 'Brand label',
      type: 'string',
      description: 'Text next to the icon (e.g. “lusabaini”).',
    }),
    defineField({
      name: 'headlineStart',
      title: 'Headline (start)',
      type: 'string',
    }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Headline (emphasis)',
      type: 'string',
    }),
    defineField({
      name: 'headlineEnd',
      title: 'Headline (end)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'socials',
      title: 'Social icons',
      type: 'array',
      of: [
        defineField({
          name: 'social',
          title: 'Social',
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'X', value: 'x'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'LinkedIn', value: 'linkedin'},
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Href',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Used for accessibility.',
            }),
          ],
          preview: {select: {title: 'icon', subtitle: 'href'}},
        }),
      ],
    }),
    defineField({
      name: 'navigationLinks',
      title: 'Navigation links',
      description:
        'Keep this minimal. The primary action (e.g. “Book a call”) is set in Header settings.',
      type: 'array',
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
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Href',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal links',
      description: 'Optional. Keep small and quiet.',
      type: 'array',
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
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Href',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Footer'}
    },
  },
})
