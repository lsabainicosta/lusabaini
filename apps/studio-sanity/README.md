# Sanity Studio

This Studio is configured to be hosted on Sanity (`*.sanity.studio`) instead of running in Docker.

## Local development

```bash
pnpm --filter sanity dev
```

## First-time hosted deploy (interactive)

Run this once from the Studio folder to choose your hostname:

```bash
cd apps/studio-sanity
pnpm run deploy
```

During the prompt, pick a hostname (example: `lusabaini`).

## CI/CD hosted deploy

The GitHub workflow deploys Studio automatically on pushes to `main` when these repository secrets are set:

- `SANITY_AUTH_TOKEN` (deploy token from Sanity project management)
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `SANITY_STUDIO_HOSTNAME` (the hostname chosen during first deploy, without `.sanity.studio`)

Optional:

- `SANITY_STUDIO_APP_ID`
- `SANITY_STUDIO_WEBHOOK_URL`

`apps/studio-sanity/sanity.cli.ts` reads these values and deploys to the configured host.

## Notes

- No Studio container is needed in `docker-compose.prod.yml` anymore.
- The public site (`nextjs`) still reads content from Sanity Content Lake as before.
