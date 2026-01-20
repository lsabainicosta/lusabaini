import {createElement} from 'react'
import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import { type ListItemBuilder, structureTool, type StructureBuilder} from 'sanity/structure'
import TriggerWebhookButton from './components/TriggerWebhookButton'
import {schemaTypes} from './schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '0hp0ah4w'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

const singletonTypes = new Set([
  'brandingSection',
  'navigationSection',
  'socialMediaSection',
  'footerSection',
  'heroSection',
  'brandLogosSection',
  'servicesSection',
  'aboutPage',
  'aboutHeroSection',
  'aboutStorySection',
  'aboutValuesSection',
  'aboutJourneySection',
  'aboutCtaSection',
  'myWorkPage',
  'notFoundPage',
  'notFoundContentSection',
  'notFoundButtonsSection',
  'notFoundVisualSection',
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
    colorInput(),
    structureTool({
      structure: (S: StructureBuilder) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(
                S.list()
                  .title('Site Settings')
                  .items([
                    S.listItem()
                      .title('Branding')
                      .child(S.document().schemaType('brandingSection').documentId('brandingSection')),
                    S.listItem()
                      .title('Navigation')
                      .child(S.document().schemaType('navigationSection').documentId('navigationSection')),
                    S.listItem()
                      .title('Social Media')
                      .child(S.document().schemaType('socialMediaSection').documentId('socialMediaSection')),
                    S.listItem()
                      .title('Footer')
                      .child(S.document().schemaType('footerSection').documentId('footerSection')),
                  ])
              ),
            S.divider(),
            // Pages
            S.listItem()
            .title('Home Page')
            .child(
              S.list()
                .title('Home Page Sections')
                .items([
                  S.listItem()
                    .title('Hero')
                    .child(S.document().schemaType('heroSection').documentId('heroSection')),
                  S.listItem()
                    .title('Brand Logos')
                    .child(S.document().schemaType('brandLogosSection').documentId('brandLogosSection')),
                  S.listItem()
                    .title('Services')
                    .child(S.document().schemaType('servicesSection').documentId('servicesSection')),
                ])
            ),
            S.listItem()
              .title('About Page')
              .child(
                S.list()
                  .title('About Page Sections')
                  .items([
                    S.listItem()
                      .title('Hero')
                      .child(S.document().schemaType('aboutHeroSection').documentId('aboutHeroSection')),
                    S.listItem()
                      .title('Story')
                      .child(S.document().schemaType('aboutStorySection').documentId('aboutStorySection')),
                    S.listItem()
                      .title('Values & Philosophy')
                      .child(S.document().schemaType('aboutValuesSection').documentId('aboutValuesSection')),
                    S.listItem()
                      .title('Journey Timeline')
                      .child(S.document().schemaType('aboutJourneySection').documentId('aboutJourneySection')),
                    S.listItem()
                      .title('Call to Action')
                      .child(S.document().schemaType('aboutCtaSection').documentId('aboutCtaSection')),
                  ])
              ),
            S.listItem()
              .title('My Work Page')
              .child(S.document().schemaType('myWorkPage').documentId('myWorkPage')),
            S.listItem()
              .title('Not Found Page')
              .child(
                S.list()
                  .title('Not Found Page Sections')
                  .items([
                    S.listItem()
                      .title('Content')
                      .child(S.document().schemaType('notFoundContentSection').documentId('notFoundContentSection')),
                    S.listItem()
                      .title('Buttons')
                      .child(S.document().schemaType('notFoundButtonsSection').documentId('notFoundButtonsSection')),
                    S.listItem()
                      .title('Visual')
                      .child(S.document().schemaType('notFoundVisualSection').documentId('notFoundVisualSection')),
                  ])
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem: ListItemBuilder) => !singletonTypes.has(listItem.getId() as string),
            ),
          ]),
    }),
    visionTool(),
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
