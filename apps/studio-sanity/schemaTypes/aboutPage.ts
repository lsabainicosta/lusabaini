import {defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero Section'},
    {name: 'story', title: 'My Story'},
    {name: 'values', title: 'Values & Philosophy'},
    {name: 'journey', title: 'Journey Timeline'},
    {name: 'cta', title: 'Call to Action'},
  ],
  initialValue: {
    badgeLabel: 'About me',
    headlineStart: 'The creator behind the',
    headlineEmphasis: 'content',
    headlineEnd: '',
    heroDescription:
      "I'm Luiza — a social media strategist and short-form content creator helping brands turn scrolling audiences into loyal customers.",
    storyTitle: 'My Story',
    storyContent:
      "From my early days experimenting with social media to working with brands across the globe, I've always been passionate about creating content that doesn't just look good — it performs. I believe in the power of authenticity, strategic thinking, and relentless testing to find what truly resonates with audiences.",
    philosophyTitle: 'Philosophy',
    philosophyContent:
      "I don't believe in one-size-fits-all solutions. Every brand has a unique voice, and my job is to amplify it through content that connects, engages, and converts. Whether it's TikTok, Instagram Reels, or YouTube Shorts, I craft strategies tailored to your goals.",
    ctaHeadlineStart: "Let's create something",
    ctaHeadlineEmphasis: 'incredible',
    ctaHeadlineEnd: 'together.',
    ctaDescription: 'Ready to transform your social media presence?',
    ctaButton: {label: 'Book a call', href: '/book-a-call'},
  },
  fields: [
    // Hero Section
    defineField({
      name: 'badgeLabel',
      title: 'Badge Label',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'headlineStart',
      title: 'Headline (start)',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Headline (emphasis)',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headlineEnd',
      title: 'Headline (end)',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'hero',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),

    // Story Section
    defineField({
      name: 'storyTitle',
      title: 'Story Section Title',
      type: 'string',
      group: 'story',
    }),
    defineField({
      name: 'storyContent',
      title: 'Story Content',
      type: 'text',
      rows: 6,
      group: 'story',
    }),
    defineField({
      name: 'storyImage',
      title: 'Story Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'story',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),

    // Values & Philosophy
    defineField({
      name: 'philosophyTitle',
      title: 'Philosophy Section Title',
      type: 'string',
      group: 'values',
    }),
    defineField({
      name: 'philosophyContent',
      title: 'Philosophy Content',
      type: 'text',
      rows: 4,
      group: 'values',
    }),
    defineField({
      name: 'values',
      title: 'Core Values',
      type: 'array',
      group: 'values',
      of: [
        defineField({
          name: 'value',
          title: 'Value',
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
              rows: 2,
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Sparkles', value: 'sparkles'},
                  {title: 'Target', value: 'target'},
                  {title: 'Heart', value: 'heart'},
                  {title: 'Zap', value: 'zap'},
                  {title: 'Star', value: 'star'},
                  {title: 'Users', value: 'users'},
                  {title: 'Lightbulb', value: 'lightbulb'},
                  {title: 'Rocket', value: 'rocket'},
                ],
              },
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // Journey Timeline
    defineField({
      name: 'journeyTitle',
      title: 'Journey Section Title',
      type: 'string',
      group: 'journey',
    }),
    defineField({
      name: 'journeyItems',
      title: 'Journey Milestones',
      type: 'array',
      group: 'journey',
      of: [
        defineField({
          name: 'milestone',
          title: 'Milestone',
          type: 'object',
          fields: [
            defineField({
              name: 'year',
              title: 'Year',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
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
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'year',
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(8),
    }),

    // CTA Section
    defineField({
      name: 'ctaHeadlineStart',
      title: 'CTA Headline (start)',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaHeadlineEmphasis',
      title: 'CTA Headline (emphasis)',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaHeadlineEnd',
      title: 'CTA Headline (end)',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      group: 'cta',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'href', title: 'Href', type: 'string'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'About Page'}
    },
  },
})
