import {defineField, defineType} from 'sanity'

export const clientResult = defineType({
  name: 'clientResult',
  title: 'Client Result',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      description: 'Only used in Sanity Studio for identifying this result.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'badgeLabel',
      title: 'Badge label',
      type: 'string',
      description: 'Small label above the headline (e.g. “Client results”).',
      initialValue: 'Client results',
    }),
    defineField({
      name: 'headlineStart',
      title: 'Headline (start)',
      type: 'string',
      description: 'Headline text before the emphasized word/phrase.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Headline (emphasis)',
      type: 'string',
      description: 'The emphasized word/phrase shown in italic serif.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headlineEnd',
      title: 'Headline (end)',
      type: 'string',
      description: 'Headline text after the emphasized word/phrase (optional).',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short paragraph explaining the context and outcome.',
    }),
    defineField({
      name: 'clientName',
      title: 'Client name',
      type: 'string',
      description: 'Used for previews and optional image overlay text.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Optional label shown on the Case Studies cards (e.g. “Beauty”, “Technology”).',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Brief description of the image for accessibility.',
        }),
      ],
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      description:
        'Optional. Upload a video instead of an image. If provided, the website will show the video (muted, looping).',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'imageOverlayText',
      title: 'Image overlay text',
      type: 'string',
      description: 'Optional centered text rendered over the image (defaults to client name).',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      description: 'Key result metrics shown beneath the description.',
      of: [
        defineField({
          name: 'stat',
          title: 'Stat',
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'e.g. “128K”, “245%”',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. “Reel Views”, “Engagement”',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'subLabel',
              title: 'Sub label',
              type: 'string',
              description: 'Small helper line, e.g. “In the first 30 days”',
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'value'},
          },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers show first on the homepage. If empty, newest items come first.',
    }),
    defineField({
      name: 'socials',
      title: 'Social Media Links',
      type: 'array',
      description: 'Social media links specific to this client project (e.g. specific posts).',
      of: [
        defineField({
          name: 'social',
          title: 'Social',
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'X (Twitter)', value: 'x'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Email', value: 'email'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              validation: (Rule) =>
                Rule.required().custom((value, context) => {
                  if (!value) return true;
                  // Allow mailto: links for email icons
                  if (typeof value === 'string' && value.startsWith('mailto:')) {
                    return true;
                  }
                  // Validate as URL for other cases
                  try {
                    new URL(value);
                    return true;
                  } catch {
                    return 'Must be a valid URL or mailto: link';
                  }
                }),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Used for accessibility (e.g. "View post on Instagram").',
            }),
            defineField({
              name: 'emailSubject',
              title: 'Email Subject',
              type: 'string',
              description: 'Optional default subject for email links. Only used when icon is "Email".',
              hidden: ({parent}) => parent?.icon !== 'email',
            }),
            defineField({
              name: 'emailBody',
              title: 'Email Body',
              type: 'text',
              rows: 3,
              description: 'Optional default body text for email links. Only used when icon is "Email".',
              hidden: ({parent}) => parent?.icon !== 'email',
            }),
          ],
          preview: {
            select: {title: 'icon', subtitle: 'href'},
            prepare({title, subtitle}) {
              const platformNames: Record<string, string> = {
                instagram: 'Instagram',
                tiktok: 'TikTok',
                youtube: 'YouTube',
                x: 'X (Twitter)',
                linkedin: 'LinkedIn',
                facebook: 'Facebook',
                email: 'Email',
              }
              return {
                title: platformNames[title] || title,
                subtitle,
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'additionalVideos',
      title: 'Additional Videos',
      type: 'array',
      description: 'Gallery of videos shown beneath the project info.',
      of: [
        {
          type: 'file',
          options: {
            accept: 'video/*',
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'internalTitle',
      subtitle: 'clientName',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Client result',
        subtitle: subtitle || undefined,
        media,
      }
    },
  },
})
