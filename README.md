# KeepMyReceipt

A private-first receipt, return-window and warranty tracker designed as a small mobile PWA.

> Never lose a receipt or miss a warranty again.

## Current architecture

KeepMyReceipt intentionally uses the same lightweight approach as the user's other small tools:

- static HTML/CSS/JavaScript
- no React or build step
- deployed directly from GitHub Pages (`main` / `/root`)
- installable PWA
- IndexedDB for local purchase records and receipt files
- no account, tracking, analytics or server database

## MVP features

- mobile-first app interface
- take a photo or upload a receipt/PDF
- add/edit/delete purchases
- purchase price, retailer, category and serial number
- automatic return deadline
- automatic warranty expiry
- receipt image preview
- search and filters
- local IndexedDB storage
- JSON backup/restore including receipt files
- offline shell via service worker

## GitHub Pages

Use:

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/ (root)`

The public app URL is:

`https://miiioz.github.io/keepmyreceipt/`

## Privacy

Purchase records and receipt files stay in the browser on the current device. A public GitHub repository or public app URL does **not** publish user purchase data.

Clearing site/browser data can erase local records. Use **Settings → Export backup** periodically.

## Project roadmap

See [`PROJECT_NOTES.md`](./PROJECT_NOTES.md).
