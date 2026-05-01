// Génération PDF côté client via une fenêtre print (sans dépendance externe).
// On construit une page HTML autonome et on lance window.print() pour permettre
// à l'utilisateur d'enregistrer en PDF via la boîte de dialogue d'impression.

export interface PdfColumn<T> {
  header: string;
  accessor: (row: T) => string | number;
  align?: "left" | "right" | "center";
}

export interface PdfExportOptions<T> {
  title: string;
  subtitle?: string;
  columns: PdfColumn<T>[];
  rows: T[];
  totals?: { label: string; value: string }[];
}

const escapeHtml = (s: string | number) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function exportToPdf<T>({ title, subtitle, columns, rows, totals }: PdfExportOptions<T>) {
  const win = window.open("", "_blank", "width=1024,height=768");
  if (!win) return;

  const now = new Date().toLocaleString("fr-FR");
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111; margin: 24px; }
  header { border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 18px; }
  h1 { margin: 0 0 4px; font-size: 22px; }
  .sub { color: #555; font-size: 13px; }
  .meta { font-size: 11px; color: #777; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
  th, td { padding: 8px 10px; border-bottom: 1px solid #ddd; text-align: left; vertical-align: top; }
  th { background: #f3f3f3; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
  tr:nth-child(even) td { background: #fafafa; }
  .right { text-align: right; }
  .center { text-align: center; }
  .totals { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 12px; }
  .totals div { border: 1px solid #ddd; padding: 8px 12px; border-radius: 6px; font-size: 12px; }
  .totals strong { display: block; font-size: 14px; margin-top: 2px; }
  footer { margin-top: 24px; font-size: 10px; color: #888; text-align: center; }
  @media print { body { margin: 12mm; } header { border-color: #000; } }
</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(title)}</h1>
    ${subtitle ? `<div class="sub">${escapeHtml(subtitle)}</div>` : ""}
    <div class="meta">Généré le ${escapeHtml(now)} · ${rows.length} ligne(s)</div>
  </header>
  <table>
    <thead>
      <tr>${columns.map((c) => `<th class="${c.align ?? "left"}">${escapeHtml(c.header)}</th>`).join("")}</tr>
    </thead>
    <tbody>
      ${rows
        .map(
          (r) =>
            `<tr>${columns
              .map((c) => `<td class="${c.align ?? "left"}">${escapeHtml(c.accessor(r))}</td>`)
              .join("")}</tr>`
        )
        .join("")}
    </tbody>
  </table>
  ${
    totals && totals.length
      ? `<div class="totals">${totals
          .map((t) => `<div>${escapeHtml(t.label)}<strong>${escapeHtml(t.value)}</strong></div>`)
          .join("")}</div>`
      : ""
  }
  <footer>GAMA Boutique — Document généré automatiquement</footer>
  <script>
    window.onload = () => { setTimeout(() => { window.print(); }, 250); };
  </script>
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}
