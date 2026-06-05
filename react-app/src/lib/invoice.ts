import PDFDocument from 'pdfkit';

export interface InvoiceItem {
  name: string;
  qty: number;
  price: number; // per-unit price EXCLUDING GST
  hsn?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    address?: string;    // addr1 + addr2
    city?: string;
    state?: string;
    pincode?: string;
  };
  items: InvoiceItem[];
  subtotal: number;    // excl. GST
  total: number;       // incl. GST (18%)
  paymentMethod?: string;
  paymentId?: string;
  isProforma?: boolean; // true for COD / 3D print estimate
}

// ── Company details (override via env vars) ──────────────────────────────────
const CO = {
  name:    'KYZER ROBOTICS PVT. LTD.',
  addr1:   process.env.KYZER_ADDRESS || 'Pune, Maharashtra 411046, India',
  phone:   '+91 90496 95264',
  email:   process.env.GMAIL_USER   || 'info@kyzerrobotics.com',
  gstin:   process.env.KYZER_GSTIN  || 'Applied for',
  website: 'kyzerrobotics.com',
};

const CGST_RATE = 0.09;
const SGST_RATE = 0.09;
const DEFAULT_HSN = '8473';

// ── Amount-in-words helper ────────────────────────────────────────────────────
function toWords(n: number): string {
  const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
    'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen',
    'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
    'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function lt1000(x: number): string {
    if (x === 0) return '';
    if (x < 20) return ONES[x];
    if (x < 100) return TENS[Math.floor(x / 10)] + (x % 10 ? ' ' + ONES[x % 10] : '');
    return ONES[Math.floor(x / 100)] + ' Hundred' + (x % 100 ? ' ' + lt1000(x % 100) : '');
  }

  const rupees = Math.floor(n);
  const paise  = Math.round((n - rupees) * 100);
  let r = rupees;
  let parts = '';
  if (r >= 10000000) { parts += lt1000(Math.floor(r / 10000000)) + ' Crore '; r %= 10000000; }
  if (r >= 100000)   { parts += lt1000(Math.floor(r / 100000))   + ' Lakh ';  r %= 100000;   }
  if (r >= 1000)     { parts += lt1000(Math.floor(r / 1000))     + ' Thousand '; r %= 1000;  }
  parts += lt1000(r);
  let result = (parts.trim() || 'Zero') + ' Rupees';
  if (paise > 0) result += ` and ${lt1000(paise)} Paise`;
  return result.trim() + ' Only';
}

