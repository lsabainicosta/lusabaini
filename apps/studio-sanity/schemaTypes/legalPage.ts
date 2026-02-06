import {defineField, defineType} from 'sanity'

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  groups: [
    {name: 'header', title: 'Header'},
    {name: 'content', title: 'Content'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      description: 'Only shown in Sanity Studio.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'seo',
      options: {source: 'internalTitle', maxLength: 96},
      validation: (Rule) => Rule.required(),
      description: 'URL path part, e.g. "privacy-policy" or "terms-of-service".',
    }),
    defineField({
      name: 'linkLabel',
      title: 'Footer link label',
      type: 'string',
      group: 'seo',
      description: 'Optional short label used in footer legal navigation.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'seo',
      description: 'Lower numbers appear first in footer legal links.',
    }),
    defineField({
      name: 'badgeLabel',
      title: 'Badge label',
      type: 'string',
      group: 'header',
      initialValue: 'Legal',
    }),
    defineField({
      name: 'headlineStart',
      title: 'Headline (start)',
      type: 'string',
      group: 'header',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Headline (emphasis)',
      type: 'string',
      group: 'header',
      description: 'Styled in italic serif.',
    }),
    defineField({
      name: 'headlineEnd',
      title: 'Headline (end)',
      type: 'string',
      group: 'header',
    }),
    defineField({
      name: 'description',
      title: 'Intro description',
      type: 'text',
      rows: 4,
      group: 'header',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last updated',
      type: 'date',
      group: 'header',
      options: {dateFormat: 'YYYY-MM-DD'},
      description: 'Shown under the title as "Last updated: ...".',
    }),
    defineField({
      name: 'content',
      title: 'Markdown content',
      type: 'markdown',
      group: 'content',
      description: 'Write the full legal text in markdown. Supports headings, bullets, links and images.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'internalTitle',
      subtitle: 'slug.current',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Legal Page',
        subtitle: subtitle ? `/${subtitle}` : 'Missing slug',
      }
    },
  },
})
