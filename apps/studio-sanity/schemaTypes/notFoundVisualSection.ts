import {defineField, defineType} from 'sanity'

export const notFoundVisualSection = defineType({
  name: 'notFoundVisualSection',
  title: 'Not Found Visual',
  type: 'document',
  initialValue: {
    errorNumber: '404',
    errorSubtitle: 'Lost, but still looking good.',
  },
  fields: [
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'errorNumber',
      title: 'Error Number',
      type: 'string',
      description: 'The number displayed in the error card (e.g., "404")',
    }),
    defineField({
      name: 'errorSubtitle',
      title: 'Error Subtitle',
      type: 'string',
      description: 'The subtitle text displayed below the error number',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Not Found Visual'}
    },
  },
})
