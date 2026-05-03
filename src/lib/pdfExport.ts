// Export utilities — PDF (via window.print) et Excel (via exceljs)
// Les deux fonctions partagent la même définition de colonnes pour rester DRY.

import ExcelJS from "exceljs";

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
  /** Optionnel: récupère l'URL de l'image associée à la ligne (article photo) */
  imageAccessor?: (row: T) => string | null | undefined;
}

const escapeHtml = (s: string | number) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function exportToPdf<T>({ title, subtitle, columns, rows, totals, imageAccessor }: PdfExportOptions<T>) {
  const win = window.open("", "_blank", "width=1024,height=768");
  if (!win) return;

  const now = new Date().toLocaleString("fr-FR");
  const hasImg = !!imageAccessor;

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
  th, td { padding: 8px 10px; border-bottom: 1px solid #ddd; text-align: left; vertical-align: middle; }
  th { background: #f3f3f3; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
  tr:nth-child(even) td { background: #fafafa; }
  .right { text-align: right; }
  .center { text-align: center; }
  .thumb { width: 56px; height: 56px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; display: block; }
  .thumb-empty { width: 56px; height: 56px; background: #eee; border-radius: 4px; }
  .totals { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 12px; }
  .totals div { border: 1px solid #ddd; padding: 8px 12px; border-radius: 6px; font-size: 12px; }
  .totals strong { display: block; font-size: 14px; margin-top: 2px; }
  footer { margin-top: 24px; font-size: 10px; color: #888; text-align: center; }
  @media print { body { margin: 12mm; } header { border-color: #000; } .thumb { width: 48px; height: 48px; } }
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
      <tr>
        ${hasImg ? `<th style="width:70px">Photo</th>` : ""}
        ${columns.map((c) => `<th class="${c.align ?? "left"}">${escapeHtml(c.header)}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${rows
        .map((r) => {
          const imgCell = hasImg
            ? (() => {
                const src = imageAccessor!(r);
                return `<td>${src ? `<img class="thumb" src="${escapeHtml(src)}" />` : `<div class="thumb-empty"></div>`}</td>`;
              })()
            : "";
          return `<tr>${imgCell}${columns
            .map((c) => `<td class="${c.align ?? "left"}">${escapeHtml(c.accessor(r))}</td>`)
            .join("")}</tr>`;
        })
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
    window.onload = () => { setTimeout(() => { window.print(); }, 600); };
  </script>
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}

// ---------- EXCEL ----------

async function fetchImageAsBuffer(url: string): Promise<{ buffer: ArrayBuffer; ext: "png" | "jpeg" | "gif" } | null> {
  try {
    if (url.startsWith("data:")) {
      const m = url.match(/^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/);
      if (!m) return null;
      const ext = (m[1] === "jpg" ? "jpeg" : m[1]) as "png" | "jpeg" | "gif";
      const bin = atob(m[2]);
      const buf = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
      return { buffer: buf.buffer, ext };
    }
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const ext: "png" | "jpeg" | "gif" =
      blob.type.includes("png") ? "png" : blob.type.includes("gif") ? "gif" : "jpeg";
    const buffer = await blob.arrayBuffer();
    return { buffer, ext };
  } catch {
    return null;
  }
}

export async function exportToExcel<T>({ title, subtitle, columns, rows, totals, imageAccessor }: PdfExportOptions<T>) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "GAMA Boutique";
  workbook.created = new Date();
  const sheet = workbook.addWorksheet(title.slice(0, 31) || "Export");

  const hasImg = !!imageAccessor;
  const headers = [...(hasImg ? ["Photo"] : []), ...columns.map((c) => c.header)];

  // Title row
  sheet.mergeCells(1, 1, 1, headers.length);
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = title;
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { vertical: "middle", horizontal: "left" };

  if (subtitle) {
    sheet.mergeCells(2, 1, 2, headers.length);
    const sub = sheet.getCell(2, 1);
    sub.value = subtitle;
    sub.font = { italic: true, color: { argb: "FF666666" } };
  }

  const headerRowIdx = subtitle ? 4 : 3;
  const headerRow = sheet.getRow(headerRowIdx);
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F2937" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = { bottom: { style: "thin", color: { argb: "FF000000" } } };
  });
  headerRow.height = 22;

  // Column widths
  if (hasImg) sheet.getColumn(1).width = 12;
  columns.forEach((c, i) => {
    sheet.getColumn(i + 1 + (hasImg ? 1 : 0)).width = Math.max(12, c.header.length + 4);
  });

  // Data rows
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const excelRowIdx = headerRowIdx + 1 + r;
    const excelRow = sheet.getRow(excelRowIdx);
    excelRow.height = hasImg ? 60 : 18;

    let colOffset = 0;
    if (hasImg) {
      colOffset = 1;
      const url = imageAccessor!(row);
      if (url) {
        const img = await fetchImageAsBuffer(url);
        if (img) {
          const imageId = workbook.addImage({ buffer: img.buffer as any, extension: img.ext });
          sheet.addImage(imageId, {
            tl: { col: 0.1, row: excelRowIdx - 1 + 0.1 },
            ext: { width: 70, height: 70 },
          });
        }
      }
    }

    columns.forEach((c, i) => {
      const cell = excelRow.getCell(i + 1 + colOffset);
      const v = c.accessor(row);
      cell.value = v as any;
      cell.alignment = { vertical: "middle", horizontal: c.align ?? "left", wrapText: true };
      cell.border = { bottom: { style: "hair", color: { argb: "FFDDDDDD" } } };
    });
  }

  // Totals
  if (totals && totals.length) {
    const totalsStart = headerRowIdx + rows.length + 2;
    totals.forEach((t, i) => {
      const labelCell = sheet.getCell(totalsStart + i, 1);
      labelCell.value = t.label;
      labelCell.font = { bold: true };
      const valCell = sheet.getCell(totalsStart + i, 2);
      valCell.value = t.value;
    });
  }

  const buf = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9-_]+/gi, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
