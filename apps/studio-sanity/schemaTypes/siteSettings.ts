import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
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
    select: {
      title: 'brandColor',
    },
    prepare({title}) {
      return {
        title: (title as any)?.hex || 'Brand color not set',
      }
    },
  },
})
