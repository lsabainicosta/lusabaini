import {DocumentActionComponent, DocumentActionDescription} from 'sanity'
import {useState} from 'react'

export const triggerWebhookAction =
  (webhookUrl?: string): DocumentActionComponent =>
  (props) => {
    const [isRunning, setIsRunning] = useState(false)
    const [dialog, setDialog] = useState<DocumentActionDescription['dialog']>()

    const resolvedWebhookUrl = webhookUrl ?? process.env.SANITY_STUDIO_WEBHOOK_URL

    return {
      label: isRunning ? 'Triggering…' : 'Trigger Webhook',
      disabled: isRunning || !resolvedWebhookUrl,
      title: !resolvedWebhookUrl
        ? 'Set SANITY_STUDIO_WEBHOOK_URL to enable'
        : 'Send webhook for this document',
      onHandle: async () => {
        if (!resolvedWebhookUrl) {
          setDialog({
            type: 'dialog',
            header: 'Webhook URL missing',
            content: (
              <p>Set SANITY_STUDIO_WEBHOOK_URL or pass an override to enable this action.</p>
            ),
            onClose: () => setDialog(undefined),
          })
          return
        }

        setIsRunning(true)

        try {
          const payload = {
            source: 'sanity-studio-document-action',
            triggeredAt: new Date().toISOString(),
            documentId: props.id,
            documentType: props.type,
            revision: props.draft?._rev ?? props.published?._rev,
            isDraft: Boolean(props.draft),
            isPublished: Boolean(props.published),
          }

          const response = await fetch(resolvedWebhookUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
          })

          if (!response.ok) {
            const text = await response.text()
            throw new Error(text || `Request failed with status ${response.status}`)
          }

          setDialog({
            type: 'dialog',
            header: 'Webhook triggered',
            content: <p>The webhook was triggered successfully.</p>,
            onClose: () => setDialog(undefined),
          })
          props.onComplete?.()
        } catch (error) {
          const description = error instanceof Error ? error.message : 'Unknown error'
          setDialog({
            type: 'dialog',
            header: 'Webhook failed',
            content: <p>{description}</p>,
            onClose: () => setDialog(undefined),
          })
          setIsRunning(false)
        }
      },
      dialog,
    }
  }
