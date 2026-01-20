import {defineField, defineType} from 'sanity'

export const aboutValuesSection = defineType({
  name: 'aboutValuesSection',
  title: 'About Values & Philosophy',
  type: 'document',
  initialValue: {
    philosophyTitle: 'Philosophy',
    philosophyContent:
      "I don't believe in one-size-fits-all solutions. Every brand has a unique voice, and my job is to amplify it through content that connects, engages, and converts. Whether it's TikTok, Instagram Reels, or YouTube Shorts, I craft strategies tailored to your goals.",
  },
  fields: [
    defineField({
      name: 'philosophyTitle',
      title: 'Philosophy Section Title',
      type: 'string',
    }),
    defineField({
      name: 'philosophyContent',
      title: 'Philosophy Content',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'values',
      title: 'Core Values',
      type: 'array',
      of: [
        defineField({
          name: 'value',
          title: 'Value',
          type: 'object',
          fields: [
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
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Sparkles', value: 'sparkles'},
                  {title: 'Target', value: 'target'},
                  {title: 'Heart', value: 'heart'},
                  {title: 'Zap', value: 'zap'},
                  {title: 'Star', value: 'star'},
                  {title: 'Users', value: 'users'},
                  {title: 'Lightbulb', value: 'lightbulb'},
                  {title: 'Rocket', value: 'rocket'},
                ],
              },
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'About Values & Philosophy'}
    },
  },
})
