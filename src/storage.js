const DB_NAME = 'keepmyreceipt-db'
const DB_VERSION = 1
const STORE = 'purchases'

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getPurchases() {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => resolve(req.result || [])
    req.onerror = () => reject(req.error)
  })
}

export async function savePurchase(purchase) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(purchase)
    tx.oncomplete = () => resolve(purchase)
    tx.onerror = () => reject(tx.error)
  })
}

export async function deletePurchase(id) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    if (!blob) return resolve(null)
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function dataUrlToBlob(dataUrl) {
  if (!dataUrl) return null
  const [header, base64] = dataUrl.split(',')
  if (!header || !base64) throw new Error('Invalid receipt data')
  const type = header.match(/data:(.*?);base64/)?.[1] || 'application/octet-stream'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type })
}

export async function exportBackupJson() {
  const purchases = await getPurchases()
  const serialized = []

  for (const purchase of purchases) {
    const { receiptBlob, ...rest } = purchase
    serialized.push({
      ...rest,
      receiptDataUrl: receiptBlob ? await blobToDataUrl(receiptBlob) : null,
    })
  }

  return JSON.stringify({
    app: 'KeepMyReceipt',
    version: 1,
    exportedAt: new Date().toISOString(),
    purchases: serialized,
  }, null, 2)
}

export async function importBackupJson(jsonText) {
  const parsed = JSON.parse(jsonText)
  if (!parsed || parsed.app !== 'KeepMyReceipt' || !Array.isArray(parsed.purchases)) {
    throw new Error('This does not look like a KeepMyReceipt backup.')
  }

  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)

    for (const record of parsed.purchases) {
      const { receiptDataUrl, ...rest } = record
      store.put({
        ...rest,
        receiptBlob: receiptDataUrl ? dataUrlToBlob(receiptDataUrl) : null,
      })
    }

    tx.oncomplete = () => resolve(parsed.purchases.length)
    tx.onerror = () => reject(tx.error)
  })
}
