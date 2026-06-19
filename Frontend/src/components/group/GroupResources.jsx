import React, { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import SearchBar from '../common/SearchBar';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiFileText, FiPlus, FiTrash, FiDownload, FiExternalLink, FiSearch, FiFolder, FiGlobe, FiEye } from 'react-icons/fi';
import resourceService from '../../services/resourceService';

const GroupResources = ({
  resources,
  groupId,
  isCreator,
  isAdmin,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Form bindings
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      fileUrl: '',
    }
  });

  // Filter lists based on search AND selected Category
  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All') return matchesSearch;
    const cat = getFileCategory(r);
    return matchesSearch && cat === selectedCategory;
  });

  const getFileCategory = (res) => {
    const url = (res.fileUrl || '').toLowerCase();
    if (url.endsWith('.pdf') || url.includes('pdf')) return 'PDF';
    if (url.includes('google.com/spreadsheets') || url.includes('.xlsx') || url.includes('.xls') || url.includes('.csv')) return 'Spreadsheet';
    if (url.includes('google.com/presentation') || url.includes('.pptx') || url.includes('.ppt')) return 'Presentation';
    if (url.includes('google.com/document') || url.includes('.docx') || url.includes('.doc') || url.includes('.txt')) return 'Document';
    if (url.startsWith('http') && !url.includes('drive.google.com/file') && !url.includes('dropbox.com')) return 'Link';
    return 'File';
  };

  const getCategoryCount = (categoryName) => {
    if (categoryName === 'All') return resources.length;
    return resources.filter(r => getFileCategory(r) === categoryName).length;
  };

  const renderFileThumbnail = (res, category) => {
    switch (category) {
      case 'PDF':
        return (
          <div className="relative w-full h-32 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-color flex flex-col justify-between p-4 overflow-hidden select-none">
            {/* PDF mockup lines */}
            <div className="space-y-2 opacity-60">
              <div className="h-2 w-3/4 bg-black/20 dark:bg-white/20 rounded-full" />
              <div className="h-2 w-5/6 bg-black/10 dark:bg-white/10 rounded-full" />
              <div className="h-2 w-2/3 bg-black/10 dark:bg-white/10 rounded-full" />
            </div>
            {/* PDF icon badge */}
            <div className="self-end px-2.5 py-1 text-[10px] font-black bg-primary text-primary-text rounded-lg shadow-sm">
              PDF
            </div>
          </div>
        );
      case 'Spreadsheet':
        return (
          <div className="relative w-full h-32 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-color flex flex-col justify-between p-4 overflow-hidden select-none">
            {/* Spreadsheet mockup grid cells */}
            <div className="grid grid-cols-4 gap-2 opacity-50">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-3 bg-black/20 dark:bg-white/20 rounded-sm" />
              ))}
            </div>
            {/* Badge */}
            <div className="self-end px-2.5 py-1 text-[10px] font-black bg-primary text-primary-text rounded-lg shadow-sm">
              XLSX
            </div>
          </div>
        );
      case 'Presentation':
        return (
          <div className="relative w-full h-32 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-color flex flex-col justify-between p-4 overflow-hidden select-none">
            {/* Presentation slide mockup */}
            <div className="w-full h-12 bg-black/[0.04] dark:bg-white/[0.04] rounded-lg border border-color flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40" />
            </div>
            {/* Badge */}
            <div className="self-end px-2.5 py-1 text-[10px] font-black bg-primary text-primary-text rounded-lg shadow-sm">
              KEYNOTE
            </div>
          </div>
        );
      case 'Document':
        return (
          <div className="relative w-full h-32 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-color flex flex-col justify-between p-4 overflow-hidden select-none">
            {/* Document mockup lines */}
            <div className="space-y-2 opacity-65">
              <div className="h-2 w-full bg-black/20 dark:bg-white/20 rounded-full" />
              <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded-full" />
              <div className="h-2 w-3/4 bg-black/10 dark:bg-white/10 rounded-full" />
            </div>
            {/* Badge */}
            <div className="self-end px-2.5 py-1 text-[10px] font-black bg-primary text-primary-text rounded-lg shadow-sm">
              DOC
            </div>
          </div>
        );
      case 'Link':
        return (
          <div className="relative w-full h-32 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-color flex flex-col justify-between p-4 overflow-hidden select-none">
            {/* Link mockup URL preview box */}
            <div className="flex items-center gap-1.5 opacity-60">
              <div className="w-1.5 h-1.5 rounded-full bg-black/30 dark:bg-white/30" />
              <div className="h-2 w-16 bg-black/15 dark:bg-white/15 rounded-full" />
            </div>
            {/* Badge */}
            <div className="self-end px-2.5 py-1 text-[10px] font-black bg-primary text-primary-text rounded-lg shadow-sm">
              LINK
            </div>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-32 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-color flex flex-col justify-between p-4 overflow-hidden select-none">
            {/* Standard mockup */}
            <div className="w-8 h-8 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center">
              <FiFileText className="w-4 h-4 text-secondary" />
            </div>
            {/* Badge */}
            <div className="self-end px-2.5 py-1 text-[10px] font-black bg-primary text-primary-text rounded-lg shadow-sm">
              FILE
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 pt-4">
      {/* Search and Action Header */}
      <div className="flex flex-col md:flex-row sm:items-center justify-between gap-6 pb-2 select-none">
        {/* Spotlight-inspired search bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6E6E73] dark:text-[#86868B]">
            <FiSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files, resources, links..."
            className="w-full pl-11 pr-12 py-3 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#86868B]/60 rounded-full border border-black/[0.03] dark:border-white/[0.04] focus:border-primary/35 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.3)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors"
            >
              CLEAR
            </button>
          )}
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-text rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-sm cursor-pointer select-none"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Category Navigation Bar (Files App Sidebar Categories in Horizontal Pills format) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 select-none border-b border-black/[0.04] dark:border-white/[0.04]">
        {['All', 'PDF', 'Document', 'Spreadsheet', 'Presentation', 'Link'].map((cat) => {
          const count = getCategoryCount(cat);
          const active = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                active
                  ? 'bg-primary text-primary-text shadow-sm'
                  : 'text-[#6E6E73] dark:text-[#86868B] bg-black/[0.03] dark:bg-white/5 hover:bg-black/[0.06] dark:hover:bg-white/10'
              }`}
            >
              <span>{cat === 'All' ? 'All Files' : cat === 'Link' ? 'Web Links' : `${cat}s`}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                active
                  ? 'bg-white/20 text-white'
                  : 'bg-black/5 dark:bg-white/10 text-[#6E6E73] dark:text-[#86868B]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of resource items */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResources.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center text-[#6E6E73] dark:text-[#86868B] text-xs rounded-[28px] font-semibold border border-black/[0.03] dark:border-white/[0.04] select-none">
            No study materials found under this category.
          </div>
        ) : (
          filteredResources.map(r => {
            const cat = getFileCategory(r);
            const isLink = cat === 'Link';
            const showDelete = isCreator || isAdmin || r.uploadedBy?.email === r.uploadedBy?.email; // Organizer / Creator delete permission

            return (
              <div 
                key={r.id}
                className="glass-card p-6 rounded-[28px] premium-hover-card flex flex-col justify-between shadow-sm border border-black/[0.02] dark:border-white/[0.02]"
              >
                <div className="space-y-4">
                  {/* Visual mockup preview representing files preview */}
                  {renderFileThumbnail(r, cat)}

                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-snug line-clamp-1 select-none" title={r.title}>
                        {r.title}
                      </h4>
                      {showDelete && (
                        <button
                          onClick={() => setDeleteId(r.id)}
                          className="p-1.5 text-[#6E6E73] dark:text-[#86868B] hover:text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                          aria-label="Delete resource"
                        >
                          <FiTrash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    
                    <p className="text-[10px] text-[#6E6E73] dark:text-[#86868B] font-bold tracking-tight select-none">
                      Uploaded by: {r.uploadedBy?.name || 'Member'}
                    </p>
                    <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed line-clamp-3 font-medium pt-1">
                      {r.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.04] mt-6">
                  {isLink ? (
                    <a
                      href={r.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7] bg-black/[0.03] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <FiExternalLink className="w-3.5 h-3.5" /> Open Web Resource
                    </a>
                  ) : (
                    <a
                      href={r.fileUrl}
                      download
                      className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 text-xs font-bold text-primary-text bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    >
                      <FiDownload className="w-3.5 h-3.5" /> Download Document
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Upload Modal (Spotlight styled form dialog) */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Study Resource"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Resource Title</label>
            <input
              type="text"
              className="w-full px-4 py-3 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73]/50 dark:placeholder-[#86868B]/40 rounded-full border border-black/[0.02] dark:border-white/[0.02] focus:border-primary/20 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
              placeholder="e.g. Midterm formula reference sheet"
              {...register('title', { required: 'Title is required', minLength: 3, maxLength: 150 })}
            />
            {errors.title && <p className="text-[9px] text-red-500 mt-0.5 font-bold">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Description</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73]/50 dark:placeholder-[#86868B]/40 rounded-2xl border border-black/[0.02] dark:border-white/[0.02] focus:border-primary/20 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300 resize-none"
              placeholder="Explain what this document or link covers..."
              {...register('description')}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Resource Link / Document URL</label>
            <input
              type="text"
              className="w-full px-4 py-3 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73]/50 dark:placeholder-[#86868B]/40 rounded-full border border-black/[0.02] dark:border-white/[0.02] focus:border-primary/20 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
              placeholder="e.g. https://drive.google.com/..."
              {...register('fileUrl', { required: 'Link or file URL is required' })}
            />
            {errors.fileUrl && <p className="text-[9px] text-red-500 mt-0.5 font-bold">{errors.fileUrl.message}</p>}
          </div>

          <div className="flex gap-3 pt-4 border-t border-black/[0.04] dark:border-white/[0.04]">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)} className="flex-1 rounded-full cursor-pointer py-2.5 font-bold" disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="flex-1 rounded-full cursor-pointer py-2.5 font-bold" loading={actionLoading}>
              Add Resource
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Study Resource"
        message="Are you sure you want to delete this study material link? Group members will lose access to it."
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  );

};

export default GroupResources;
