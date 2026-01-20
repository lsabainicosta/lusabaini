import {defineField, defineType} from 'sanity'

export const notFoundButtonsSection = defineType({
  name: 'notFoundButtonsSection',
  title: 'Not Found Buttons',
  type: 'document',
  initialValue: {
    primaryButton: {label: 'Back home', href: '/'},
    secondaryButton: {label: 'See my work', href: '/my-work'},
  },
  fields: [
    defineField({
      name: 'primaryButton',
      title: 'Primary Button',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'href', title: 'Href', type: 'string'}),
      ],
    }),
    defineField({
      name: 'secondaryButton',
      title: 'Secondary Button',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'href', title: 'Href', type: 'string'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Not Found Buttons'}
    },
  },
})
