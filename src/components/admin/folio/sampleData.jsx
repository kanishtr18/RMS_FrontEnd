        // src/components/admin/folio/sampleData.js
export const FOLIO_STATUS = {
  OPEN: "OPEN",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
}

export const sampleFolios = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    folioNumber: "F-1001",
    name: "Ramesh Kumar",
    status: FOLIO_STATUS.OPEN,
    totalAmount: 14200.0,
    reservationId: "resv-101",
    bookingGuestId: "bg-101",
    createdAt: "2025-02-01T09:00:00.000Z",
    invoices: [
      {
        id: "inv-1",
        invoiceNumber: "INV-1001",
        amount: 13700.0,
        createdAt: "2025-02-01",
        payments: [
          // payments belong to invoice level
        ],
      },
      {
        id: "inv-2",
        invoiceNumber: "INV-1002",
        amount: 500.0,
        createdAt: "2025-02-01",
        payments: [],
      },
    ],
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    folioNumber: "F-1002",
    name: "Sonia Patel",
    status: FOLIO_STATUS.PAID,
    totalAmount: 10500.0,
    reservationId: "resv-102",
    bookingGuestId: "bg-102",
    createdAt: "2025-01-29T12:00:00.000Z",
    invoices: [
      {
        id: "inv-3",
        invoiceNumber: "INV-1003",
        amount: 10500.0,
        createdAt: "2025-01-29",
        payments: [
          { id: "p-1", amount: 10500.0, method: "Card", at: "2025-01-30" },
        ],
      },
    ],
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    folioNumber: "F-1003",
    name: "Vikram Shah",
    status: FOLIO_STATUS.PARTIAL,
    totalAmount: 12500.0,
    reservationId: "resv-201",
    bookingGuestId: "bg-201",
    createdAt: "2025-02-03T08:00:00.000Z",
    invoices: [
      {
        id: "inv-4",
        invoiceNumber: "INV-1004",
        amount: 12500.0,
        createdAt: "2025-02-03",
        payments: [{ id: "p-2", amount: 5000.0, method: "Cash", at: "2025-02-04" }],
      },
    ],
  },
]