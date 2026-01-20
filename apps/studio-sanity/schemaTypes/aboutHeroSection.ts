import {defineField, defineType} from 'sanity'

export const aboutHeroSection = defineType({
  name: 'aboutHeroSection',
  title: 'About Hero',
  type: 'document',
  initialValue: {
    badgeLabel: 'About me',
    headlineStart: 'The creator behind the',
    headlineEmphasis: 'content',
    headlineEnd: '',
    heroDescription:
      "I'm Luiza — a social media strategist and short-form content creator helping brands turn scrolling audiences into loyal customers.",
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
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      rows: 3,
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
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'About Hero'}
    },
  },
})
