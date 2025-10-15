import React, { useState, useEffect } from 'react';
import { 
  Search as SearchIcon, 
  Description as FileTextIcon, 
  CalendarToday as CalendarIcon, 
  LocalOffer as TagIcon, 
  FilterList as FilterIcon 
} from '@mui/icons-material';

interface LawSummary {
  law_id: number;
  law_number: string;
  title: string;
  issue_id: number;
  publication_date: string;
  pdf_url: string;
  category: string;
  effective_date: string;
}

interface SearchFilters {
  query: string;
  from_date: string;
  to_date: string;
  category: string;
}

interface LegalSearchProps {
  onLawSelect?: (law: LawSummary) => void;
}

const LegalSearch: React.FC<LegalSearchProps> = ({ onLawSelect }) => {
  const [laws, setLaws] = useState<LawSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    from_date: '',
    to_date: '',
    category: '',
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 25,
    total: 0,
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Search laws when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.query || filters.from_date || filters.to_date || filters.category) {
        searchLaws();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/legal/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const searchLaws = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        page_size: pagination.page_size.toString(),
      });

      if (filters.query) params.append('q', filters.query);
      if (filters.from_date) params.append('from', filters.from_date);
      if (filters.to_date) params.append('to', filters.to_date);
      if (filters.category) params.append('category', filters.category);

      const response = await fetch(`/api/v1/legal/laws?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to search laws');
      }

      const data = await response.json();
      setLaws(data.items);
      setPagination(prev => ({
        ...prev,
        total: data.total,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Labor': 'bg-blue-100 text-blue-800',
      'Tax': 'bg-green-100 text-green-800',
      'Health': 'bg-red-100 text-red-800',
      'Education': 'bg-purple-100 text-purple-800',
      'Environment': 'bg-emerald-100 text-emerald-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Administration': 'bg-gray-100 text-gray-800',
      'Justice': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Legal Repository</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <FilterIcon className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search laws, articles, or keywords..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.from_date}
                onChange={(e) => handleFilterChange('from_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.to_date}
                onChange={(e) => handleFilterChange('to_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Searching laws...</p>
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <div className="text-red-600 mb-2">Error</div>
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {!loading && !error && laws.length === 0 && (
          <div className="p-8 text-center">
            <FileTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No laws found. Try adjusting your search criteria.</p>
          </div>
        )}

        {!loading && !error && laws.length > 0 && (
          <>
            <div className="p-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Found {pagination.total} laws
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {laws.map((law) => (
                <div
                  key={law.law_id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onLawSelect?.(law)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {law.title}
                        </h3>
                        {law.category && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(law.category)}`}>
                            {law.category}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        {law.law_number && (
                          <div className="flex items-center space-x-1">
                            <TagIcon className="w-4 h-4" />
                            <span>{law.law_number}</span>
                          </div>
                        )}
                        {law.publication_date && (
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(law.publication_date)}</span>
                          </div>
                        )}
                      </div>

                      {law.effective_date && (
                        <p className="text-sm text-gray-600">
                          Effective: {formatDate(law.effective_date)}
                        </p>
                      )}
                    </div>

                    {law.pdf_url && (
                      <a
                        href={law.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileTextIcon className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total > pagination.page_size && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {((pagination.page - 1) * pagination.page_size) + 1} to{' '}
                    {Math.min(pagination.page * pagination.page_size, pagination.total)} of{' '}
                    {pagination.total} results
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page * pagination.page_size >= pagination.total}
                      className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LegalSearch;
