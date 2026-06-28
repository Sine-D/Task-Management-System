import { Search, SlidersHorizontal, XCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setFilters, resetFilters } from '../store/slices/issueSlice';
import CustomSelect from './CustomSelect';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, SEVERITY_OPTIONS } from '../constants/issueConstants';

export default function IssueFilters({ filters }) {
  const dispatch = useDispatch();

  const update = (key, val) =>
    dispatch(setFilters({ [key]: val, page: 1 }));

  const hasActiveFilters = filters.search || filters.status || filters.priority || filters.severity;

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3 p-1">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-300 pointer-events-none"
        />
        <input
          type="search"
          value={filters.search}
          onChange={e => update('search', e.target.value)}
          placeholder="Search issues..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium text-white placeholder-dark-300
                     border border-white/[0.08] bg-transparent
                     focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30
                     transition-all duration-200"
        />
      </div>

      {/* Selects wrapper */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal size={15} className="text-dark-300 shrink-0" />
          <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider lg:hidden">Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
          {/* Status */}
          <CustomSelect
            name="status"
            value={filters.status}
            onChange={e => update('status', e.target.value)}
            className="w-full lg:w-36"
            label="All Status"
            options={[{ value: '', label: 'All Status' }, ...STATUS_OPTIONS]}
          />

          {/* Priority */}
          <CustomSelect
            name="priority"
            value={filters.priority}
            onChange={e => update('priority', e.target.value)}
            className="w-full lg:w-36"
            label="All Priority"
            options={[{ value: '', label: 'All Priority' }, ...PRIORITY_OPTIONS]}
          />

          {/* Severity */}
          <CustomSelect
            name="severity"
            value={filters.severity}
            onChange={e => update('severity', e.target.value)}
            className="w-full lg:w-36"
            label="All Severity"
            options={[{ value: '', label: 'All Severity' }, ...SEVERITY_OPTIONS]}
          />
        </div>
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 lg:py-1.5 rounded-xl lg:rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/10 lg:border-transparent transition-all text-xs font-semibold shrink-0"
        >
          <XCircle size={14} />
          Reset Filters
        </button>
      )}
    </div>
  );
}
