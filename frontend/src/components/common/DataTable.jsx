import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import Loader from './Loader';
import EmptyState from './EmptyState';

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  searchPlaceholder = 'Search records...',
  searchKey = '',
  filters = null,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records matching your request.',
  pageSize = 10,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  // Filter & Search
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    if (searchKey && item[searchKey]) {
      return String(item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase());
    }
    // Search all values
    return Object.values(item).some(
      (val) => val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-forest-700/50">
      {/* Controls Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-forest-800/80 bg-obsidian-900/40">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full glass-input pl-10 pr-4 py-2"
          />
        </div>

        {filters && <div className="flex items-center gap-3 w-full sm:w-auto">{filters}</div>}
      </div>

      {/* Table Body */}
      {loading ? (
        <Loader />
      ) : paginatedData.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-obsidian-900/90 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-forest-800">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    onClick={() => col.sortable && col.accessor && handleSort(col.accessor)}
                    className={`py-3.5 px-4 sm:px-6 ${
                      col.sortable ? 'cursor-pointer hover:text-emerald-400 select-none' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-850/60">
              {paginatedData.map((row, rIdx) => (
                <tr
                  key={row._id || rIdx}
                  className="hover:bg-forest-800/30 transition-colors duration-150 group"
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="py-3.5 px-4 sm:px-6 font-normal">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && sortedData.length > 0 && (
        <div className="p-4 sm:px-6 flex items-center justify-between border-t border-forest-800/80 bg-obsidian-900/30 text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-200">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-slate-200">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-200">{sortedData.length}</span> records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-forest-700/60 hover:bg-forest-800/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-slate-300 font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-forest-700/60 hover:bg-forest-800/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