// ── Main generator ────────────────────────────────────────────────────────────
export function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4', compress: true });
    const chunks: Buffer[] = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const PW  = 515;   // printable width
    const L   = 40;    // left margin
    const MID = L + PW / 2;

    // ── Title ─────────────────────────────────────────────────────────────────
    doc.fontSize(13).font('Helvetica-Bold')
       .text(data.isProforma ? 'Proforma Invoice (Estimate)' : 'Tax Invoice',
             L, 38, { width: PW, align: 'center' });

    let y = 62;

    // ── Company header block ───────────────────────────────────────────────────
    doc.rect(L, y, PW, 72).stroke('#cccccc');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#111111')
       .text(CO.name, L + 8, y + 8);
    doc.fontSize(7.5).font('Helvetica').fillColor('#444444')
       .text(CO.addr1,        L + 8, y + 21)
       .text('Phone: ' + CO.phone,   L + 8, y + 31)
       .text('Email: ' + CO.email,   L + 8, y + 41)
       .text('GSTIN: ' + CO.gstin,   L + 8, y + 51)
       .text('Website: ' + CO.website, L + 8, y + 61);
    y += 74;

    // ── Invoice Details | Bill To | Ship To ────────────────────────────────────
    const COL_W = Math.floor(PW / 3);
    const SEC_H = 90;

    // Draw 3 bordered columns
    for (let i = 0; i < 3; i++) {
      doc.rect(L + i * COL_W, y, COL_W, SEC_H).stroke('#cccccc');
    }

    // — Invoice details (col 0) —
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#333333')
       .text('Invoice Details', L + 6, y + 6);
    doc.fontSize(7).font('Helvetica').fillColor('#111111')
       .text(`Invoice #: ${data.invoiceNumber}`, L + 6, y + 18, { width: COL_W - 12 })
       .text(`Date: ${data.date}`,               L + 6, y + 28, { width: COL_W - 12 })
       .text(`Payment: ${data.paymentMethod || (data.isProforma ? 'Pending' : 'Online')}`,
             L + 6, y + 38, { width: COL_W - 12 });
    if (data.paymentId)
      doc.text(`Ref: ${data.paymentId}`, L + 6, y + 48, { width: COL_W - 12 });

    // — Bill To (col 1) —
    const BX = L + COL_W + 6;
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#333333')
       .text('Bill To', BX, y + 6);
    doc.fontSize(7).font('Helvetica').fillColor('#111111')
       .text(data.customer.name,  BX, y + 18, { width: COL_W - 12 })
       .text(data.customer.email, BX, y + 28, { width: COL_W - 12 });
    if (data.customer.phone)
      doc.text('Ph: ' + data.customer.phone, BX, y + 38, { width: COL_W - 12 });
    if (data.customer.address)
      doc.text(data.customer.address, BX, y + 48, { width: COL_W - 12 });

    // — Ship To (col 2) —
    const SX = L + COL_W * 2 + 6;
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#333333')
       .text('Ship To', SX, y + 6);
    doc.fontSize(7).font('Helvetica').fillColor('#111111')
       .text(data.customer.name, SX, y + 18, { width: COL_W - 12 });
    if (data.customer.address)
      doc.text(data.customer.address, SX, y + 28, { width: COL_W - 12 });
    const cityLine = [data.customer.city, data.customer.state, data.customer.pincode]
      .filter(Boolean).join(', ');
    if (cityLine) doc.text(cityLine, SX, y + 50, { width: COL_W - 12 });
    if (data.customer.state) doc.text(data.customer.state, SX, y + 60, { width: COL_W - 12 });

    y += SEC_H + 2;

    // ── Items table ────────────────────────────────────────────────────────────
    // Column widths (sum = PW = 515)
    const CW = {
      sno:   22,
      desc:  160,
      hsn:   50,
      up:    54,
      qty:   28,
      amt:   58,
      sgst:  48,
      cgst:  48,
      total: 47,
    };
    // Verify sum
    const colWidths = [CW.sno, CW.desc, CW.hsn, CW.up, CW.qty, CW.amt, CW.sgst, CW.cgst, CW.total];
    const HEADER_H = 22;
    const ROW_H    = 18;

    // Header
    doc.rect(L, y, PW, HEADER_H).fill('#e5e5e5');
    doc.rect(L, y, PW, HEADER_H).stroke('#aaaaaa');

    const headers = ['#', 'Description', 'HSN/SAC', 'Unit Price', 'Qty', 'Amount', 'SGST 9%', 'CGST 9%', 'Total'];
    let cx = L;
    headers.forEach((h, i) => {
      doc.fontSize(6.5).font('Helvetica-Bold').fillColor('#111111')
         .text(h, cx + 2, y + 7, { width: colWidths[i] - 4, align: i >= 3 ? 'right' : 'left' });
      cx += colWidths[i];
    });
    y += HEADER_H;

    // Item rows
    let grandSubtotal = 0;
    let grandSGST     = 0;
    let grandCGST     = 0;

    data.items.forEach((item, idx) => {
      const unitAmt = item.price * item.qty;
      const sgst    = unitAmt * SGST_RATE;
      const cgst    = unitAmt * CGST_RATE;
      const lineTotal = unitAmt + sgst + cgst;
      grandSubtotal += unitAmt;
      grandSGST     += sgst;
      grandCGST     += cgst;

      const bg = idx % 2 === 0 ? '#ffffff' : '#f9f9f9';
      doc.rect(L, y, PW, ROW_H).fill(bg);

      // Draw cell borders
      cx = L;
      colWidths.forEach(w => { doc.rect(cx, y, w, ROW_H).stroke('#dddddd'); cx += w; });

      const cells = [
        String(idx + 1),
        item.name,
        item.hsn || DEFAULT_HSN,
        `₹${item.price.toFixed(2)}`,
        String(item.qty),
        `₹${unitAmt.toFixed(2)}`,
        `₹${sgst.toFixed(2)}`,
        `₹${cgst.toFixed(2)}`,
        `₹${lineTotal.toFixed(2)}`,
      ];
      cx = L;
      cells.forEach((cell, i) => {
        doc.fontSize(7).font('Helvetica').fillColor('#111111')
           .text(cell, cx + 3, y + 5,
                 { width: colWidths[i] - 6, align: i >= 3 ? 'right' : 'left', lineBreak: false, ellipsis: true });
        cx += colWidths[i];
      });
      y += ROW_H;
    });

    // ── Totals row ─────────────────────────────────────────────────────────────
    const grandTotal = grandSubtotal + grandSGST + grandCGST;

    doc.rect(L, y, PW, ROW_H).fill('#e5e5e5').stroke('#aaaaaa');
    const totCells = [
      '', 'Total', '', '', '', `₹${grandSubtotal.toFixed(2)}`,
      `₹${grandSGST.toFixed(2)}`, `₹${grandCGST.toFixed(2)}`, `₹${grandTotal.toFixed(2)}`
    ];
    cx = L;
    totCells.forEach((cell, i) => {
      doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#111111')
         .text(cell, cx + 3, y + 5,
               { width: colWidths[i] - 6, align: i === 1 ? 'left' : 'right', lineBreak: false });
      cx += colWidths[i];
    });
    y += ROW_H + 6;

    // ── Amount in words ────────────────────────────────────────────────────────
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#333333')
       .text('Amount in Words: ', L, y, { continued: true })
       .font('Helvetica').fillColor('#111111').text(toWords(grandTotal).toUpperCase());
    y += 16;

    if (data.isProforma) {
      doc.fontSize(7).font('Helvetica').fillColor('#e07000')
         .text('* This is an estimated proforma invoice. Final pricing confirmed after order review.', L, y);
      y += 12;
    }

    // ── GST Summary ────────────────────────────────────────────────────────────
    y += 4;
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#333333')
       .text('GST Summary', L, y);
    y += 10;

    const sumCW  = [80, 90, 70, 90, 70, 80];
    const sumHdr = ['HSN/SAC', 'Taxable Value', 'CGST Rate', 'CGST Amt', 'SGST Rate', 'SGST Amt'];
    doc.rect(L, y, PW, 16).fill('#e5e5e5').stroke('#aaaaaa');
    cx = L;
    sumHdr.forEach((h, i) => {
      doc.fontSize(6.5).font('Helvetica-Bold').fillColor('#111111')
         .text(h, cx + 3, y + 4, { width: sumCW[i] - 6, align: 'center' });
      cx += sumCW[i];
    });
    y += 16;

    // Group items by HSN
    const hsnMap: Record<string, { taxable: number; cgst: number; sgst: number }> = {};
    data.items.forEach(item => {
      const hsn = item.hsn || DEFAULT_HSN;
      const taxable = item.price * item.qty;
      if (!hsnMap[hsn]) hsnMap[hsn] = { taxable: 0, cgst: 0, sgst: 0 };
      hsnMap[hsn].taxable += taxable;
      hsnMap[hsn].cgst    += taxable * CGST_RATE;
      hsnMap[hsn].sgst    += taxable * SGST_RATE;
    });

    Object.entries(hsnMap).forEach(([hsn, vals]) => {
      doc.rect(L, y, PW, 14).fill('#ffffff').stroke('#dddddd');
      const sumCells = [hsn, `₹${vals.taxable.toFixed(2)}`, '9%', `₹${vals.cgst.toFixed(2)}`, '9%', `₹${vals.sgst.toFixed(2)}`];
      cx = L;
      sumCells.forEach((cell, i) => {
        doc.fontSize(7).font('Helvetica').fillColor('#111111')
           .text(cell, cx + 3, y + 4, { width: sumCW[i] - 6, align: 'center' });
        cx += sumCW[i];
      });
      y += 14;
    });
    y += 8;

    // ── Terms & Conditions ─────────────────────────────────────────────────────
    doc.moveTo(L, y).lineTo(L + PW, y).stroke('#cccccc');
    y += 8;

    doc.fontSize(7).font('Helvetica-Bold').fillColor('#333333').text('Terms & Conditions:', L, y);
    y += 10;
    const terms = [
      '• All orders are non-cancellable, non-returnable and non-replaceable unless a manufacturing defect is proven.',
      '• Warranty covers manufacturing defects only.',
      '• This is a Computer Generated Invoice. No Stamp or Signature Required.',
      '• Subject to Pune, Maharashtra jurisdiction.',
    ];
    terms.forEach(t => {
      doc.fontSize(6.5).font('Helvetica').fillColor('#555555').text(t, L, y, { width: PW });
      y += 9;
    });

    // ── Footer ─────────────────────────────────────────────────────────────────
    y += 6;
    doc.fontSize(6.5).font('Helvetica').fillColor('#aaaaaa')
       .text('This is a Computer Generated Invoice. No Stamp or Signature Required.',
             L, y, { width: PW, align: 'center' });

    doc.end();
  });
}

