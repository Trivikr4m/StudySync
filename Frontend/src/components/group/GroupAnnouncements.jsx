import React, { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import SearchBar from '../common/SearchBar';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { FiBell, FiPlus, FiTrash, FiEdit, FiInfo } from 'react-icons/fi';
import announcementService from '../../services/announcementService';

const GroupAnnouncements = ({
  announcements,
  groupId,
  isCreator,
  isAdmin,
  onRefresh,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form bindings
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
    }
  });

  // Filter list
  const filteredAnnouncements = announcements.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Announcement permissions (restricted to ADMIN role on backend)
  const canManage = isAdmin; // The backend uses @PreAuthorize("hasRole('ADMIN')") for create/update/delete

  const handleOpenAdd = () => {
    setEditingAnnouncement(null);
    reset({ title: '', content: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (a) => {
    setEditingAnnouncement(a);
    reset({ title: a.title, content: a.content });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setActionLoading(true);
    try {
      const payload = {
        title: data.title,
        content: data.content,
        groupId: parseInt(groupId, 10),
      };

      let res;
      if (editingAnnouncement) {
        res = await announcementService.updateAnnouncement(editingAnnouncement.id, payload);
      } else {
        res = await announcementService.createAnnouncement(payload);
      }

      if (res.success) {
        toast.success(editingAnnouncement ? 'Announcement updated!' : 'Announcement posted!');
        setModalOpen(false);
        onRefresh();
      } else {
        toast.error(res.message || 'Failed to save announcement');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to post announcement. Admins only.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      const res = await announcementService.deleteAnnouncement(deleteId);
      if (res.success) {
        toast.success('Announcement deleted!');
        setDeleteId(null);
        onRefresh();
      } else {
        toast.error(res.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete announcement');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:max-w-xs">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search notices..."
          />
        </div>
        {canManage && (
          <Button
            variant="primary"
            size="sm"
            icon={FiPlus}
            onClick={handleOpenAdd}
            className="flex-shrink-0"
          >
            Post Notice
          </Button>
        )}
      </div>

      {/* Info Warning if student doesn't have privileges */}
      {!canManage && (
        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/10 p-3 rounded-xl">
          <FiInfo className="w-4 h-4 text-primary flex-shrink-0" />
          <span>Only campus administrators can post, edit, or delete notices.</span>
        </div>
      )}

      {/* Notice list */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-400 text-xs rounded-2xl bg-white dark:bg-darkbg-card">
            No announcements posted yet.
          </div>
        ) : (
          filteredAnnouncements.map(a => {
            const dateStr = a.createdDate
              ? new Date(a.createdDate).toLocaleDateString([], { dateStyle: 'short', timeStyle: 'short' })
              : 'Recent';

            return (
              <div 
                key={a.id}
                className="glass-panel p-5 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-100 dark:border-darkbg-border shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <FiBell className="text-primary w-4.5 h-4.5 flex-shrink-0" />
                      {a.title}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Posted on {dateStr} by Admin
                    </p>
                  </div>
                  {canManage && (
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEdit(a)}
                        className="p-1 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 transition-colors"
                      >
                        <FiEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(a.id)}
                        className="p-1 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 transition-colors"
                      >
                        <FiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-wrap pl-6">
                  {a.content}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Post Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAnnouncement ? 'Edit Announcement' : 'Post Announcement'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Notice Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Midterm prep reschedule"
              {...register('title', { required: 'Title is required', minLength: 3, maxLength: 150 })}
            />
            {errors.title && <p className="text-[9px] text-red-500 mt-0.5">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Notice Detail</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter announcement body..."
              {...register('content', { required: 'Content is required' })}
            />
            {errors.content && <p className="text-[9px] text-red-500 mt-0.5">{errors.content.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)} className="flex-1" disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="flex-1" loading={actionLoading}>
              Post Announcement
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Announcement"
        message="Are you sure you want to delete this notice? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  );
};

export default GroupAnnouncements;
