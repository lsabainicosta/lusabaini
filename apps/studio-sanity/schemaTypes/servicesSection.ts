import {defineField, defineType} from 'sanity'

export const servicesSection = defineType({
  name: 'servicesSection',
  title: 'Services',
  type: 'document',
  initialValue: {
    badgeLabel: 'Services',
    headlineStart: 'How I can',
    headlineEmphasis: 'grooow',
    headlineEnd: 'help you',
    items: [
      {
        _type: 'service',
        title: 'Content Creation',
        description:
          'TikToks, Reels, and UGC-style videos designed for reach, retention, and conversions, not just aesthetics.',
        videoSrc: '/videos/vid6.mp4',
      },
      {
        _type: 'service',
        title: 'Social Management',
        description:
          'Content planning, posting, and optimisation so your brand stays consistent and relevant.',
        videoSrc: '/videos/vid4.mp4',
      },
      {
        _type: 'service',
        title: 'Paid Media',
        description:
          'Scroll-stopping creatives built specifically for paid social, tested and refined based on performance.',
        videoSrc: '/videos/vid5.mp4',
      },
    ],
  },
  fields: [
    defineField({
      name: 'badgeLabel',
      title: 'Badge label',
      type: 'string',
      initialValue: 'Services',
    }),
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
      name: 'items',
      title: 'Service cards',
      type: 'array',
      of: [
        defineField({
          name: 'service',
          title: 'Service',
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
              rows: 3,
            }),
            defineField({
              name: 'video',
              title: 'Video (upload)',
              type: 'file',
              options: {
                accept: 'video/*',
              },
              description:
                'Upload a video file (recommended). If set, the frontend will use this video.',
            }),
            defineField({
              name: 'videoSrc',
              title: 'Video src (legacy)',
              type: 'string',
              description:
                'Optional fallback: URL or local path (e.g. /videos/vid6.mp4). Prefer using “Video (upload)”. If empty, an icon placeholder is shown.',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              uploaded: 'video.asset.originalFilename',
              legacy: 'videoSrc',
            },
            prepare({title, uploaded, legacy}) {
              const subtitle = uploaded
                ? `Uploaded: ${uploaded}`
                : legacy
                  ? `Legacy: ${legacy}`
                  : 'No video set'
              return {title, subtitle}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Services'}
    },
  },
})
