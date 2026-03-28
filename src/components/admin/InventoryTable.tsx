"use client"

import { useState, useCallback } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Modal } from "@/components/ui/Modal"
import { formatCurrency } from "@/lib/utils"

interface InventoryItem {
  id: string
  itemCode: string
  name: string
  category: string
  stockQuantity: number
  minimumThreshold: number
  price: number
  unit: string
}

const CATEGORIES = ["Semua", "Oli & Fluida", "Filter", "Rem", "Suspensi", "Kelistrikan", "Body", "Lainnya"]

const columnHelper = createColumnHelper<InventoryItem>()

interface InventoryTableProps {
  initialData: InventoryItem[]
}

export function InventoryTable({ initialData }: InventoryTableProps) {
  const [data, setData] = useState<InventoryItem[]>(initialData)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Semua")
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    itemCode: "",
    name: "",
    category: "Oli & Fluida",
    stockQuantity: 0,
    minimumThreshold: 5,
    price: 0,
    unit: "pcs",
  })

  const handleEdit = useCallback((item: InventoryItem) => {
    setEditingItem(item)
    setForm({
      itemCode: item.itemCode,
      name: item.name,
      category: item.category,
      stockQuantity: item.stockQuantity,
      minimumThreshold: item.minimumThreshold,
      price: item.price,
      unit: item.unit,
    })
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback((id: string) => {
    setDeletingId(id)
    setDeleteModalOpen(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingItem) {
        const res = await fetch(`/api/admin/inventory?id=${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const updated = await res.json()
          setData((prev) => prev.map((item) => (item.id === editingItem.id ? updated : item)))
        }
      } else {
        const res = await fetch("/api/admin/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const created = await res.json()
          setData((prev) => [created, ...prev])
        }
      }
      setModalOpen(false)
      setEditingItem(null)
      setForm({ itemCode: "", name: "", category: "Oli & Fluida", stockQuantity: 0, minimumThreshold: 5, price: 0, unit: "pcs" })
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/inventory?id=${deletingId}`, { method: "DELETE" })
      if (res.ok) {
        setData((prev) => prev.filter((item) => item.id !== deletingId))
      }
      setDeleteModalOpen(false)
      setDeletingId(null)
    } finally {
      setLoading(false)
    }
  }

  const filteredData = categoryFilter === "Semua"
    ? data
    : data.filter((item) => item.category === categoryFilter)

  const columns = [
    columnHelper.accessor("itemCode", {
      header: "Kode Item",
      cell: (info) => (
        <span className="font-mono text-xs font-semibold text-gray-600">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("name", {
      header: "Nama Item",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Package size={14} className="text-gray-400" />
          <span className="font-medium text-gray-900">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Kategori",
      cell: (info) => <Badge variant="info">{info.getValue()}</Badge>,
    }),
    columnHelper.accessor("stockQuantity", {
      header: "Stok",
      cell: (info) => {
        const item = info.row.original
        const isLow = info.getValue() <= item.minimumThreshold
        return (
          <div className="flex items-center gap-2">
            {isLow && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
            )}
            <span
              className={`font-semibold ${isLow ? "text-red-600" : "text-gray-900"}`}
            >
              {info.getValue()}
            </span>
            <span className="text-xs text-gray-400">{item.unit}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("minimumThreshold", {
      header: "Min. Stok",
      cell: (info) => (
        <span className="text-sm text-gray-500">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("price", {
      header: "Harga",
      cell: (info) => (
        <span className="font-medium text-gray-900">{formatCurrency(info.getValue())}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Cari kode item, nama..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <Button
          onClick={() => {
            setEditingItem(null)
            setForm({ itemCode: "", name: "", category: "Oli & Fluida", stockQuantity: 0, minimumThreshold: 5, price: 0, unit: "pcs" })
            setModalOpen(true)
          }}
        >
          <Plus size={16} className="mr-2" />
          Tambah Item
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-1 ${header.column.getCanSort() ? "cursor-pointer select-none" : ""}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="text-gray-300">
                              {header.column.getIsSorted() === "asc" ? (
                                <ArrowUp size={12} />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ArrowDown size={12} />
                              ) : (
                                <ArrowUpDown size={12} />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-gray-400">
                    <Package size={32} className="mx-auto mb-2 text-gray-200" />
                    <p>Tidak ada item ditemukan</p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination info */}
        <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-400">
          Menampilkan {table.getRowModel().rows.length} dari {filteredData.length} item
          {data.filter((i) => i.stockQuantity <= i.minimumThreshold).length > 0 && (
            <span className="ml-3 inline-flex items-center gap-1 text-red-500">
              <AlertTriangle size={12} />
              {data.filter((i) => i.stockQuantity <= i.minimumThreshold).length} item stok rendah
            </span>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingItem(null) }}
        title={editingItem ? "Edit Item" : "Tambah Item Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kode Item"
              value={form.itemCode}
              onChange={(e) => setForm({ ...form, itemCode: e.target.value })}
              placeholder="e.g. OIL-001"
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                {CATEGORIES.slice(1).map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Input
            label="Nama Item"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama item"
            required
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Stok"
              type="number"
              value={form.stockQuantity}
              onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })}
              min={0}
            />
            <Input
              label="Min. Stok"
              type="number"
              value={form.minimumThreshold}
              onChange={(e) => setForm({ ...form, minimumThreshold: Number(e.target.value) })}
              min={0}
            />
            <Input
              label="Satuan"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              placeholder="pcs"
            />
          </div>
          <Input
            label="Harga (IDR)"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            min={0}
            required
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" className="flex-1" loading={loading}>
              {editingItem ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
        size="sm"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-7 w-7 text-red-600" />
          </div>
          <p className="text-gray-600">Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.</p>
          <div className="mt-6 flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setDeleteModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700" onClick={confirmDelete} loading={loading}>
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
