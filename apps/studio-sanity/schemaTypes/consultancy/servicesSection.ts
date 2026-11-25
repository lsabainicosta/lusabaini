import {defineField, defineType} from 'sanity'

const iconOptions = [
  {title: 'Passport / Visa', value: 'passport'},
  {title: 'Home / Housing', value: 'home'},
  {title: 'File / Bureaucracy', value: 'file'},
  {title: 'Users / Culture', value: 'users'},
  {title: 'Briefcase / Work', value: 'briefcase'},
  {title: 'Map / Orientation', value: 'map'},
]

export const servicesSection = defineType({
  name: 'servicesSection',
  title: 'Services',
  type: 'document',
  initialValue: {
    seoTitle: 'Serviços',
    seoDescription:
      'Consultoria para visto, moradia, burocracia e adaptação cultural na Holanda.',
    headline: 'Como posso te ajudar',
    intro:
      'Pacotes de orientação para cada etapa da sua jornada — da decisão de mudar até a vida estabelecida.',
  },
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'services',
      title: 'Services',
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
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {list: iconOptions},
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'icon'}},
        }),
      ],
    }),
    defineField({
      name: 'hourlyRate',
      title: 'Hourly rate (EUR, incl. VAT)',
      type: 'number',
      description: 'Shown on the services page and in the automatic reply. Default: 70.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'rateIncludes',
      title: 'What the hourly rate includes',
      type: 'text',
      rows: 2,
      description:
        'Default: "Inclui a pesquisa prévia sobre o seu caso e um resumo por escrito com links depois da sessão."',
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Free intro call booking link (Cal.com)',
      type: 'url',
      description: 'When empty, the "book a call" buttons link to the contact page instead.',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Services'}
    },
  },
})
