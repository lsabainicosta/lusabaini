import {createElement} from 'react'
import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {markdownSchema} from 'sanity-plugin-markdown'
import {type ListItemBuilder, structureTool, type StructureBuilder} from 'sanity/structure'
import DeployContentButton from './components/DeployContentButton'
import {schemaTypes} from './schemaTypes'
import {
  consultancySchemaTypes,
  consultancySingletonTypes,
} from './schemaTypes/consultancy'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '0hp0ah4w'
const portfolioDataset = process.env.SANITY_STUDIO_DATASET || 'production'
const consultancyDataset = 'consultancy'

const portfolioSingletonTypes = new Set([
  'brandingSection',
  'navigationSection',
  'socialMediaSection',
  'footerSection',
  'heroSection',
  'brandLogosSection',
  'aboutPage',
  'aboutHeroSection',
  'aboutStorySection',
  'aboutValuesSection',
  'myWorkPage',
  'contactPage',
  'notFoundPage',
  'notFoundContentSection',
  'notFoundButtonsSection',
  'notFoundVisualSection',
  'linktreePage',
])

function DeployContentTool() {
  return createElement(DeployContentButton)
}

const deployContentTool = {
  name: 'deploy-content',
  title: 'Deploy content',
  component: DeployContentTool as any,
}

function portfolioStructure(S: StructureBuilder) {
  return S.list()
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
                .child(
                  S.document().schemaType('navigationSection').documentId('navigationSection'),
                ),
              S.listItem()
                .title('Social Media')
                .child(
                  S.document().schemaType('socialMediaSection').documentId('socialMediaSection'),
                ),
              S.listItem()
                .title('Footer')
                .child(S.document().schemaType('footerSection').documentId('footerSection')),
            ]),
        ),
      S.divider(),
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
                .child(
                  S.document().schemaType('brandLogosSection').documentId('brandLogosSection'),
                ),
            ]),
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
                .child(
                  S.document().schemaType('aboutStorySection').documentId('aboutStorySection'),
                ),
              S.listItem()
                .title('Values & Philosophy')
                .child(
                  S.document().schemaType('aboutValuesSection').documentId('aboutValuesSection'),
                ),
            ]),
        ),
      S.listItem()
        .title('My Work Page')
        .child(S.document().schemaType('myWorkPage').documentId('myWorkPage')),
      S.listItem()
        .title('Contact Page')
        .child(S.document().schemaType('contactPage').documentId('contactPage')),
      S.listItem()
        .title('Not Found Page')
        .child(
          S.list()
            .title('Not Found Page Sections')
            .items([
              S.listItem()
                .title('Content')
                .child(
                  S.document()
                    .schemaType('notFoundContentSection')
                    .documentId('notFoundContentSection'),
                ),
              S.listItem()
                .title('Buttons')
                .child(
                  S.document()
                    .schemaType('notFoundButtonsSection')
                    .documentId('notFoundButtonsSection'),
                ),
              S.listItem()
                .title('Visual')
                .child(
                  S.document()
                    .schemaType('notFoundVisualSection')
                    .documentId('notFoundVisualSection'),
                ),
            ]),
        ),
      S.listItem()
        .title('Linktree Page')
        .child(S.document().schemaType('linktreePage').documentId('linktreePage')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem: ListItemBuilder) => !portfolioSingletonTypes.has(listItem.getId() as string),
      ),
    ])
}

function consultancyStructure(S: StructureBuilder) {
  return S.list()
    .title('Consultancy')
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
                .child(
                  S.document().schemaType('navigationSection').documentId('navigationSection'),
                ),
              S.listItem()
                .title('Footer')
                .child(S.document().schemaType('footerSection').documentId('footerSection')),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Home')
        .child(
          S.list()
            .title('Home Sections')
            .items([
              S.listItem()
                .title('Hero')
                .child(S.document().schemaType('heroSection').documentId('heroSection')),
              S.listItem()
                .title('Process')
                .child(S.document().schemaType('processSection').documentId('processSection')),
              S.listItem()
                .title('FAQ')
                .child(S.document().schemaType('faqSection').documentId('faqSection')),
            ]),
        ),
      S.listItem()
        .title('Services')
        .child(S.document().schemaType('servicesSection').documentId('servicesSection')),
      S.listItem()
        .title('About')
        .child(S.document().schemaType('aboutSection').documentId('aboutSection')),
      S.listItem()
        .title('Contact')
        .child(S.document().schemaType('contactPage').documentId('contactPage')),
      S.divider(),
      S.listItem()
        .title('Testimonials')
        .child(S.documentTypeList('testimonial').title('Testimonials')),
      S.listItem()
        .title('Tour Guides')
        .child(S.documentTypeList('tourGuide').title('Tour Guides')),
    ])
}

function singletonDocumentActions(singletonTypes: Set<string>) {
  return {
    newDocumentOptions: (prev: any, {creationContext}: any) => {
      if (creationContext.type === 'global') {
        return prev.filter((item: any) => !singletonTypes.has(item.templateId))
      }
      return prev
    },
    actions: (prev: any, {schemaType}: any) => {
      if (singletonTypes.has(schemaType)) {
        return prev.filter(
          (action: any) => action.action !== 'delete' && action.action !== 'duplicate',
        )
      }
      return prev
    },
  }
}

export default defineConfig([
  {
    name: 'default',
    title: 'Portfolio',
    basePath: '/portfolio',
    projectId,
    dataset: portfolioDataset,
    plugins: [
      colorInput(),
      markdownSchema(),
      structureTool({structure: portfolioStructure}),
      visionTool(),
    ],
    tools: (prev) => [...prev, deployContentTool],
    schema: {types: schemaTypes},
    document: singletonDocumentActions(portfolioSingletonTypes),
  },
  {
    name: 'consultancy',
    title: 'Consultancy',
    basePath: '/consultancy',
    projectId,
    dataset: consultancyDataset,
    plugins: [colorInput(), structureTool({structure: consultancyStructure}), visionTool()],
    tools: (prev) => [...prev, deployContentTool],
    schema: {types: consultancySchemaTypes},
    document: singletonDocumentActions(consultancySingletonTypes),
  },
])
