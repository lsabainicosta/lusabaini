import {defineField, defineType} from 'sanity'

export const footerSection = defineType({
  name: 'footerSection',
  title: 'Footer',
  type: 'document',
  initialValue: {
    brandLabel: 'lusabaini',
    headlineStart: 'Short-form that turns attention into',
    headlineEmphasis: 'customers',
    headlineEnd: '.',
    description:
      'I create TikTok & Instagram content designed to convert views into booked calls and sales.',
    legalLinks: [],
  },
  fields: [
    defineField({
      name: 'brandLabel',
      title: 'Brand Label',
      type: 'string',
      description: 'Text next to the icon (e.g. "lusabaini").',
    }),
    defineField({
      name: 'headlineStart',
      title: 'Headline (start)',
      type: 'string',
    }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Headline (emphasis)',
      type: 'string',
    }),
    defineField({
      name: 'headlineEnd',
      title: 'Headline (end)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal Links',
      description: 'Optional. Keep small and quiet.',
      type: 'array',
      of: [
        defineField({
          name: 'link',
          title: 'Link',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Href',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Footer'}
    },
  },
})
