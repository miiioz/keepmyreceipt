import { useEffect, useMemo, useState } from 'react'
import {
  Archive,
  CalendarClock,
  Camera,
  CheckCircle2,
  FileText,
  Package,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import { deletePurchase, getPurchases, savePurchase } from './storage'

const EMPTY_FORM = {
  itemName: '',
  retailer: '',
  category: 'Electronics',
  amount: '',
  currency: 'NZD',
  purchaseDate: new Date().toISOString().slice(0, 10),
  returnDays: '30',
  warrantyMonths: '12',
  serialNumber: '',
  notes: '',
  receiptBlob: null,
  receiptName: '',
  receiptType: '',
}

const CATEGORIES = ['Electronics', 'Appliances', 'Home', 'Clothing', 'Tools', 'Travel', 'Other']
const CURRENCIES = ['NZD', 'AUD', 'USD', 'CNY', 'GBP', 'EUR']

function addDays(dateString, days) {
  if (!dateString || !Number(days)) return null
  const d = new Date(`${dateString}T12:00:00`)
  d.setDate(d.getDate() + Number(days))
  return d
}

function addMonths(dateString, months) {
  if (!dateString || !Number(months)) return null
  const d = new Date(`${dateString}T12:00:00`)
  d.setMonth(d.getMonth() + Number(months))
  return d
}

function daysFromNow(date) {
  if (!date) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target - now) / 86400000)
}

function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function formatMoney(value, currency) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: currency || 'NZD',
    maximumFractionDigits: 2,
  }).format(amount)
}

function getStatus(purchase) {
  const returnDate = addDays(purchase.purchaseDate, purchase.returnDays)
  const warrantyDate = addMonths(purchase.purchaseDate, purchase.warrantyMonths)
  const returnDaysLeft = daysFromNow(returnDate)
  const warrantyDaysLeft = daysFromNow(warrantyDate)

  if (returnDaysLeft !== null && returnDaysLeft >= 0 && returnDaysLeft <= 14) {
    return { tone: 'urgent', text: `Return in ${returnDaysLeft}d` }
  }
  if (warrantyDaysLeft !== null && warrantyDaysLeft >= 0 && warrantyDaysLeft <= 60) {
    return { tone: 'warning', text: `Warranty in ${warrantyDaysLeft}d` }
  }
  if (warrantyDaysLeft !== null && warrantyDaysLeft < 0) {
    return { tone: 'muted', text: 'Warranty expired' }
  }
  return { tone: 'good', text: 'Covered' }
}

