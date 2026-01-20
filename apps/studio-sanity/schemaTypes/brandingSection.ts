import {defineField, defineType} from 'sanity'

export const brandingSection = defineType({
  name: 'brandingSection',
  title: 'Branding',
  type: 'document',
  initialValue: {
    brandColor: {
      hex: '#f9f3eb',
    },
  },
  fields: [
    defineField({
      name: 'brandColor',
      title: 'Primary brand color',
      type: 'color',
      options: {
        disableAlpha: true,
      },
      description: 'Used across backgrounds, accents and buttons',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Branding'}
    },
  },
})
