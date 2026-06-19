import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import groupService from '../services/groupService';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import { FiUsers, FiBookOpen, FiBookmark, FiPlus, FiArrowRight, FiCheckCircle, FiSearch } from 'react-icons/fi';

const StudyGroups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('desc');

  // Debounced Search or trigger
  const [triggerFetch, setTriggerFetch] = useState(0);

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: 6, // 6 items per page fits grid well
          sortBy,
          sortDir,
        };

        if (subjectFilter) params.subject = subjectFilter;
        // In the backend, department and year search matches creator user details
        if (deptFilter) params.department = deptFilter;
        if (yearFilter) params.year = parseInt(yearFilter, 10);

        const res = await groupService.getAllGroups(params);
        if (res.success) {
          // If search query is present, client-side filter groupName/description since backend searches by parameters
          let items = res.data.content || [];
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            items = items.filter(
              (g) =>
                g.groupName.toLowerCase().includes(query) ||
                g.description?.toLowerCase().includes(query) ||
                g.subject.toLowerCase().includes(query)
            );
          }
          setGroups(items);
          setTotalPages(res.data.totalPages || 0);
          setTotalElements(res.data.totalElements || 0);
        }
      } catch (err) {
        console.error('Error fetching groups', err);
        toast.error('Failed to load study groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [currentPage, subjectFilter, deptFilter, yearFilter, sortBy, sortDir, triggerFetch]);

  // Handle Search Input Submit/Clear
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setCurrentPage(0);
    setTriggerFetch((p) => p + 1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setTriggerFetch((p) => p + 1);
  };

  // Join group handler
  const handleJoinGroup = async (groupId, groupName) => {
    try {
      const res = await groupService.joinGroup(groupId);
      if (res.success) {
        toast.success(`Request to join "${groupName}" submitted!`);
        // Refresh this page or navigate to details
        navigate(`/groups/${groupId}`);
      } else {
        toast.error(res.message || 'Failed to join group');
      }
    } catch (err) {
      console.error('Error joining group', err);
      toast.error(err.response?.data?.message || 'Failed to join group');
    }
  };

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Information Technology',
    'Business Administration',
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 select-none">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-3">
            <FiUsers className="text-primary w-7 h-7" />
            Study Groups
          </h1>
          <p className="text-xs font-semibold text-[#6E6E73] dark:text-[#86868B]">
            Browse and join collaborative study circles in your department.
          </p>
        </div>
        <button
          onClick={() => navigate('/groups/create')}
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold bg-primary hover:bg-primary-dark text-primary-text rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] border border-black/[0.04] dark:border-white/[0.04] cursor-pointer"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create Study Group</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-6 rounded-[28px] shadow-sm space-y-5">
        <form onSubmit={handleSearchSubmit} className="flex gap-4 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6E6E73] dark:text-[#86868B]">
              <FiSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groups by name, subject, topic..."
              className="w-full pl-11 pr-16 py-3 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#86868B]/60 rounded-full border border-black/[0.03] dark:border-white/[0.04] focus:border-primary/35 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.3)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors"
              >
                CLEAR
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 text-xs font-bold text-primary-text bg-primary hover:bg-primary-dark rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] border border-black/[0.04] dark:border-white/[0.04] cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-2">
          {/* Subject Filter */}
          <div className="space-y-1">
            <label className="block text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Subject</label>
            <input
              type="text"
              value={subjectFilter}
              onChange={(e) => {
                setSubjectFilter(e.target.value);
                setCurrentPage(0);
              }}
              placeholder="e.g. Java"
              className="w-full px-4 py-2.5 text-xs font-bold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73]/60 dark:placeholder-[#86868B]/40 rounded-full border border-black/[0.02] dark:border-white/[0.02] focus:border-primary/20 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]"
            />
          </div>

          {/* Department Filter */}
          <div className="space-y-1">
            <label className="block text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Department</label>
            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-4 py-2.5 text-xs font-bold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] rounded-full border border-black/[0.02] dark:border-white/[0.02] focus:border-primary/20 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="space-y-1">
            <label className="block text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Year</label>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-4 py-2.5 text-xs font-bold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] rounded-full border border-black/[0.02] dark:border-white/[0.02] focus:border-primary/20 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
            >
              <option value="">All Years</option>
              {[1, 2, 3, 4, 5].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>

          {/* Sort By Field */}
          <div className="space-y-1">
            <label className="block text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-4 py-2.5 text-xs font-bold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] rounded-full border border-black/[0.02] dark:border-white/[0.02] focus:border-primary/20 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
            >
              <option value="id">Created Date</option>
              <option value="groupName">Group Name</option>
              <option value="subject">Subject Topic</option>
            </select>
          </div>

          {/* Sort Direction */}
          <div className="space-y-1">
            <label className="block text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Direction</label>
            <select
              value={sortDir}
              onChange={(e) => {
                setSortDir(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-4 py-2.5 text-xs font-bold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] rounded-full border border-black/[0.02] dark:border-white/[0.02] focus:border-primary/20 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Reset Filters Toolbar Row */}
        {(subjectFilter || deptFilter || yearFilter || searchQuery || sortBy !== 'id' || sortDir !== 'desc') && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSubjectFilter('');
                setDeptFilter('');
                setYearFilter('');
                setSortBy('id');
                setSortDir('desc');
                setCurrentPage(0);
                setTriggerFetch((p) => p + 1);
              }}
              className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider select-none cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Grid of groups */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-56 bg-slate-200/30 dark:bg-white/[0.04] animate-pulse rounded-[28px]" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <EmptyState
          title="No Study Groups Found"
          description="We couldn't find any study groups matching your criteria. Try adjusting your filter tags or search text."
          actionLabel="Create a Study Group"
          onAction={() => navigate('/groups/create')}
        />
      ) : (
        <div className="space-y-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group) => {
              const isCreator = group.createdBy?.id === user?.id;
              const isFull = group.currentMembers >= group.maxMembers;

              return (
                <div
                  key={group.id}
                  className="glass-card p-8 rounded-[28px] premium-hover-card flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-4">
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2 select-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary text-[9px] font-black uppercase tracking-wider border border-black/[0.04] dark:border-white/[0.04]">
                        {group.subject}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B]">
                        <FiUsers className="w-3.5 h-3.5" />
                        {group.currentMembers}/{group.maxMembers}
                      </span>
                    </div>

                    {/* Group info */}
                    <div className="space-y-2">
                      <h3 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-snug line-clamp-1">
                        {group.groupName}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-[#6E6E73] dark:text-[#86868B] font-bold tracking-tight select-none">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-black/5 dark:bg-white/5 text-[#1D1D1F] dark:text-[#F5F5F7] text-[8px] font-black border border-black/[0.04] dark:border-white/[0.04]">
                          {group.createdBy?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span>Creator: {group.createdBy?.name} ({group.createdBy?.department})</span>
                      </div>
                      <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed line-clamp-3 pt-1 font-medium">
                        {group.description || 'No description provided for this study circle.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.04]">
                    <button
                      onClick={() => navigate(`/groups/${group.id}`)}
                      className="w-full py-2 px-4 text-xs font-bold bg-[#1D1D1F]/5 hover:bg-[#1D1D1F]/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#1D1D1F] dark:text-[#F5F5F7] rounded-full border border-black/[0.02] dark:border-white/[0.02] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      View Details
                    </button>
                    {!isCreator && (
                      <button
                        disabled={isFull}
                        onClick={() => handleJoinGroup(group.id, group.groupName)}
                        className={`w-full py-2 px-4 text-xs font-bold rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                          isFull
                            ? 'bg-black/5 dark:bg-white/5 text-[#6E6E73] dark:text-[#86868B] border border-black/[0.02] dark:border-white/[0.02] cursor-not-allowed'
                            : 'bg-primary hover:bg-primary-dark text-primary-text border border-black/[0.04] dark:border-white/[0.04] shadow-sm'
                        }`}
                      >
                        {isFull ? 'Group Full' : 'Request Join'}
                      </button>
                    )}
                    {isCreator && (
                      <div className="w-full text-center inline-flex items-center justify-center gap-1.5 text-[10px] font-bold text-primary bg-primary-50 border border-black/[0.04] dark:border-white/[0.04] py-2 rounded-full select-none">
                        <FiCheckCircle className="w-3.5 h-3.5" /> Owner
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="pt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGroups;
