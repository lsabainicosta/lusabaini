import React, {useMemo, useState} from 'react'
import {Button, Card, Stack, Text} from '@sanity/ui'

type TriggerWebhookButtonProps = {
  /**
   * Optional override for the webhook endpoint.
   * Defaults to SANITY_STUDIO_WEBHOOK_URL from the environment.
   */
  webhookUrl?: string
  /**
   * Optional payload to send. Defaults to a small metadata object.
   */
  payload?: Record<string, unknown>
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const TriggerWebhookButton = ({webhookUrl, payload}: TriggerWebhookButtonProps) => {
  const resolvedWebhookUrl = useMemo(
    () => webhookUrl ?? process.env.SANITY_STUDIO_WEBHOOK_URL,
    [webhookUrl],
  )
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const handleTrigger = async () => {
    if (!resolvedWebhookUrl) {
      setStatus('error')
      setMessage('Missing webhook URL. Set SANITY_STUDIO_WEBHOOK_URL or pass webhookUrl.')
      return
    }

    setStatus('loading')
    setMessage(null)

    try {
      const response = await fetch(resolvedWebhookUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
          payload ?? {
            source: 'sanity-studio',
            triggeredAt: new Date().toISOString(),
          },
        ),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `Request failed with status ${response.status}`)
      }

      setStatus('success')
      setMessage('Webhook triggered successfully.')
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Unknown error'
      setStatus('error')
      setMessage(description)
    }
  }

  const toneColor =
    status === 'error'
      ? 'var(--card-critical-fg-color, #c72a2a)'
      : status === 'success'
        ? 'var(--card-positive-fg-color, #2f8f46)'
        : 'inherit'

  return (
    <Card padding={4} radius={3} shadow={1}>
      <Stack space={4}>
        <Stack space={2}>
          <Text size={2} weight="semibold">
            Trigger Webhook
          </Text>
          <Text size={1} muted>
            Sends a POST request to the configured webhook URL. Configure with
            SANITY_STUDIO_WEBHOOK_URL or pass a webhookUrl prop.
          </Text>
        </Stack>

        {message && (
          <Text size={1} style={{color: toneColor}}>
            {message}
          </Text>
        )}

        {!resolvedWebhookUrl && (
          <Text size={1} style={{color: 'var(--card-critical-fg-color, #c72a2a)'}}>
            Set SANITY_STUDIO_WEBHOOK_URL to enable the trigger.
          </Text>
        )}

        <Button
          text={status === 'loading' ? 'Sending…' : 'Trigger Webhook'}
          tone="primary"
          loading={status === 'loading'}
          disabled={!resolvedWebhookUrl || status === 'loading'}
          onClick={handleTrigger}
        />
      </Stack>
    </Card>
  )
}

export default TriggerWebhookButton
