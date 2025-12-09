FROM node:22-alpine AS base

ARG PNPM_VERSION=10.20.0
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=${PNPM_HOME}:$PATH

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app

FROM base AS deps

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/studio-sanity/package.json ./apps/studio-sanity/package.json
COPY apps/nextjs/package.json ./apps/nextjs/package.json

RUN pnpm install --frozen-lockfile

FROM deps AS builder

ENV SANITY_STUDIO_PROJECT_ID=0hp0ah4w
ENV SANITY_STUDIO_DATASET=production
ARG SANITY_STUDIO_WEBHOOK_URL
ENV SANITY_STUDIO_WEBHOOK_URL=${SANITY_STUDIO_WEBHOOK_URL}

COPY . .
RUN pnpm --filter sanity run build

FROM base AS runner

WORKDIR /app

# Use a static server with SPA fallback so /structure and other client routes work.
RUN pnpm add --global serve@14.2.0

COPY --from=builder /app/apps/studio-sanity/dist ./dist
COPY --from=builder /app/apps/studio-sanity/package.json ./package.json

EXPOSE 3333

# -s enables single-page app fallback to index.html
# --cors is optional; helps when embedding from another origin.
CMD ["serve", "-s", "dist", "-l", "3333", "--cors"]
