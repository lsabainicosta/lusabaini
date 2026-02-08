import {defineField, defineType} from 'sanity'

export const myWorkPage = defineType({
  name: 'myWorkPage',
  title: 'My Work Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero Section'},
    {name: 'seo', title: 'SEO'},
  ],
  initialValue: {
    seoTitle: 'My Work',
    seoDescription:
      'Explore case studies, campaign outcomes, and short-form social media work delivered by Luiza Sabaini Costa.',
    badgeLabel: 'Partnerships',
    headline: 'My best work',
    description:
      "See how I've helped growing businesses transform their social media from a time drain into their most powerful growth engine. Every strategy is custom-built, every result is measurable.",
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
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'My Work page title used in search and browser tabs.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'My Work page description used for search snippets and social previews.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'My Work Page'}
    },
  },
})
