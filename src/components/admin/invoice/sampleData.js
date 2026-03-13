// src/components/admin/invoice/sampleData.js
export const INVOICE_STATUS = {
  DRAFT: "DRAFT",
  ISSUED: "ISSUED",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
}

export const sampleInvoices = [
  {
    id: "1111-2222-3333-4444",
    invoiceNumber: "INV-2025-0001",
    issueDate: "2025-02-01T10:00:00Z",
    dueDate: "2025-02-05T00:00:00Z",
    totalAmount: 14200.0,
    taxAmount: 1700.0,
    status: INVOICE_STATUS.ISSUED,
    currency: "INR",
    version: 1,
    folioId: "11111111-1111-1111-1111-111111111111",
    reservationId: "resv-101",
    payments: [
      { id: "p-1", amount: 5000.0, method: "CASH", at: "2025-02-02T12:00:00Z" },
    ],
  },
  {
    id: "5555-6666-7777-8888",
    invoiceNumber: "INV-2025-0002",
    issueDate: "2025-01-29T12:00:00Z",
    dueDate: "2025-02-02T00:00:00Z",
    totalAmount: 10500.0,
    taxAmount: 0.0,
    status: INVOICE_STATUS.PAID,
    currency: "INR",
    version: 2,
    folioId: "22222222-2222-2222-2222-222222222222",
    reservationId: "resv-102",
    payments: [{ id: "p-2", amount: 10500.0, method: "CARD", at: "2025-01-30T08:30:00Z" }],
  },
]