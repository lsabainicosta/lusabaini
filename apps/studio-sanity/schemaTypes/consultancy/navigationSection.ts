import {defineField, defineType} from 'sanity'

export const navigationSection = defineType({
  name: 'navigationSection',
  title: 'Navigation',
  type: 'document',
  initialValue: {
    mainNavigation: [
      {_type: 'navLink', href: '/', label: 'Início'},
      {_type: 'navLink', href: '/servicos', label: 'Serviços'},
      {_type: 'navLink', href: '/sobre', label: 'Sobre'},
      {_type: 'navLink', href: '/guias', label: 'Guias'},
    ],
    ctaButton: {label: 'Agendar conversa', href: '/contato'},
  },
  fields: [
    defineField({
      name: 'mainNavigation',
      title: 'Main Navigation',
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
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'href', title: 'Href', type: 'string'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Navigation'}
    },
  },
})