function PurchaseModal({ purchase, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...(purchase || {}) }))
  const [saving, setSaving] = useState(false)

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.itemName.trim() || !form.purchaseDate) return

    setSaving(true)
    const record = {
      ...form,
      id: purchase?.id || crypto.randomUUID(),
      itemName: form.itemName.trim(),
      retailer: form.retailer.trim(),
      amount: form.amount === '' ? '' : Number(form.amount),
      returnDays: form.returnDays === '' ? 0 : Number(form.returnDays),
      warrantyMonths: form.warrantyMonths === '' ? 0 : Number(form.warrantyMonths),
      updatedAt: new Date().toISOString(),
      createdAt: purchase?.createdAt || new Date().toISOString(),
    }
    await savePurchase(record)
    await onSaved()
    setSaving(false)
    onClose()
  }

  function handleReceipt(event) {
    const file = event.target.files?.[0]
    if (!file) return
    update('receiptBlob', file)
    setForm((current) => ({
      ...current,
      receiptBlob: file,
      receiptName: file.name,
      receiptType: file.type,
    }))
  }

  const returnDate = addDays(form.purchaseDate, form.returnDays)
  const warrantyDate = addMonths(form.purchaseDate, form.warrantyMonths)

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">PURCHASE RECORD</span>
            <h2>{purchase ? 'Edit purchase' : 'Add a purchase'}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="field field-wide">
              <span>Item name *</span>
              <input
                autoFocus
                value={form.itemName}
                onChange={(e) => update('itemName', e.target.value)}
                placeholder="e.g. Dyson V10 Absolute"
                required
              />
            </label>

            <label className="field">
              <span>Retailer</span>
              <input
                value={form.retailer}
                onChange={(e) => update('retailer', e.target.value)}
                placeholder="Noel Leeming"
              />
            </label>

            <label className="field">
              <span>Category</span>
              <select value={form.category} onChange={(e) => update('category', e.target.value)}>
                {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>

            <label className="field">
              <span>Purchase price</span>
              <div className="money-input">
                <select value={form.currency} onChange={(e) => update('currency', e.target.value)}>
                  {CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => update('amount', e.target.value)}
                  placeholder="699.00"
                />
              </div>
            </label>

            <label className="field">
              <span>Purchase date *</span>
              <input
                type="date"
                value={form.purchaseDate}
                onChange={(e) => update('purchaseDate', e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span>Return window (days)</span>
              <input
                type="number"
                min="0"
                value={form.returnDays}
                onChange={(e) => update('returnDays', e.target.value)}
              />
              <small>{returnDate ? `Return by ${formatDate(returnDate)}` : 'No return reminder'}</small>
            </label>

            <label className="field">
              <span>Warranty (months)</span>
              <input
                type="number"
                min="0"
                value={form.warrantyMonths}
                onChange={(e) => update('warrantyMonths', e.target.value)}
              />
              <small>{warrantyDate ? `Covered until ${formatDate(warrantyDate)}` : 'No warranty reminder'}</small>
            </label>

            <label className="field field-wide">
              <span>Serial number</span>
              <input
                value={form.serialNumber}
                onChange={(e) => update('serialNumber', e.target.value)}
                placeholder="Optional"
              />
            </label>

            <label className="field field-wide upload-field">
              <span>Receipt</span>
              <input
                className="file-input"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleReceipt}
              />
              <div className="upload-box">
                <Camera size={22} />
                <div>
                  <strong>{form.receiptName || 'Upload or photograph receipt'}</strong>
                  <small>JPG, PNG or PDF. Stored only on this device.</small>
                </div>
              </div>
            </label>

            <label className="field field-wide">
              <span>Notes</span>
              <textarea
                rows="3"
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                placeholder="Accessories, extended cover, claim notes…"
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="button secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="button primary" disabled={saving}>
              {saving ? 'Saving…' : purchase ? 'Save changes' : 'Add purchase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PurchaseCard({ purchase, onEdit, onDelete }) {
  const status = getStatus(purchase)
  const returnDate = addDays(purchase.purchaseDate, purchase.returnDays)
  const warrantyDate = addMonths(purchase.purchaseDate, purchase.warrantyMonths)

  function openReceipt() {
    if (!purchase.receiptBlob) return
    const url = URL.createObjectURL(purchase.receiptBlob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(url), 60000)
  }

  return (
    <article className="purchase-card">
      <div className="card-topline">
        <div className="category-icon"><Package size={19} /></div>
        <span className={`status ${status.tone}`}>{status.text}</span>
      </div>

      <div className="card-title">
        <div>
          <h3>{purchase.itemName}</h3>
          <p>{purchase.retailer || purchase.category}</p>
        </div>
        <strong>{purchase.amount !== '' ? formatMoney(purchase.amount, purchase.currency) : '—'}</strong>
      </div>

      <div className="card-dates">
        <div>
          <span>Purchased</span>
          <strong>{formatDate(purchase.purchaseDate)}</strong>
        </div>
        <div>
          <span>Return by</span>
          <strong>{returnDate ? formatDate(returnDate) : '—'}</strong>
        </div>
        <div>
          <span>Warranty</span>
          <strong>{warrantyDate ? formatDate(warrantyDate) : '—'}</strong>
        </div>
      </div>

      <div className="card-actions">
        <button className="text-button" onClick={openReceipt} disabled={!purchase.receiptBlob}>
          <FileText size={16} /> {purchase.receiptBlob ? 'View receipt' : 'No receipt'}
        </button>
        <div>
          <button className="icon-button small" onClick={() => onEdit(purchase)} aria-label="Edit">
            <Pencil size={16} />
          </button>
          <button className="icon-button small danger" onClick={() => onDelete(purchase)} aria-label="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function App() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  async function refresh() {
    const records = await getPurchases()
    records.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
    setPurchases(records)
    setLoading(false)
  }

  useEffect(() => {
    refresh().catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase()
    return purchases.filter((purchase) => {
      const matchesText = !text || [purchase.itemName, purchase.retailer, purchase.category, purchase.serialNumber]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(text))

      if (!matchesText) return false
      if (filter === 'all') return true

      const returnLeft = daysFromNow(addDays(purchase.purchaseDate, purchase.returnDays))
      const warrantyLeft = daysFromNow(addMonths(purchase.purchaseDate, purchase.warrantyMonths))

      if (filter === 'returns') return returnLeft !== null && returnLeft >= 0 && returnLeft <= 30
      if (filter === 'warranties') return warrantyLeft !== null && warrantyLeft >= 0 && warrantyLeft <= 90
      if (filter === 'expired') return warrantyLeft !== null && warrantyLeft < 0
      return true
    })
  }, [purchases, query, filter])

  const dueReturns = purchases.filter((p) => {
    const days = daysFromNow(addDays(p.purchaseDate, p.returnDays))
    return days !== null && days >= 0 && days <= 30
  }).length

  const covered = purchases.filter((p) => {
    const days = daysFromNow(addMonths(p.purchaseDate, p.warrantyMonths))
    return days !== null && days >= 0
  }).length

  function startAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function startEdit(purchase) {
    setEditing(purchase)
    setModalOpen(true)
  }

  async function handleDelete(purchase) {
    if (!window.confirm(`Delete “${purchase.itemName}”?`)) return
    await deletePurchase(purchase.id)
    await refresh()
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="KeepMyReceipt home">
          <span className="brand-mark"><ReceiptText size={22} /></span>
          <span>KeepMyReceipt</span>
        </a>
        <div className="privacy-pill"><ShieldCheck size={15} /> Private by default</div>
      </header>

      <main>
        <section className="hero">
          <div>
            <span className="eyebrow">YOUR PURCHASE VAULT</span>
            <h1>Receipts you can actually find.</h1>
            <p>Keep receipts, return dates and warranties together — without sending your purchase history to a server.</p>
          </div>
          <button className="button primary hero-button" onClick={startAdd}>
            <Plus size={18} /> Add purchase
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon"><Archive size={19} /></span>
            <div><strong>{purchases.length}</strong><span>Saved purchases</span></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><CalendarClock size={19} /></span>
            <div><strong>{dueReturns}</strong><span>Returns due soon</span></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><CheckCircle2 size={19} /></span>
            <div><strong>{covered}</strong><span>Under warranty</span></div>
          </div>
        </section>

        <section className="library">
          <div className="library-header">
            <div>
              <span className="eyebrow">LIBRARY</span>
              <h2>Your purchases</h2>
            </div>
            <div className="search-wrap">
              <Search size={18} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search items, stores, serials…" />
            </div>
          </div>

          <div className="filter-row">
            {[
              ['all', 'All'],
              ['returns', 'Returns soon'],
              ['warranties', 'Warranty ending'],
              ['expired', 'Expired'],
            ].map(([value, label]) => (
              <button key={value} className={filter === value ? 'filter active' : 'filter'} onClick={() => setFilter(value)}>
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="empty-state"><p>Loading your purchase vault…</p></div>
          ) : filtered.length ? (
            <div className="purchase-grid">
              {filtered.map((purchase) => (
                <PurchaseCard key={purchase.id} purchase={purchase} onEdit={startEdit} onDelete={handleDelete} />
              ))}
            </div>
          ) : purchases.length ? (
            <div className="empty-state">
              <Search size={30} />
              <h3>No matching purchases</h3>
              <p>Try a different search or filter.</p>
            </div>
          ) : (
            <div className="empty-state onboarding">
              <div className="empty-icon"><ReceiptText size={30} /></div>
              <h3>Save your first receipt</h3>
              <p>Add something you recently bought. KeepMyReceipt will track its return window and warranty for you.</p>
              <button className="button primary" onClick={startAdd}><Plus size={18} /> Add first purchase</button>
              <small>Your data stays in this browser on this device.</small>
            </div>
          )}
        </section>
      </main>

      <footer>
        <span>KeepMyReceipt · MVP 0.1</span>
        <span>Local-first · No account · No tracking</span>
      </footer>

      {modalOpen && (
        <PurchaseModal
          purchase={editing}
          onClose={() => setModalOpen(false)}
          onSaved={refresh}
        />
      )}
    </div>
  )
}
