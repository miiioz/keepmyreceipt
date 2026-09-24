# KeepMyReceipt — Project Notes

## Product idea

KeepMyReceipt is a low-contact, self-service consumer utility for storing proof of purchase and tracking return/warranty dates.

Core promise:

> Never lose a receipt or miss a warranty again.

## Current product direction

- Mobile-first PWA, not a desktop dashboard.
- Public app link, but user data remains local to each device.
- No account or cloud database in the MVP.
- Keep technical complexity low, consistent with `chuanma-scorer` and `med-tracker`.
- Static app deployed from GitHub Pages `main` / `/root`.
- IndexedDB is used instead of localStorage because receipt images/PDFs can be large.

## MVP scope

1. Add/edit/delete a purchase.
2. Take/upload receipt image or PDF.
3. Store item, retailer, price, currency and purchase date.
4. Calculate return deadline from a return-window length.
5. Calculate warranty expiry from warranty length.
6. Save serial number and notes.
7. Search/filter purchases.
8. Show receipt previews.
9. Export a complete JSON backup including receipt files.
10. Restore a backup on the same or another device.
11. Installable PWA and basic offline shell.

## Privacy model

- No server database.
- No account.
- No analytics/tracking in MVP.
- Purchases and receipts stay in browser IndexedDB.
- The public GitHub code repository does not contain user data.
- Clearing browser/site data can delete local records, so backup is important.

## Monetisation hypothesis

Do not add payments until the utility is validated through real use.

Potential later model:

### Free
- limited number of purchases
- manual entry
- basic reminders

### Pro — possible one-time purchase
- unlimited purchases
- smarter scanning/OCR
- claim-pack PDF export
- advanced reminders

### Optional recurring service
Only for features that create ongoing infrastructure cost:
- encrypted sync
- family sharing
- email receipt import
- cloud backup

## Later opportunities

- on-device OCR
- notifications
- claim-pack PDF
- insurance inventory
- resale listing helper
- encrypted optional sync
- iOS/native wrapper only if PWA limitations become material

## Non-goals for now

- no complex authentication
- no cloud backend
- no subscription billing
- no ads
- no selling purchase data
- no large AI feature set before usage validation

## Architecture decision — 24 Sep 2026

The initial prototype used React + Vite. It was simplified to a static PWA after comparing it with `chuanma-scorer` and `med-tracker`.

Reason: the first version does not need a framework. Static HTML/CSS/JS is easier to deploy, inspect and maintain, and supports `main` / `/root` GitHub Pages hosting directly.