// ── Helpers used by API routes ────────────────────────────────────────────────

/** Parse a price string like "₹1,500" or "1500" to a number */
export function parsePrice(p: string | number): number {
  if (typeof p === 'number') return p;
  return parseFloat(String(p).replace(/[^0-9.]/g, '')) || 0;
}

/** Build InvoiceData from a shop order object */
export function shopOrderToInvoice(o: Record<string, unknown>, paid: boolean): InvoiceData {
  const shipping = (o.shipping as Record<string, string>) || {};
  const addrParts = [shipping.addr1, shipping.addr2].filter(Boolean).join(', ');

  const rawItems = (o.items as Array<Record<string, unknown>>) || [];
  const items: InvoiceItem[] = rawItems.map(i => {
    const unitPrice = parsePrice(i.price as string | number);
    return {
      name:  String(i.name || ''),
      qty:   Number(i.qty) || 1,
      price: unitPrice,
      hsn:   String(i.hsn || DEFAULT_HSN),
    };
  });

  const total    = parsePrice(o.total as string | number);
  const subtotal = parsePrice(o.subtotal as string | number) || total / 1.18;

  return {
    invoiceNumber: String(o.id || ('KR-' + Date.now())),
    date:          new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    customer: {
      name:    String(o.name    || ''),
      email:   String(o.email   || ''),
      phone:   String(o.phone   || ''),
      company: String(o.company || ''),
      address: addrParts,
      city:    shipping.city    || '',
      state:   shipping.state   || '',
      pincode: shipping.pincode || '',
    },
    items,
    subtotal,
    total,
    paymentMethod: paid ? 'Online (Razorpay)' : 'Cash on Delivery',
    paymentId:     String(o.paymentId || ''),
    isProforma:    !paid,
  };
}
