const amountPattern = "(?:[0-9]{1,3}(?:,[0-9]{3})+|[0-9]+)(?:\\.[0-9]{1,2})?(?![\\d.,])";

export function purchaseDraft(text, fromImage = false) {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const total = /^(?:(?:grand\s+)?total(?:\s+(?:paid|due))?|amount\s+paid|实付(?:金额)?|合计)\s*[:：]?\s*$/i;
  const totalLines = lines.flatMap((line, index) => {
    const label = line.match(/^(?:(?:grand\s+)?total(?:\s+(?:paid|due))?|amount\s+paid|实付(?:金额)?|合计)\s*[:：]?\s*/i);
    if (!label) return [];
    return [total.test(line) ? (lines[index + 1] || "") : line.slice(label[0].length)];
  });
  const currency = text.match(/\b(NZD|AUD|USD|CNY|GBP|EUR)\b/i)?.[1].toUpperCase()
    || (/AU\$/i.test(text) ? "AUD" : /US\$/i.test(text) ? "USD" : /人民币|[¥￥]|元/.test(text) ? "CNY" : /£/.test(text) ? "GBP" : /€/.test(text) ? "EUR" : "NZD");
  const marker = "(?:NZD|AUD|USD|CNY|GBP|EUR|NZ\\$|AU\\$|US\\$|[$¥￥£€])";
  const amounts = totalLines.map(line => line.match(new RegExp(`^(?:${marker}\\s*)?(${amountPattern})(?:\\s*(?:${marker}|元))?$`, "i"))?.[1]).filter(Boolean);
  const spoken = text.match(new RegExp(`(?:${marker}\\s*(${amountPattern})|(${amountPattern})\\s*(?:刀|块钱|元|dollars?\\b)|(?:花了?|付了?|spent|paid)\\s*(${amountPattern}))`, "i"));
  const uniqueAmounts = [...new Set(amounts.map(value => value.replaceAll(",", "")))];
  const amount = uniqueAmounts.length === 1 ? uniqueAmounts[0]
    : fromImage ? "" : (spoken?.slice(1).find(Boolean) || "").replaceAll(",", "");
  const first = lines[0] || "";
  const retailer = fromImage
    ? (/\p{L}/u.test(first) && first.length <= 48 && !/receipt|invoice|order|tax|收据|订单|发票/i.test(first) ? first : "")
    : text.match(/(?:在|\bat\s+)([^，。\n]+?)(?=\s*(?:买|花|付|spent|paid)|[，。]|$)/i)?.[1].trim() || "";
  const item = fromImage ? retailer : text.match(/买了?\s*([^，。\n]+?)(?=\s*(?:花|付|[，。]|$))/)?.[1].trim();
  const iso = text.match(/\b(20\d\d)[-/](\d{1,2})[-/](\d{1,2})\b/);
  const local = text.match(/\b(\d{1,2})[/.-](\d{1,2})[/.-](20\d\d)\b/);
  const date = iso ? [iso[1], iso[2], iso[3]] : local ? [local[3], local[2], local[1]] : null;
  return {
    amount, currency, retailer, item: item || retailer || "",
    date: date && date.map(part => part.padStart(2, "0")).join("-"),
    yesterday: /昨天|\byesterday\b/i.test(text)
  };
}

export function matchingPurchases(records, amount, currency, date) {
  if (amount === "" || !date) return [];
  return records.filter(record => record.kind !== "memo" && !record.receiptBlob && record.amount !== "" && record.amount != null
    && Number(record.amount) === Number(amount) && record.currency === currency && record.purchaseDate === date);
}

export function calendarEvent(id, title, date, description) {
  const escape = value => String(value).replace(/\\/g, "\\\\").replace(/\r?\n|\r/g, "\\n").replace(/[,;]/g, "\\$&");
  const stamp = value => value.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//KeepMyReceipt//Reminder//EN",
    "BEGIN:VEVENT", `UID:${id}@keepmyreceipt`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(date)}`, `SUMMARY:${escape(title)}`, `DESCRIPTION:${escape(description)}`,
    "BEGIN:VALARM", "TRIGGER:PT0M", "ACTION:DISPLAY", `DESCRIPTION:${escape(title)}`,
    "END:VALARM", "END:VEVENT", "END:VCALENDAR", ""
  ].join("\r\n");
}
