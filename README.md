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

## Quick capture on iPhone

- Open **Quick note or dictation** and use the microphone on the iPhone keyboard. Try `今天在 New World 花了 36 刀`. Tap **Fill purchase details**, check the draft and save. For a standalone note, tap **Save as memo**. Memos appear on Home and are included in backups. A Shortcut with an **Open URLs** action can open `https://miiioz.github.io/keepmyreceipt/?quick=1` directly.
- Use **Take photo** for paper receipts or **Choose receipt or screenshot** for images from Photos. Tap **Read receipt** to scan an image. English and simplified Chinese recognition runs in the browser. The recognition engine and language files download when needed. PDFs can still be saved as attachments.
- If a receipt matches an existing purchase without a receipt by amount, currency and date, tap **Attach to …**, then **Save changes**. If the match is missing, open the original purchase and choose its receipt directly.
- For a return reminder, save the purchase with a reminder title and date/time. Reopen it and use **Open calendar file** to export an event with an alert. Import the event into your calendar. Calendar links can open the associated purchase where the browser has access to the saved record.
