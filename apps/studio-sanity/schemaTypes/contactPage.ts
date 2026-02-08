import {defineField, defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO'},
  ],
  initialValue: {
    seoTitle: 'Contact',
    seoDescription:
      'Reach out to Luiza Sabaini Costa for social media strategy, short-form content creation, and campaign collaborations.',
    headline: "Let's build your next growth campaign",
    intro:
      "Share your goals, timeline, and what success looks like for your brand. You'll typically get a response within 1-2 business days.",
    supportingText:
      'Services include short-form video production, social strategy, performance-driven content systems, and creator-led campaign support.',
  },
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro Paragraph',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'supportingText',
      title: 'Supporting Text',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Used for the page title in search and browser tabs.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Used for search snippets and social previews.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Contact Page'}
    },
  },
})
