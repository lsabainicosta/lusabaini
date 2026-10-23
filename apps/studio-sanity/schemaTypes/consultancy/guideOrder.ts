import {defineField, defineType} from 'sanity'

const statusTitles: Record<string, string> = {
  pending: 'Aguardando pagamento',
  paid: 'Pago',
  sent: 'Enviado',
}

// Created by the website's order form; only the status is meant to be edited.
export const guideOrder = defineType({
  name: 'guideOrder',
  title: 'Guide Order',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: Object.entries(statusTitles).map(([value, title]) => ({value, title})),
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({name: 'orderRef', title: 'Order number', type: 'string', readOnly: true}),
    defineField({name: 'name', title: 'Name', type: 'string', readOnly: true}),
    defineField({name: 'email', title: 'E-mail', type: 'string', readOnly: true}),
    defineField({name: 'guideTitle', title: 'Guide', type: 'string', readOnly: true}),
    defineField({
      name: 'guide',
      title: 'Guide document',
      type: 'reference',
      to: [{type: 'tourGuide'}],
      weak: true,
      readOnly: true,
    }),
    defineField({name: 'price', title: 'Price (EUR)', type: 'number', readOnly: true}),
    defineField({name: 'createdAt', title: 'Ordered at', type: 'datetime', readOnly: true}),
    defineField({name: 'notes', title: 'Notes', type: 'text', rows: 3}),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {orderRef: 'orderRef', name: 'name', status: 'status', guideTitle: 'guideTitle'},
    prepare({orderRef, name, status, guideTitle}) {
      return {
        title: `${orderRef ?? ''} — ${name ?? ''}`,
        subtitle: `${statusTitles[status] ?? status ?? ''} · ${guideTitle ?? ''}`,
      }
    },
  },
})
