# KeepMyReceipt

Private-first receipt, warranty and purchase tracker.

> Never lose a receipt or miss a warranty again.

## First MVP
KeepMyReceipt is a local-first installable web app. The app itself can be publicly hosted, while each user's purchase records and receipt files stay inside that user's browser using IndexedDB.

Current features:
- add, edit and delete purchases
- photograph or upload receipt images/PDFs
- receipt image previews
- track purchase price, currency and retailer
- calculate return deadlines
- calculate warranty expiry
- save serial numbers and notes
- search and filter purchases
- export a complete JSON backup, including receipt files
- restore a KeepMyReceipt JSON backup on another browser/device
- installable PWA metadata and offline service worker
- responsive mobile/desktop interface
- no account, analytics or server database

## Public-link architecture
The intended first deployment mirrors the simple Chuanma setup:

1. GitHub hosts the public app code.
2. GitHub Pages serves the app at `https://miiioz.github.io/keepmyreceipt/`.
3. IndexedDB stores each user's private data locally on their own device.
4. Backup/Restore is used to move data between devices or protect against browser-data deletion.

A public repo/public web link does **not** publish the user's purchase or receipt data.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production output is written to `dist/`.

## GitHub Pages
A Pages deployment workflow is included at `.github/workflows/pages.yml`. The Vite base path is already configured for `/keepmyreceipt/`.

Before first deployment:
- make the repository public (or use a GitHub plan that supports Pages for private repositories)
- enable GitHub Pages with **GitHub Actions** as the source
- run/re-run the **Deploy Pages** workflow

## Privacy and backup
MVP data stays in the browser on the current device. Clearing site/browser storage can delete records. Use **Backup** to export a JSON file periodically. The backup contains the purchase records and embedded receipt files, so keep it somewhere private.

## Product roadmap
See [`PROJECT_NOTES.md`](./PROJECT_NOTES.md) for scope, monetisation assumptions and next milestones.
