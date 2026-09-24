# KeepMyReceipt

Private-first receipt, warranty and purchase tracker.

> Never lose a receipt or miss a warranty again.

## MVP
KeepMyReceipt is currently a local-first web MVP. It stores purchase records and receipt files in the browser using IndexedDB.

Current features:
- add, edit and delete purchases
- save receipt images or PDFs
- track purchase price and retailer
- calculate return deadlines
- calculate warranty expiry
- save serial numbers and notes
- search and filter purchases
- responsive mobile/desktop interface
- no account, analytics or server database

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production output is written to `dist/` and can be deployed to Cloudflare Pages or another static host.

## Privacy note
MVP data stays in the browser on the current device. Clearing site/browser storage can delete records, so export/backup is a priority before public release.

## Product roadmap
See [`PROJECT_NOTES.md`](./PROJECT_NOTES.md) for scope, monetisation assumptions and next milestones.
