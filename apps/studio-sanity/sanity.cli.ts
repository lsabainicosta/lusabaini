import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '0hp0ah4w'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const appId = process.env.SANITY_STUDIO_APP_ID
const studioHost = process.env.SANITY_STUDIO_HOSTNAME

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  ...(studioHost ? {studioHost} : {}),
  deployment: {
    /**
     * Add an appId from https://www.sanity.io/manage/project/<projectId>/studios
     * to pin updates and avoid the warning. When missing, CLI will auto-update.
     */
    autoUpdates: true,
    ...(appId ? {appId} : {}),
  },
})
