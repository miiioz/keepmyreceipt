# KeepMyReceipt — Project Notes

## Product idea
A private-first purchase vault for receipts, return windows, warranties, serial numbers and later insurance/resale records.

Core promise:

> Never lose a receipt or miss a warranty again.

## Product principles
- Privacy-first: purchase data should stay on-device by default.
- Low-friction: adding a purchase should take under 30 seconds.
- No account required for the free/local version.
- Avoid subscription fatigue: local Pro features should favour one-time purchase; recurring fees should only fund recurring cloud services.
- Self-service product with minimal support burden.

## MVP 0.1 — current scope
- Add purchase
- Edit purchase
- Delete purchase
- Store item, retailer, category, price and currency
- Purchase date
- Return-window tracking
- Warranty tracking
- Serial number
- Notes
- Receipt image/PDF upload
- Search
- Filters for returns, warranties and expired coverage
- Local IndexedDB storage
- Responsive desktop/mobile UI

## Data/privacy architecture
MVP stores all purchase records and receipt files in browser IndexedDB. There is currently:
- no account
- no analytics
- no server database
- no receipt upload API

Important limitation: clearing browser/site storage can delete local records. Backup/export should be added before public launch.

## Monetisation hypothesis
### Free
- Up to 15 saved purchases
- Manual entry
- Basic return/warranty tracking

### Pro — target NZ$19.99 lifetime
- Unlimited purchases
- Receipt OCR / automatic extraction
- Multiple/custom reminders
- Serial-number search
- Claim Pack PDF export
- Backup/export

### Cloud — later optional annual plan
Only if ongoing infrastructure is introduced:
- encrypted sync
- multi-device access
- email receipt import
- family sharing

### Business — later
Potential NZ$39/year tier for sole traders/small businesses:
- equipment register
- receipt archive
- serial numbers
- GST/export fields
- insurance inventory/claim pack

## Roadmap
### 0.2 — make it safe to rely on
- JSON backup/export and import
- Better date validation
- Duplicate detection
- Receipt thumbnail/preview
- Installable PWA shell

### 0.3 — smart capture
- On-device OCR where practical
- Extract merchant/date/amount automatically
- Suggested product name/category
- Camera-first mobile capture flow

### 0.4 — reminders
- Browser/device notification support where available
- Configurable reminder lead time
- Return deadline and warranty expiry timeline

### 0.5 — paid-value features
- Claim Pack PDF
- Unlimited-item entitlement
- Resale record/export
- Product ownership timeline

## Deployment
Recommended first deployment: Cloudflare Pages.

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

## Do not build yet
Avoid expanding into these until the MVP is validated:
- full budgeting
- retailer price comparison
- marketplace listings
- cloud accounts
- team collaboration
- AI chat assistant
- complex inventory management
