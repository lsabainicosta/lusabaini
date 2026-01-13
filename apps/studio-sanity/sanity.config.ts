import {createElement} from 'react'
import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {structureTool} from 'sanity/structure'
import TriggerWebhookButton from './components/TriggerWebhookButton'
import {schemaTypes} from './schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '0hp0ah4w'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

const singletonTypes = new Set([
  'siteSettings',
  'heroSection',
  'brandLogosSection',
  'servicesSection',
  'footerSettings',
  'aboutPage',
])

function WebhookTriggerTool() {
  return createElement(TriggerWebhookButton)
}

export default defineConfig({
  name: 'default',
  title: 'sanity',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            // Homepage Sections
            S.listItem()
              .title('Hero')
              .child(S.document().schemaType('heroSection').documentId('heroSection')),
            S.listItem()
              .title('Brand Logos')
              .child(S.document().schemaType('brandLogosSection').documentId('brandLogosSection')),
            S.listItem()
              .title('Services')
              .child(S.document().schemaType('servicesSection').documentId('servicesSection')),
            S.divider(),
            // Pages
            S.listItem()
              .title('About Page')
              .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.divider(),
            // Footer
            S.listItem()
              .title('Footer')
              .child(S.document().schemaType('footerSettings').documentId('footerSettings')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !singletonTypes.has(listItem.getId() as string),
            ),
          ]),
    }),
    visionTool(),
    colorInput(),
  ],

  tools: (prev) => [
    ...prev,
    {
      name: 'webhook-trigger',
      title: 'Webhook Trigger',
      component: WebhookTriggerTool as any,
    },
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((item) => !singletonTypes.has(item.templateId))
      }
      return prev
    },
    actions: (prev, {schemaType}) => {
      if (singletonTypes.has(schemaType)) {
        return prev.filter((action) => action.action !== 'delete' && action.action !== 'duplicate')
      }
      return prev
    },
  },
})
