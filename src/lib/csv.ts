// CSV export helpers (RFC 4180) with spreadsheet formula-injection
// protection. Any cell whose first character is =, +, -, @, tab or CR is
// prefixed with a single quote (') so a spreadsheet never evaluates it
// as a formula when the file is opened.

export interface CsvColumn {
  key: string;
  label: string;
}

/** Quote one cell per RFC 4180 and neutralise formula injection. */
export function escapeCsvCell(value: string | number): string {
  let text = String(value ?? "");
  // Formula-injection protection: prefix a single quote when the cell
  // starts with a formula trigger character.
  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }
  // Quote when the cell contains a comma, quote, CR or LF (or the quote
  // we just added is not itself a trigger — quoting is harmless anyway).
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/** Build a CSV string: header row from column labels, then one row per record. */
export function toCsv(
  rows: Record<string, string | number>[],
  columns: CsvColumn[],
): string {
  const header = columns.map((c) => escapeCsvCell(c.label)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => escapeCsvCell(row[c.key] ?? "")).join(","),
  );
  // CRLF line endings per RFC 4180; trailing newline after the last row.
  return [header, ...lines].join("\r\n") + "\r\n";
}
