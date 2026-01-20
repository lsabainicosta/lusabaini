import {defineField, defineType} from 'sanity'

export const aboutStorySection = defineType({
  name: 'aboutStorySection',
  title: 'About Story',
  type: 'document',
  initialValue: {
    storyTitle: 'My Story',
    storyContent:
      "From my early days experimenting with social media to working with brands across the globe, I've always been passionate about creating content that doesn't just look good — it performs. I believe in the power of authenticity, strategic thinking, and relentless testing to find what truly resonates with audiences.",
  },
  fields: [
    defineField({
      name: 'storyTitle',
      title: 'Story Section Title',
      type: 'string',
    }),
    defineField({
      name: 'storyContent',
      title: 'Story Content',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'storyImage',
      title: 'Story Image',
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
  ],
  preview: {
    prepare() {
      return {title: 'About Story'}
    },
  },
})
