import {defineField, defineType} from 'sanity'

export const notFoundPage = defineType({
  name: 'notFoundPage',
  title: 'Not Found Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'buttons', title: 'Buttons'},
    {name: 'visual', title: 'Visual'},
  ],
  initialValue: {
    badgeLabel: '404 — Not found',
    headlineStart: 'This page went',
    headlineEmphasis: 'missing',
    headlineEnd: '.',
    description:
      "The link might be broken, or the page may have been moved. Let's get you back to something good.",
    primaryButton: {label: 'Back home', href: '/'},
    secondaryButton: {label: 'See my work', href: '/my-work'},
    errorNumber: '404',
    errorSubtitle: 'Lost, but still looking good.',
  },
  fields: [
    // Content Section
    defineField({
      name: 'badgeLabel',
      title: 'Badge Label',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'headlineStart',
      title: 'Headline (start)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Headline (emphasis)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headlineEnd',
      title: 'Headline (end)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'content',
    }),

    // Buttons Section
    defineField({
      name: 'primaryButton',
      title: 'Primary Button',
      type: 'object',
      group: 'buttons',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'href', title: 'Href', type: 'string'}),
      ],
    }),
    defineField({
      name: 'secondaryButton',
      title: 'Secondary Button',
      type: 'object',
      group: 'buttons',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'href', title: 'Href', type: 'string'}),
      ],
    }),

    // Visual Section
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'visual',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'errorNumber',
      title: 'Error Number',
      type: 'string',
      group: 'visual',
      description: 'The number displayed in the error card (e.g., "404")',
    }),
    defineField({
      name: 'errorSubtitle',
      title: 'Error Subtitle',
      type: 'string',
      group: 'visual',
      description: 'The subtitle text displayed below the error number',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Not Found Page'}
    },
  },
})