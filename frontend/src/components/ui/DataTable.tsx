import React, { useState, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from 'lucide-react'
import { Input } from './Input'
import { Button } from './Button'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'
import { cn } from '@/utils/cn'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  pageSize?: number
  onRowClick?: (row: T) => void
  keyExtractor: (row: T) => string
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  searchable = true,
  searchPlaceholder = 'Filter records...',
  pageSize = 10,
  onRowClick,
  keyExtractor,
  emptyTitle = 'No Records Found',
  emptyDescription = 'No data available matching criteria.',
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter Data
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data
    const query = searchQuery.toLowerCase()

    return data.filter((row) => {
      return Object.keys(row).some((key) => {
        const val = row[key]
        if (val === null || val === undefined) return false
        return String(val).toLowerCase().includes(query)
      })
    })
  }, [data, searchQuery])

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

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

          <div className="text-[11px] text-[#8f8f8f] hidden sm:block">
            SHOWING <span className="text-[#171717] font-bold">{sortedData.length}</span> ENTRIES
          </div>
        </div>
      )}

      {/* Table Surface */}
      <div className="overflow-x-auto rounded-[10px] border border-[#ebebeb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#ebebeb] bg-[#fafafa] text-[#8f8f8f]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={cn(
                    'px-4 py-3 font-semibold uppercase tracking-wider',
                    col.sortable && 'cursor-pointer select-none hover:text-[#171717] transition-colors'
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-[#8f8f8f]">
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-[#171717]" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-[#171717]" />
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

          <tbody className="divide-y divide-[#ebebeb]">
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
                    'hover:bg-[#fafafa] transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col) => (
                    <td key={`${keyExtractor(row)}-${col.key}`} className="px-4 py-3 text-[#4d4d4d]">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-[#8f8f8f]">
          <div>
            Page <strong className="text-[#171717]">{currentPage}</strong> of{' '}
            <strong className="text-[#171717]">{totalPages}</strong> ({sortedData.length} records)
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="xs"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              aria-label="First page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>

            <span className="px-2 font-mono text-[11px] text-[#171717] font-semibold">
              {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="xs"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
