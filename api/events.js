import { summary } from "./_y.js";
const T = ["RELIANCE.NS","TCS.NS","HDFCBANK.NS","INFY.NS","ICICIBANK.NS","SBIN.NS","ITC.NS","TATAMOTORS.NS","BHARTIARTL.NS","ADANIENT.NS","AAPL","MSFT","NVDA","TSLA","GOOGL","AMZN"];
const r = (o) => (o && typeof o.raw === "number" ? o.raw : null);
export default async function handler(req, res) {
  const now = Date.now() / 1000, out = [];
  const all = await Promise.allSettled(T.map((s) => summary(s, "calendarEvents,price")));
  all.forEach((x, i) => {
    if (x.status !== "fulfilled") return;
    const R = x.value, ce = R.calendarEvents || {}, n = (R.price && (R.price.shortName || R.price.longName)) || T[i];
    const e = ce.earnings && ce.earnings.earningsDate && ce.earnings.earningsDate[0] ? r(ce.earnings.earningsDate[0]) : null;
    if (e && e >= now) out.push({ t: "Results", h: n + " results", date: e, sym: T[i] });
    const d = r(ce.exDividendDate);
    if (d && d >= now) out.push({ t: "Dividend", h: n + " ex-dividend", date: d, sym: T[i] });
  });
  out.sort((a, b) => a.date - b.date);
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=7200");
  res.status(200).json({ events: out.slice(0, 16) });
}
