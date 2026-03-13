// src/components/admin/payment/usePayments.js
"use client"

import * as React from "react"
import { samplePayments } from "./sampleData"
import { v4 as uuidv4 } from "uuid"

/**
 * Simple in-memory payments hook.
 * Replace the internal functions with API calls when ready.
 */
export function usePayments(initial) {
  const [payments, setPayments] = React.useState(() => initial ?? samplePayments)

  const createPayment = async (payload) => {
    const p = { ...payload, id: payload.id ?? uuidv4(), createdAt: new Date().toISOString(), version: 1 }
    setPayments((prev) => [p, ...prev])
    return p
  }

  const updatePayment = async (payload) => {
    setPayments((prev) => prev.map((x) => (x.id === payload.id ? { ...payload, version: (x.version ?? 0) + 1 } : x)))
    return payload
  }

  const deletePayment = async (id) => {
    setPayments((prev) => prev.filter((x) => x.id !== id))
    return true
  }

  const addRefund = async (paymentId, refund) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, refunds: [...(p.refunds || []), { id: uuidv4(), createdAt: new Date().toISOString(), ...refund }] } : p))
    )
  }

  return {
    payments,
    setPayments,
    createPayment,
    updatePayment,
    deletePayment,
    addRefund,
  }
}