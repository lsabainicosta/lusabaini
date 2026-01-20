import {defineField, defineType} from 'sanity'

export const notFoundContentSection = defineType({
  name: 'notFoundContentSection',
  title: 'Not Found Content',
  type: 'document',
  initialValue: {
    badgeLabel: '404 — Not found',
    headlineStart: 'This page went',
    headlineEmphasis: 'missing',
    headlineEnd: '.',
    description:
      "The link might be broken, or the page may have been moved. Let's get you back to something good.",
  },
  fields: [
    defineField({
      name: 'badgeLabel',
      title: 'Badge Label',
      type: 'string',
    }),
    defineField({
      name: 'headlineStart',
      title: 'Headline (start)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Headline (emphasis)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headlineEnd',
      title: 'Headline (end)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Not Found Content'}
    },
  },
})
