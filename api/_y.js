export const H = { "User-Agent": "Mozilla/5.0 (compatible; SmartScanner/1.0)", Accept: "application/json" };
export async function chart(s, range, interval) {
  const u = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(s)}?range=${range}&interval=${interval}`;
  const x = await fetch(u, { headers: H });
  if (!x.ok) throw new Error("upstream " + x.status);
  const j = await x.json();
  const R = j.chart && j.chart.result && j.chart.result[0];
  if (!R) throw new Error("no data");
  return R;
}
export const okSym = (s) => /^[\w.^=\-&]{1,24}$/.test(s);
