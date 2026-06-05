import PDFDocument from 'pdfkit';

export interface InvoiceItem {
  name: string;
  qty: number;
  price: number; // per-unit price
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  items: InvoiceItem[];
  total: number;
  paymentMethod?: string;
  paymentId?: string;
  isProforma?: boolean;
}

// ── Company details ───────────────────────────────────────────────────────────
const CO = {
  name:    'KYZER ROBOTICS PVT. LTD.',
  addr1:   'Shop No. 3, Abhang Society,',
  addr2:   'Beside New Poona English Medium School,',
  addr3:   'Pandurang Nagar, Ambegaon Pathar,',
  addr4:   'Pune, Maharashtra 411046',
  phone:   '+91 90496 95264',
  email:   process.env.GMAIL_USER || 'info@kyzerrobotics.com',
  website: 'kyzerrobotics.com',
};

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
  if (r >= 1000)     { parts += lt1000(Math.floor(r / 1000))     + ' Thousand '; r %= 1000;   }
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

    const PW = 515;
    const L  = 40;

    // ── Title ─────────────────────────────────────────────────────────────────
    doc.fontSize(13).font('Helvetica-Bold')
       .text(data.isProforma ? 'Proforma Invoice (Estimate)' : 'Invoice',
             L, 38, { width: PW, align: 'center' });

    let y = 62;

    // ── Company header ─────────────────────────────────────────────────────────
    const HDR_H = 80;
    doc.rect(L, y, PW, HDR_H).stroke('#cccccc');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#111111')
       .text(CO.name, L + 8, y + 8);
    doc.fontSize(7.5).font('Helvetica').fillColor('#444444')
       .text(CO.addr1,  L + 8, y + 22)
       .text(CO.addr2,  L + 8, y + 32)
       .text(CO.addr3,  L + 8, y + 42)
       .text(CO.addr4,  L + 8, y + 52)
       .text(`Phone: ${CO.phone}   |   Email: ${CO.email}   |   ${CO.website}`, L + 8, y + 64);
    y += HDR_H + 2;

    // ── Invoice Details | Bill To | Ship To ────────────────────────────────────
    const COL_W = Math.floor(PW / 3);
    const SEC_H = 88;
    for (let i = 0; i < 3; i++) {
      doc.rect(L + i * COL_W, y, COL_W, SEC_H).stroke('#cccccc');
    }

    // Invoice details
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#333333')
       .text('Invoice Details', L + 6, y + 6);
    doc.fontSize(7).font('Helvetica').fillColor('#111111')
       .text(`Invoice #: ${data.invoiceNumber}`,   L + 6, y + 19, { width: COL_W - 12 })
       .text(`Date: ${data.date}`,                  L + 6, y + 30, { width: COL_W - 12 })
       .text(`Payment: ${data.paymentMethod || (data.isProforma ? 'Pending' : 'Online')}`,
             L + 6, y + 41, { width: COL_W - 12 });
    if (data.paymentId)
      doc.text(`Ref: ${data.paymentId}`, L + 6, y + 52, { width: COL_W - 12 });

    // Bill To
    const BX = L + COL_W + 6;
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#333333').text('Bill To', BX, y + 6);
    doc.fontSize(7).font('Helvetica').fillColor('#111111')
       .text(data.customer.name,  BX, y + 19, { width: COL_W - 12 })
       .text(data.customer.email, BX, y + 30, { width: COL_W - 12 });
    if (data.customer.phone)
      doc.text('Ph: ' + data.customer.phone, BX, y + 41, { width: COL_W - 12 });
    if (data.customer.address)
      doc.text(data.customer.address, BX, y + 52, { width: COL_W - 12 });

    // Ship To
    const SX = L + COL_W * 2 + 6;
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#333333').text('Ship To', SX, y + 6);
    doc.fontSize(7).font('Helvetica').fillColor('#111111')
       .text(data.customer.name, SX, y + 19, { width: COL_W - 12 });
    if (data.customer.address)
      doc.text(data.customer.address, SX, y + 30, { width: COL_W - 12 });
    const cityLine = [data.customer.city, data.customer.state, data.customer.pincode]
      .filter(Boolean).join(', ');
    if (cityLine) doc.text(cityLine, SX, y + 52, { width: COL_W - 12 });

    y += SEC_H + 2;

    // ── Items table (no GST — not GST registered) ──────────────────────────────
    // Columns: # | Description | Unit Price | Qty | Amount
    const colWidths = [28, 271, 72, 40, 104]; // sums to 515
    const HEADER_H  = 22;
    const ROW_H     = 18;

    doc.rect(L, y, PW, HEADER_H).fill('#e5e5e5').stroke('#aaaaaa');
    const headers = ['#', 'Description', 'Unit Price', 'Qty', 'Amount'];
    let cx = L;
    headers.forEach((h, i) => {
      doc.fontSize(7).font('Helvetica-Bold').fillColor('#111111')
         .text(h, cx + 3, y + 7,
               { width: colWidths[i] - 6, align: i >= 2 ? 'right' : 'left' });
      cx += colWidths[i];
    });
    y += HEADER_H;

    let grandTotal = 0;
    data.items.forEach((item, idx) => {
      const lineAmt = item.price * item.qty;
      grandTotal += lineAmt;

      doc.rect(L, y, PW, ROW_H).fill(idx % 2 === 0 ? '#ffffff' : '#f9f9f9');
      cx = L;
      colWidths.forEach(w => { doc.rect(cx, y, w, ROW_H).stroke('#dddddd'); cx += w; });

      const cells = [
        String(idx + 1),
        item.name,
        `₹${item.price.toFixed(2)}`,
        String(item.qty),
        `₹${lineAmt.toFixed(2)}`,
      ];
      cx = L;
      cells.forEach((cell, i) => {
        doc.fontSize(7).font('Helvetica').fillColor('#111111')
           .text(cell, cx + 3, y + 5,
                 { width: colWidths[i] - 6, align: i >= 2 ? 'right' : 'left', lineBreak: false, ellipsis: true });
        cx += colWidths[i];
      });
      y += ROW_H;
    });

    // Total row
    doc.rect(L, y, PW, ROW_H).fill('#e5e5e5').stroke('#aaaaaa');
    cx = L;
    ['', 'Total', '', '', `₹${grandTotal.toFixed(2)}`].forEach((cell, i) => {
      doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#111111')
         .text(cell, cx + 3, y + 5,
               { width: colWidths[i] - 6, align: i >= 2 ? 'right' : 'left', lineBreak: false });
      cx += colWidths[i];
    });
    y += ROW_H + 8;

    // Amount in words
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#333333')
       .text('Amount in Words: ', L, y, { continued: true })
       .font('Helvetica').fillColor('#111111').text(toWords(grandTotal).toUpperCase());
    y += 14;

    if (data.isProforma) {
      doc.fontSize(7).font('Helvetica').fillColor('#e07000')
         .text('* This is an estimated proforma invoice. Final pricing confirmed after order review.', L, y);
      y += 12;
    }

    // ── Terms ──────────────────────────────────────────────────────────────────
    y += 6;
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

    y += 6;
    doc.fontSize(6.5).font('Helvetica').fillColor('#aaaaaa')
       .text('This is a Computer Generated Invoice. No Stamp or Signature Required.',
             L, y, { width: PW, align: 'center' });

    doc.end();
  });
}

// ── Helpers used by API routes ────────────────────────────────────────────────

export function parsePrice(p: string | number): number {
  if (typeof p === 'number') return p;
  return parseFloat(String(p).replace(/[^0-9.]/g, '')) || 0;
}

export function shopOrderToInvoice(o: Record<string, unknown>, paid: boolean): InvoiceData {
  const shipping = (o.shipping as Record<string, string>) || {};
  const addrParts = [shipping.addr1, shipping.addr2].filter(Boolean).join(', ');

  const rawItems = (o.items as Array<Record<string, unknown>>) || [];
  const items: InvoiceItem[] = rawItems.map(i => ({
    name:  String(i.name || ''),
    qty:   Number(i.qty) || 1,
    price: parsePrice(i.price as string | number),
  }));

  const total = parsePrice(o.total as string | number);

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
    total,
    paymentMethod: paid ? 'Online (Razorpay)' : 'Cash on Delivery',
    paymentId:     String(o.paymentId || ''),
    isProforma:    !paid,
  };
}
