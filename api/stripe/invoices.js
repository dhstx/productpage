// Invoice PDF Generation and Download
import Stripe from 'stripe';
import PDFDocument from 'pdfkit';
import { asyncHandler } from '../middleware/errorHandler.js';
import db from '../utils/database.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const downloadInvoicePDF = asyncHandler(async (req, res) => {
  const { invoiceId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Get invoice from database
    const invoice = await db.invoices.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Verify invoice belongs to user
    if (invoice.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get full invoice details from Stripe
    const stripeInvoice = await stripe.invoices.retrieve(invoice.stripe_invoice_id);

    // If Stripe has a PDF URL, redirect to it
    if (stripeInvoice.invoice_pdf) {
      return res.redirect(stripeInvoice.invoice_pdf);
    }

    // Otherwise, generate PDF
    const pdfDoc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoice_number}.pdf"`);
    
    // Pipe PDF to response
    pdfDoc.pipe(res);

    // Generate PDF content
    generateInvoicePDF(pdfDoc, invoice, stripeInvoice);

    // Finalize PDF
    pdfDoc.end();

  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    res.status(500).json({ error: 'Failed to generate invoice PDF' });
  }
});

function generateInvoicePDF(doc, invoice, stripeInvoice) {
  // Header
  doc
    .fontSize(20)
    .text('DHStx', 50, 50)
    .fontSize(10)
    .text('AI-Powered Agent Platform', 50, 75)
    .text('https://dhstx.co', 50, 90);

  // Invoice title
  doc
    .fontSize(20)
    .text('INVOICE', 400, 50, { align: 'right' })
    .fontSize(10)
    .text(`Invoice #${invoice.invoice_number || 'N/A'}`, 400, 75, { align: 'right' })
    .text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 400, 90, { align: 'right' });

  // Line
  doc
    .moveTo(50, 120)
    .lineTo(550, 120)
    .stroke();

  // Bill to section
  doc
    .fontSize(12)
    .text('Bill To:', 50, 140)
    .fontSize(10)
    .text(stripeInvoice.customer_name || 'Customer', 50, 160)
    .text(stripeInvoice.customer_email || '', 50, 175);

  // Invoice details
  doc
    .fontSize(12)
    .text('Invoice Details:', 50, 220)
    .fontSize(10)
    .text(`Period: ${new Date(invoice.period_start).toLocaleDateString()} - ${new Date(invoice.period_end).toLocaleDateString()}`, 50, 240)
    .text(`Status: ${invoice.status.toUpperCase()}`, 50, 255);

  // Line items table
  const tableTop = 300;
  doc
    .fontSize(10)
    .text('Description', 50, tableTop, { bold: true })
    .text('Amount', 400, tableTop, { align: 'right', bold: true });

  doc
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  let y = tableTop + 25;

  // Add line items
  if (stripeInvoice.lines && stripeInvoice.lines.data) {
    stripeInvoice.lines.data.forEach((line) => {
      doc
        .fontSize(10)
        .text(line.description || 'Subscription', 50, y)
        .text(`$${(line.amount / 100).toFixed(2)}`, 400, y, { align: 'right' });
      y += 20;
    });
  }

  // Total
  doc
    .moveTo(50, y + 10)
    .lineTo(550, y + 10)
    .stroke();

  doc
    .fontSize(12)
    .text('Total:', 50, y + 25, { bold: true })
    .text(`$${(invoice.amount / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`, 400, y + 25, { align: 'right', bold: true });

  // Footer
  doc
    .fontSize(8)
    .text('Thank you for your business!', 50, 700, { align: 'center' })
    .text('DHStx - AI-Powered Agent Platform', 50, 715, { align: 'center' })
    .text('For questions, contact: support@dhstx.co', 50, 730, { align: 'center' });
}

export const listInvoices = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const invoices = await db.invoices.findByUserId(userId);
    res.json(invoices);
  } catch (error) {
    console.error('Error listing invoices:', error);
    res.status(500).json({ error: 'Failed to list invoices' });
  }
});

