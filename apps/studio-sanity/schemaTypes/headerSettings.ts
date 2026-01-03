import {defineField, defineType} from 'sanity'

export const headerSettings = defineType({
  name: 'headerSettings',
  title: 'Header',
  type: 'document',
  initialValue: {
    navLinks: [
      {_type: 'navLink', href: '/', label: 'Home'},
      {_type: 'navLink', href: '/about', label: 'About'},
      {_type: 'navLink', href: '/my-work', label: 'My Work'},
      {_type: 'navLink', href: '/blog', label: 'Blog'},
    ],
    cta: {label: 'Book a call', href: '/book-a-call'},
  },
  fields: [
    defineField({
      name: 'navLinks',
      title: 'Navigation links',
      type: 'array',
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
    }),
    defineField({
      name: 'cta',
      title: 'CTA button',
      type: 'object',
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
      return {title: 'Header'}
    },
  },
})
