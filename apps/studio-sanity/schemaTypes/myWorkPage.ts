import {defineField, defineType} from 'sanity'

export const myWorkPage = defineType({
  name: 'myWorkPage',
  title: 'My Work Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero Section'},
  ],
  initialValue: {
    badgeLabel: 'Partnerships',
    headline: 'My best work',
    description:
      "See how we've helped growing businesses transform their social media from a time drain into their most powerful growth engine. Every strategy is custom-built, every result is measurable.",
  },
  fields: [
    defineField({
      name: 'badgeLabel',
      title: 'Badge Label',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'hero',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'My Work Page'}
    },
  },
})
