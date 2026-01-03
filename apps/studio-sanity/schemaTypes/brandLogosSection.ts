import {defineField, defineType} from 'sanity'

export const brandLogosSection = defineType({
  name: 'brandLogosSection',
  title: 'Brand Logos',
  type: 'document',
  initialValue: {
    introText: 'Brands I have helped grow on social.',
  },
  fields: [
    defineField({
      name: 'introText',
      title: 'Intro text',
      type: 'string',
      description: 'Small text on the left of the marquee.',
    }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        defineField({
          name: 'logo',
          title: 'Logo',
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              description: 'Optional label for internal reference / accessibility.',
            }),
            defineField({
              name: 'image',
              title: 'Logo image',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt text',
                  type: 'string',
                  description: 'Brief description for accessibility.',
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Link (optional)',
              type: 'string',
              description: 'Optional URL to link the logo to.',
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'href', media: 'image'},
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Brand Logos'}
    },
  },
})
