import {defineField, defineType} from 'sanity'

export const brandingSection = defineType({
  name: 'brandingSection',
  title: 'Branding',
  type: 'document',
  initialValue: {
    brandColorHex: '#f9f3eb',
  },
  fields: [
    defineField({
      name: 'brandColorHex',
      title: 'Primary brand color',
      type: 'string',
      description: 'Enter a hex color code (e.g. #f9f3eb). Used across backgrounds, accents and buttons.',
      validation: (Rule) =>
        Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
          name: 'hex color',
        }).error('Please enter a valid hex color (e.g. #f9f3eb)'),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Branding'}
    },
  },
})
