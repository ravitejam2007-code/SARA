import React, { useState, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from 'lucide-react'
import { Input } from './Input'
import { Button } from './Button'
import { Skeleton } from './Skeleton'
import { cn } from '@/utils/cn'

export interface Column<T> {
  key: string
  header: React.ReactNode
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (row: T) => string | number
  searchable?: boolean
  searchPlaceholder?: string
  searchFilter?: (row: T, query: string) => boolean
  pageSize?: number
  isLoading?: boolean
  emptyMessage?: string
  className?: string
  onRowClick?: (row: T) => void
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  searchable = true,
  searchPlaceholder = 'Filter records...',
  searchFilter,
  pageSize = 5,
  isLoading = false,
  emptyMessage = 'No records found matching current criteria.',
  className,
  onRowClick,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter Data
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data

    if (searchFilter) {
      return data.filter((row) => searchFilter(row, searchQuery))
    }

    const lowerQuery = searchQuery.toLowerCase()
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lowerQuery)
      )
    )
  }, [data, searchQuery, searchFilter])

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      if (aVal === bVal) return 0
      if (aVal === undefined || aVal === null) return 1
      if (bVal === undefined || bVal === null) return -1

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }, [filteredData, sortKey, sortDirection])

  // Paginate Data
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else {
        setSortKey(null)
        setSortDirection('asc')
      }
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }

  return (
    <div className={cn('w-full space-y-3 font-mono', className)}>
      {/* Table Controls (Search & Metrics) */}
      {searchable && (
        <div className="flex items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <Input
              sizeVariant="sm"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              leftIcon={<Search className="w-3.5 h-3.5" />}
              clearable
              onClear={() => {
                setSearchQuery('')
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="text-[11px] text-text-muted hidden sm:block">
            SHOWING <span className="text-text-primary font-bold">{sortedData.length}</span> ENTRIES
          </div>
        </div>
      )}

      {/* Table Surface */}
      <div className="overflow-x-auto rounded border border-border bg-surface">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-sunken/80 text-text-secondary">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={cn(
                    'px-4 py-3 font-semibold uppercase tracking-wider',
                    col.sortable && 'cursor-pointer select-none hover:text-text-primary transition-colors'
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-text-muted">
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={`loading-row-${i}`}>
                  {columns.map((col) => (
                    <td key={`loading-col-${col.key}`} className="px-4 py-3">
                      <Skeleton variant="text" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    'hover:bg-surface-elevated/80 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col) => (
                    <td key={`${keyExtractor(row)}-${col.key}`} className="px-4 py-3 text-text-primary">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-text-muted text-xs font-mono"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && sortedData.length > pageSize && (
        <div className="flex items-center justify-between text-xs text-text-secondary pt-1">
          <div className="text-[11px] text-text-muted">
            PAGE <span className="text-text-primary font-bold">{currentPage}</span> OF{' '}
            <span className="text-text-primary font-bold">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="xs"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              leftIcon={<ChevronLeft className="w-3 h-3" />}
            >
              PREV
            </Button>
            <Button
              variant="outline"
              size="xs"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              rightIcon={<ChevronRight className="w-3 h-3" />}
            >
              NEXT
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
