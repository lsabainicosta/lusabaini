import {defineField, defineType} from 'sanity'

export const aboutJourneySection = defineType({
  name: 'aboutJourneySection',
  title: 'About Journey Timeline',
  type: 'document',
  fields: [
    defineField({
      name: 'journeyTitle',
      title: 'Journey Section Title',
      type: 'string',
    }),
    defineField({
      name: 'journeyItems',
      title: 'Journey Milestones',
      type: 'array',
      of: [
        defineField({
          name: 'milestone',
          title: 'Milestone',
          type: 'object',
          fields: [
            defineField({
              name: 'year',
              title: 'Year',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'year',
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(8),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'About Journey Timeline'}
    },
  },
})
