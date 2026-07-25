/**
 * PDF Export Utility — Client-side PDF generation via `window.print()`
 *
 * Opens a new window with formatted HTML content styled for print,
 * then triggers the browser's print dialog so the user can save as PDF.
 *
 * Uses oklch color format consistent with the project's CSS system.
 */

export interface PDFExportOptions {
  /** Report title shown as `<h1>` */
  title: string
  /** Optional subtitle / description line */
  subtitle?: string
  /** Array of data rows — keys become table headers */
  data: Array<Record<string, string | number>>
  /** Override the window title / suggested filename */
  filename?: string
}

/** Branding colours (oklch) */
const BRAND_PRIMARY = "oklch(0.488 0.243 264)"
const BRAND_TEXT = "oklch(0.145 0.015 250)"
const BRAND_MUTED = "oklch(0.5 0.02 250)"
const BRAND_BORDER = "oklch(0.912 0.005 250)"
const BRAND_BG = "oklch(0.985 0.001 250)"
const BRAND_ALT_ROW = "oklch(0.96 0.005 250)"

function buildHTML(opts: PDFExportOptions): string {
  const { title, subtitle, data, filename } = opts
  const now = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  if (!data.length) {
    return `<!DOCTYPE html><html><head><title>${filename ?? title}</title></head>
<body style="font-family:system-ui,sans-serif;color:${BRAND_TEXT};padding:2rem">
<h1>${title}</h1><p>No data available.</p></body></html>`
  }

  const columns = Object.keys(data[0])

  const headerCells = columns
    .map((col) => `<th style="padding:10px 14px;text-align:left;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;color:${BRAND_MUTED};border-bottom:2px solid ${BRAND_PRIMARY}">${col}</th>`)
    .join("")

  const bodyRows = data
    .map(
      (row, idx) =>
        `<tr style="background:${idx % 2 === 0 ? "transparent" : BRAND_ALT_ROW}">` +
        columns
          .map(
            (col) =>
              `<td style="padding:8px 14px;font-size:13px;border-bottom:1px solid ${BRAND_BORDER};font-variant-numeric:tabular-nums">${row[col]}</td>`
          )
          .join("") +
        `</tr>`
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${filename ?? title}</title>
  <style>
    @page { margin: 20mm; size: A4 landscape; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      color: ${BRAND_TEXT};
      background: ${BRAND_BG};
      padding: 0;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 0 16px;
      border-bottom: 2px solid ${BRAND_PRIMARY};
      margin-bottom: 24px;
    }
    .header-logo {
      width: 36px; height: 36px;
      background: ${BRAND_PRIMARY};
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
    }
    .header-logo span { color: white; font-weight: 700; font-size: 16px; }
    .header-text h1 { font-size: 20px; font-weight: 700; color: ${BRAND_TEXT}; }
    .header-text p  { font-size: 12px; color: ${BRAND_MUTED}; margin-top: 2px; }
    .footer {
      margin-top: 32px;
      padding-top: 12px;
      border-top: 1px solid ${BRAND_BORDER};
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: ${BRAND_MUTED};
    }
    table { width: 100%; border-collapse: collapse; }
    tr:last-child td { border-bottom: none; }
    @media print {
      body { background: white; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div style="max-width:1100px;margin:0 auto;padding:0 24px">
    <!-- Header -->
    <div class="header">
      <div class="header-logo"><span>A</span></div>
      <div class="header-text">
        <h1>${title}</h1>
        ${subtitle ? `<p>${subtitle}</p>` : ""}
      </div>
    </div>

    <!-- Data Table -->
    <table>
      <thead><tr>${headerCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>

    <!-- Footer -->
    <div class="footer">
      <span>AutoFlow Logistics — WMS Report</span>
      <span>Generated on ${now}</span>
    </div>
  </div>

  <script>
    // Auto-trigger print when the window finishes loading
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`
}

/**
 * Generate a client-side "PDF" by opening a styled HTML page in a new
 * tab and triggering `window.print()`. The user can then choose to
 * "Save as PDF" from the browser's print dialog.
 */
export function exportToPDF(options: PDFExportOptions): void {
  const html = buildHTML(options)
  const win = window.open("", "_blank")
  if (!win) {
    throw new Error("Pop-up blocked — please allow pop-ups for this site to export PDFs.")
  }
  win.document.write(html)
  win.document.close()
}

/**
 * Generate a combined PDF report containing multiple sections, each
 * with its own title and data table.
 */
export function exportCombinedPDF(options: {
  title: string
  subtitle?: string
  sections: Array<{ title: string; data: Array<Record<string, string | number>> }>
  filename?: string
}): void {
  const { title, subtitle, sections, filename } = options
  const now = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const sectionHTML = sections
    .map((section, idx) => {
      if (!section.data.length) return ""
      const columns = Object.keys(section.data[0])

      const headerCells = columns
        .map(
          (col) =>
            `<th style="padding:8px 12px;text-align:left;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;color:${BRAND_MUTED};border-bottom:2px solid ${BRAND_PRIMARY}">${col}</th>`
        )
        .join("")

      const bodyRows = section.data
        .map(
          (row, rIdx) =>
            `<tr style="background:${rIdx % 2 === 0 ? "transparent" : BRAND_ALT_ROW}">` +
            columns
              .map(
                (col) =>
                  `<td style="padding:6px 12px;font-size:12px;border-bottom:1px solid ${BRAND_BORDER};font-variant-numeric:tabular-nums">${row[col]}</td>`
              )
              .join("") +
            `</tr>`
        )
        .join("")

      return `
        <div style="margin-bottom:${idx < sections.length - 1 ? "32px" : "0"}">
          <h2 style="font-size:15px;font-weight:600;margin-bottom:10px;color:${BRAND_TEXT};padding-bottom:6px;border-bottom:1px solid ${BRAND_BORDER}">${section.title}</h2>
          <table style="width:100%;border-collapse:collapse">
            <thead><tr>${headerCells}</tr></thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </div>`
    })
    .join("")

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${filename ?? title}</title>
  <style>
    @page { margin: 15mm; size: A4 landscape; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      color: ${BRAND_TEXT};
      background: ${BRAND_BG};
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 0 14px;
      border-bottom: 2px solid ${BRAND_PRIMARY};
      margin-bottom: 20px;
    }
    .header-logo {
      width: 36px; height: 36px;
      background: ${BRAND_PRIMARY};
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
    }
    .header-logo span { color: white; font-weight: 700; font-size: 16px; }
    .header-text h1 { font-size: 20px; font-weight: 700; color: ${BRAND_TEXT}; }
    .header-text p  { font-size: 12px; color: ${BRAND_MUTED}; margin-top: 2px; }
    .footer {
      margin-top: 32px;
      padding-top: 12px;
      border-top: 1px solid ${BRAND_BORDER};
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: ${BRAND_MUTED};
    }
    .section-break {
      page-break-before: always;
    }
    @media print {
      body { background: white; }
      .no-print { display: none !important; }
      .section-break { page-break-before: auto; }
    }
  </style>
</head>
<body>
  <div style="max-width:1100px;margin:0 auto;padding:0 20px">
    <div class="header">
      <div class="header-logo"><span>A</span></div>
      <div class="header-text">
        <h1>${title}</h1>
        ${subtitle ? `<p>${subtitle}</p>` : ""}
      </div>
    </div>
    ${sectionHTML}
    <div class="footer">
      <span>AutoFlow Logistics — Combined WMS Report</span>
      <span>Generated on ${now}</span>
    </div>
  </div>
  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`

  const win = window.open("", "_blank")
  if (!win) {
    throw new Error("Pop-up blocked — please allow pop-ups for this site to export PDFs.")
  }
  win.document.write(html)
  win.document.close()
}
