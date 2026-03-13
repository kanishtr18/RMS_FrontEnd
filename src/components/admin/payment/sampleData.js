// src/components/admin/payment/sampleData.js
export const PAYMENT_METHOD = {
  CASH: "CASH",
  CARD: "CARD",
  UPI: "UPI",
  WALLET: "WALLET",
  BANK_TRANSFER: "BANK_TRANSFER",
}

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
}

export const samplePayments = [
  {
    id: "11111111-aaaa-1111-aaaa-111111111111",
    amount: 5000.0,
    paymentMethod: PAYMENT_METHOD.CASH,
    transactionRef: "TXN-CASH-1001",
    currency: "INR",
    status: PAYMENT_STATUS.COMPLETED,
    providerResponse: "Cash received at POS - receipt #1001",
    processedAt: "2025-02-02T12:00:00.000Z",
    invoiceId: "inv-1",
    version: 1,
    createdAt: "2025-02-02T12:00:00.000Z",
    refunds: [
      // sample refund
      { id: "r-1", amount: 1000.0, reason: "Partial refund - service", createdAt: "2025-02-03T09:00:00.000Z" },
    ],
  },
  {
    id: "22222222-bbbb-2222-bbbb-222222222222",
    amount: 10500.0,
    paymentMethod: PAYMENT_METHOD.CARD,
    transactionRef: "CARD-4242-1002",
    currency: "INR",
    status: PAYMENT_STATUS.COMPLETED,
    providerResponse: JSON.stringify({ gateway: "Razorpay", id: "rp_abc123", auth: "approved" }),
    processedAt: "2025-01-30T08:30:00.000Z",
    invoiceId: "inv-3",
    version: 2,
    createdAt: "2025-01-30T08:30:00.000Z",
    refunds: [],
  },
  {
    id: "33333333-cccc-3333-cccc-333333333333",
    amount: 5000.0,
    paymentMethod: PAYMENT_METHOD.UPI,
    transactionRef: "UPI-9999-0001",
    currency: "INR",
    status: PAYMENT_STATUS.PENDING,
    providerResponse: null,
    processedAt: null,
    invoiceId: "inv-4",
    version: 1,
    createdAt: "2025-02-04T10:00:00.000Z",
    refunds: [],
  },
]