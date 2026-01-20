import {defineField, defineType} from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'document',
  initialValue: {
    headlineStart: 'Short form content that',
    headlineEmphasis: 'performs',
    headlineEnd: '',
    description:
      'I help brands grow on social through high-performing short-form video, strategy, and hands-on execution.',
    primaryCta: {label: 'Book a call', href: '/book-a-call'},
    secondaryCta: {label: 'View my work', href: '#work'},
  },
  fields: [
    defineField({
      name: 'headlineStart',
      title: 'Headline (start)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Headline (emphasis)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headlineEnd',
      title: 'Headline (end)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'href', title: 'Href', type: 'string'}),
      ],
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'href', title: 'Href', type: 'string'}),
      ],
    }),
    defineField({
      name: 'carouselVideos',
      title: 'Story carousel videos',
      type: 'array',
      description:
        'These videos power the Instagram-style story mockup on the right side of the hero.',
      of: [
        defineField({
          name: 'carouselVideo',
          title: 'Carousel video',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Optional internal label.',
            }),
            defineField({
              name: 'video',
              title: 'Video file',
              type: 'file',
              options: {
                accept: 'video/*',
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'video.asset.originalFilename',
            },
            prepare({title, subtitle}) {
              return {
                title: title || 'Carousel video',
                subtitle,
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(10),
    }),
    defineField({
      name: 'storyUserInfo',
      title: 'Story User Info',
      type: 'object',
      description: 'User information displayed in the story mockup overlay.',
      fields: [
        defineField({
          name: 'username',
          title: 'Username',
          type: 'string',
          initialValue: 'lusabaini',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'timeAgo',
          title: 'Time Ago',
          type: 'string',
          description: 'Time displayed next to username (e.g., "6h", "2d", "1w")',
          initialValue: '6h',
        }),
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
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Hero'}
    },
  },
})
