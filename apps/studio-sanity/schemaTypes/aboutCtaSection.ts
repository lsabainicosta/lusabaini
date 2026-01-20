import {defineField, defineType} from 'sanity'

export const aboutCtaSection = defineType({
  name: 'aboutCtaSection',
  title: 'About Call to Action',
  type: 'document',
  initialValue: {
    ctaHeadlineStart: "Let's create something",
    ctaHeadlineEmphasis: 'incredible',
    ctaHeadlineEnd: 'together.',
    ctaDescription: 'Ready to transform your social media presence?',
    ctaButton: {label: 'Book a call', href: '/book-a-call'},
  },
  fields: [
    defineField({
      name: 'ctaHeadlineStart',
      title: 'CTA Headline (start)',
      type: 'string',
    }),
    defineField({
      name: 'ctaHeadlineEmphasis',
      title: 'CTA Headline (emphasis)',
      type: 'string',
    }),
    defineField({
      name: 'ctaHeadlineEnd',
      title: 'CTA Headline (end)',
      type: 'string',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'href', title: 'Href', type: 'string'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'About Call to Action'}
    },
  },
})
