# PR Mebel web monorepo

This repository contains the PR Mebel promotional site and shared packages. The workspace uses pnpm and Turborepo; the promo application is under `apps/promo/`.

## Local development

```sh
pnpm install
pnpm dev
```

Set application-specific values in your local environment. Never commit `.env` files or production credentials. Deployment configuration is managed separately from the source tree.
