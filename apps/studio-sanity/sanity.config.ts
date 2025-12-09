import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {structureTool} from 'sanity/structure'
import TriggerWebhookButton from './components/TriggerWebhookButton'
import {schemaTypes} from './schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '0hp0ah4w'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'sanity',

  projectId,
  dataset,

  plugins: [structureTool(), visionTool(), colorInput()],

  tools: (prev) => [
    ...prev,
    {
      name: 'webhook-trigger',
      title: 'Webhook Trigger',
      component: TriggerWebhookButton,
    },
  ],

  schema: {
    types: schemaTypes,
  },
})
