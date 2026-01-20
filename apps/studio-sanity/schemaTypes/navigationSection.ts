import {defineField, defineType} from 'sanity'

export const navigationSection = defineType({
  name: 'navigationSection',
  title: 'Navigation',
  type: 'document',
  initialValue: {
    mainNavigation: [
      {_type: 'navLink', href: '/', label: 'Home'},
      {_type: 'navLink', href: '/about', label: 'About'},
      {_type: 'navLink', href: '/my-work', label: 'My Work'},
    ],
    ctaButton: {label: 'Book a call', href: '/book-a-call'},
  },
  fields: [
    defineField({
      name: 'mainNavigation',
      title: 'Main Navigation',
      type: 'array',
      description: 'These links appear in both the header and footer.',
      of: [
        defineField({
          name: 'navLink',
          title: 'Nav link',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Href',
              type: 'string',
              description: 'Internal path (e.g. /about) or external URL.',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      description: 'The main call-to-action button shown in header and footer.',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
        }),
        defineField({
          name: 'href',
          title: 'Href',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Navigation'}
    },
  },
})
