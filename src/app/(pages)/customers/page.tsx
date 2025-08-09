'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PencilSimple, Trash, Plus, Check, X } from '@phosphor-icons/react'
import CustomerForm from '@/components/Form/CustomerForm'

type Customer = {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  gstin?: string
  stateCode?: string
  priceCategory?: string
  creditLimit?: number
  isActive?: boolean
  organizationId?: string
}

const API_URL = '/api/master/customer'

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<Customer>>({})
  const [editingId, setEditingId] = useState<string | null>(null)

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      const orgId = localStorage.getItem('organizationId')
      const url = orgId ? `${API_URL}?organizationId=${orgId}` : API_URL
      const res = await fetch(url)
      const data = await res.json()
      setCustomers(data)
    } catch (e: any) {
      setError('Failed to fetch customers')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Handle form change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(f => ({
      ...f,
      [name]:
        name === 'isActive'
          ? value === 'true'
          : name === 'creditLimit'
          ? Number(value)
          : value,
    }))
  }

  // Add or update customer
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `${API_URL}?id=${editingId}` : API_URL
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setShowForm(false)
        setForm({})
        setEditingId(null)
        fetchCustomers()
      } else {
        setError(data.error || 'Error')
      }
    } catch (e: any) {
      setError('Error saving customer')
    }
    setLoading(false)
  }

  // Delete customer
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this customer?')) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        fetchCustomers()
      } else {
        setError(data.error || 'Error')
      }
    } catch (e: any) {
      setError('Error deleting customer')
    }
    setLoading(false)
  }

  // Edit customer
  const handleEdit = (customer: Customer) => {
    setForm(customer)
    setEditingId(customer.id)
    setShowForm(true)
  }

  // New customer
  const handleNew = () => {
    setForm({})
    setEditingId(null)
    setShowForm(true)
  }

  return (
    <div className="p-2 min-h-screen">
    <motion.div
  className="mb-6 flex items-center justify-between"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <div className="flex items-center gap-3">
    <div
      className="w-2 h-10 rounded bg-[var(--color-primary)] shadow"
      aria-hidden="true"
    />
    <div className="flex items-center gap-2">
      {/* You can use a user icon or address book icon for customers */}
      <svg
        width={32}
        height={32}
        fill="none"
        viewBox="0 0 24 24"
        className="text-[var(--color-primary)]"
        style={{ display: "inline" }}
      >
        <circle cx="12" cy="8" r="4" fill="currentColor" />
        <path
          d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
      <h1
        className="text-3xl font-bold tracking-tight drop-shadow"
        style={{
          color: "var(--color-card-foreground)",
          letterSpacing: "-0.02em",
        }}
      >
        Customers
      </h1>
    </div>
  </div>
  {!showForm ? (
    <button
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow border hover:opacity-90 transition-opacity"
      style={{
        background: "var(--color-primary)",
        color: "var(--color-primary-foreground)",
        borderColor: "var(--color-border)",
      }}
      onClick={handleNew}
    >
      <Plus size={20} weight="bold" /> Add Customer
    </button>
  ) : (
    <button
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow border hover:opacity-90 transition-opacity"
      style={{
        background: "var(--color-muted)",
        color: "var(--color-muted-foreground)",
        borderColor: "var(--color-border)",
      }}
      onClick={() => {
        setShowForm(false);
        setEditingId(null);
        setForm({});
      }}
    >
      <X size={20} weight="bold" /> Back to List
    </button>
  )}
</motion.div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* Customer Form or List */}
      {showForm ? (
        <CustomerForm
          form={form}
          editingId={editingId}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingId(null); setForm({}) }}
        />
      ) : (
        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <table className="min-w-full rounded-xl overflow-hidden shadow border" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--color-card-foreground)' }}>
            <thead style={{ background: 'var(--color-muted)' }}>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">GSTIN</th>
                <th className="px-4 py-2 text-left">State Code</th>
                <th className="px-4 py-2 text-left">Price Category</th>
                <th className="px-4 py-2 text-left">Credit Limit</th>
                <th className="px-4 py-2 text-left">Active</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">No customers found.</td>
                </tr>
              )}
              {customers.map(customer => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <td className="px-4 py-2">{customer.name}</td>
                  <td className="px-4 py-2">{customer.phone}</td>
                  <td className="px-4 py-2">{customer.email}</td>
                  <td className="px-4 py-2">{customer.gstin}</td>
                  <td className="px-4 py-2">{customer.stateCode}</td>
                  <td className="px-4 py-2">{customer.priceCategory}</td>
                  <td className="px-4 py-2">{customer.creditLimit}</td>
                  <td className="px-4 py-2">{customer.isActive ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="p-2 rounded-lg border shadow"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-accent-foreground)', borderColor: 'var(--color-border)' }}
                      onClick={() => handleEdit(customer)}
                    >
                      <PencilSimple size={18} />
                    </button>
                    <button
                      className="p-2 rounded-lg border shadow"
                      style={{ background: 'var(--color-destructive)', color: 'var(--color-destructive-foreground)', borderColor: 'var(--color-border)' }}
                      onClick={() => handleDelete(customer.id)}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}

export default CustomerPage;