import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import meetingService from '../services/meetingService';
import groupService from '../services/groupService';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiMapPin, FiPlus, FiTrash, FiEdit, FiVideo, FiBookmark } from 'react-icons/fi';

const Meetings = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Data State
  const [meetings, setMeetings] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Action state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [deleteMeetingId, setDeleteMeetingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form bindings
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      meetingDate: '',
      meetingTime: '',
      location: '',
      groupId: '',
    }
  });

  const loadMeetingsData = async () => {
    try {
      const meetingsRes = await meetingService.getAllMeetings();
      if (meetingsRes.success) {
        setMeetings(meetingsRes.data || []);
      }

      // Fetch groups to select from when scheduling
      const groupsFromMeetings = new Set();
      if (meetingsRes.success && meetingsRes.data) {
        meetingsRes.data.forEach(m => {
          if (m.groupId) groupsFromMeetings.add(m.groupId);
        });
      }
      
      const localJoined = JSON.parse(localStorage.getItem('joinedGroups') || '[]');
      const localJoinedSet = new Set(localJoined);

      const groupsRes = await groupService.getAllGroups({ size: 100 });
      if (groupsRes.success && groupsRes.data) {
        const allGroups = groupsRes.data.content || [];
        const filtered = allGroups.filter(g => 
          g.createdBy?.id === user?.id || 
          groupsFromMeetings.has(g.id) ||
          localJoinedSet.has(g.id)
        );
        setMyGroups(filtered);
      }
    } catch (err) {
      console.error('Failed to load meetings logs', err);
      toast.toast.error('Failed to load meetings schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetingsData();
  }, [user]);

  // Split date/times
  const now = new Date();
  const getMeetingDateTime = (m) => new Date(m.meetingDate + 'T' + (m.meetingTime.substring(0, 5) || '00:00') + ':00');
  
  const upcomingMeetings = meetings
    .filter(m => getMeetingDateTime(m) >= now)
    .sort((a, b) => getMeetingDateTime(a) - getMeetingDateTime(b));

  const pastMeetings = meetings
    .filter(m => getMeetingDateTime(m) < now)
    .sort((a, b) => getMeetingDateTime(b) - getMeetingDateTime(a));

  const handleOpenAdd = () => {
    setEditingMeeting(null);
    reset({
      title: '',
      description: '',
      meetingDate: new Date().toISOString().split('T')[0],
      meetingTime: '12:00',
      location: '',
      groupId: myGroups[0]?.id || '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMeeting(m);
    reset({
      title: m.title,
      description: m.description || '',
      meetingDate: m.meetingDate,
      meetingTime: m.meetingTime.substring(0, 5),
      location: m.location,
      groupId: m.groupId,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setActionLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        meetingDate: data.meetingDate,
        meetingTime: data.meetingTime.length === 5 ? data.meetingTime + ':00' : data.meetingTime,
        location: data.location,
        groupId: parseInt(data.groupId, 10),
      };

      let res;
      if (editingMeeting) {
        res = await meetingService.updateMeeting(editingMeeting.id, payload);
      } else {
        res = await meetingService.createMeeting(payload);
      }

      if (res.success) {
        toast.success(editingMeeting ? 'Meeting updated!' : 'Meeting scheduled!');
        setModalOpen(false);
        loadMeetingsData();
      } else {
        toast.error(res.message || 'Failed to save meeting');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save meeting');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteMeetingId) return;
    setActionLoading(true);
    try {
      const res = await meetingService.deleteMeeting(deleteMeetingId);
      if (res.success) {
        toast.success('Meeting deleted!');
        setDeleteMeetingId(null);
        loadMeetingsData();
      } else {
        toast.error(res.message || 'Failed to delete meeting');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel meeting');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 py-4">
        <div className="flex justify-between items-center select-none">
          <h1 className="text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-3">
            <FiCalendar className="text-main w-7 h-7" />
            Meetings Schedule
          </h1>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-64 bg-slate-200/30 dark:bg-white/[0.04] animate-pulse rounded-[28px] border border-black/[0.03] dark:border-white/[0.03]" />
          <div className="h-64 bg-slate-200/30 dark:bg-white/[0.04] animate-pulse rounded-[28px] border border-black/[0.03] dark:border-white/[0.03]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 select-none">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-3">
            <FiCalendar className="text-main w-7 h-7" />
            Meetings Schedule
          </h1>
          <p className="text-xs font-semibold text-[#6E6E73] dark:text-[#86868B]">
            Coordinate synchronous review agendas, sessions, and college meet links.
          </p>
        </div>
        {myGroups.length > 0 && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-text rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-sm cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Schedule Session</span>
          </button>
        )}
      </div>

      {myGroups.length === 0 ? (
        <EmptyState
          title="No Groups Found"
          description="You must join or create a study group before you can view or schedule collaborative meetings."
          actionLabel="Find Study Groups"
          onAction={() => navigate('/groups')}
        />
      ) : meetings.length === 0 ? (
        <EmptyState
          title="No Meetings Scheduled"
          description="There are no active upcoming or historical meetings associated with your groups."
          actionLabel="Schedule First Session"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-10">
          {/* Upcoming Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between select-none px-1">
              <h3 className="text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">
                UPCOMING MEETINGS ({upcomingMeetings.length})
              </h3>
            </div>
            {upcomingMeetings.length === 0 ? (
              <div className="glass-card p-10 text-center text-[#6E6E73] dark:text-[#86868B] text-xs font-bold rounded-[28px] border border-black/[0.03] dark:border-white/[0.03] shadow-sm select-none">
                No upcoming sessions scheduled.
              </div>
            ) : (
              <div className="space-y-5">
                {upcomingMeetings.map(m => {
                  const dt = getMeetingDateTime(m);
                  const isLink = m.location?.startsWith('http');
                  const showControls = isAdmin;

                  return (
                    <div 
                      key={m.id}
                      className="glass-card p-8 rounded-[28px] premium-hover-card border border-black/[0.02] dark:border-white/[0.02] shadow-sm space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-main text-[9px] font-black uppercase tracking-wider border border-color flex items-center gap-1.5 max-w-max mb-2 select-none">
                              <FiBookmark className="w-3.5 h-3.5" /> {m.groupName}
                            </span>
                            <h4 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-snug">{m.title}</h4>
                          </div>
                          {showControls && (
                            <div className="flex gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => handleOpenEdit(m)}
                                className="p-2 hover:text-primary hover:bg-black/[0.03] dark:hover:bg-white/5 rounded-full text-[#6E6E73] dark:text-[#86868B] transition-colors"
                              >
                                <FiEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteMeetingId(m.id)}
                                className="p-2 hover:text-red-500 hover:bg-black/[0.03] dark:hover:bg-white/5 rounded-full text-[#6E6E73] dark:text-[#86868B] transition-colors"
                              >
                                <FiTrash className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed whitespace-pre-wrap font-medium">
                          {m.description || 'No agenda detailed.'}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2.5 pt-4 border-t border-black/[0.04] dark:border-white/[0.04] select-none">
                        <div className="flex items-center gap-2.5 text-[11px] text-[#6E6E73] dark:text-[#86868B] font-semibold">
                          <FiClock className="w-4.5 h-4.5 flex-shrink-0 text-main" />
                          <span>{dt.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[11px] text-[#6E6E73] dark:text-[#86868B] font-semibold">
                          <FiMapPin className="w-4.5 h-4.5 flex-shrink-0 text-main" />
                          <span className="truncate">{m.location}</span>
                        </div>
                        {isLink ? (
                          <a
                            href={m.location}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 mt-2 w-full px-5 py-3 text-xs font-bold text-primary-text bg-primary hover:bg-primary/90 rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                          >
                            <FiVideo className="w-4 h-4" /> Join Online Session
                          </a>
                        ) : (
                          <div className="text-center text-[10px] bg-black/[0.03] dark:bg-white/5 text-[#6E6E73] dark:text-[#86868B] py-2 rounded-xl font-bold border border-black/[0.02] dark:border-white/[0.02]">
                            Offline Meeting
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between select-none px-1">
              <h3 className="text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">
                PAST MEETINGS ({pastMeetings.length})
              </h3>
            </div>
            {pastMeetings.length === 0 ? (
              <div className="glass-card p-10 text-center text-[#6E6E73] dark:text-[#86868B] text-xs font-bold rounded-[28px] border border-black/[0.03] dark:border-white/[0.03] shadow-sm select-none">
                No past sessions cataloged.
              </div>
            ) : (
              <div className="space-y-4">
                {pastMeetings.map(m => {
                  const dt = getMeetingDateTime(m);
                  return (
                    <div 
                      key={m.id}
                      className="glass-card p-6 rounded-[24px] border border-black/[0.01] dark:border-white/[0.01] flex justify-between items-center opacity-75 hover:opacity-100 transition-opacity"
                    >
                      <div className="space-y-1.5 overflow-hidden pr-4">
                        <span className="text-[9px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider block">Group: {m.groupName}</span>
                        <h4 className="text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight truncate">{m.title}</h4>
                        <p className="text-[10.5px] text-[#6E6E73] dark:text-[#86868B] font-semibold">
                          Held on {dt.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] bg-black/[0.03] dark:bg-white/5 border border-black/[0.02] dark:border-white/[0.02] px-3.5 py-1.5 rounded-full select-none">
                        Completed
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMeeting ? 'Edit Study Session' : 'Schedule Study Session'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <style>{`
            .modal-select, .modal-input {
              background: rgba(0, 0, 0, 0.04);
              border: 1px solid rgba(0, 0, 0, 0.02);
            }
            .dark .modal-select, .dark .modal-input {
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.02);
            }
            .modal-select:focus, .modal-input:focus {
              background: #ffffff;
              border-color: var(--btn-primary-bg) !important;
              box-shadow: 0 0 0 4px rgba(17, 17, 17, 0.05) !important;
            }
            .dark .modal-select:focus, .dark .modal-input:focus {
              background: #000000;
              border-color: var(--btn-primary-bg) !important;
              box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08) !important;
            }
          `}</style>

          {/* Study Group Selector */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider pl-1">Target Study Group</label>
            <select
              className="w-full px-4 py-2.5 text-xs font-semibold modal-select rounded-full text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none transition-all"
              disabled={!!editingMeeting}
              {...register('groupId', { required: 'Please select a study group' })}
            >
              {myGroups.map(g => (
                <option key={g.id} value={g.id}>{g.groupName} ({g.subject})</option>
              ))}
            </select>
            {errors.groupId && <p className="text-[10px] text-red-500 mt-1 font-semibold pl-2">{errors.groupId.message}</p>}
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider pl-1">Session Title</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-xs font-semibold modal-input rounded-full text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73]/60 dark:placeholder-[#86868B]/40 focus:outline-none transition-all"
              placeholder="e.g. Chapter 4 Practice Problems"
              {...register('title', { required: 'Session title is required', minLength: 3, maxLength: 100 })}
            />
            {errors.title && <p className="text-[10px] text-red-500 mt-1 font-semibold pl-2">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider pl-1">Session Agenda</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 text-xs font-semibold modal-input rounded-2xl text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73]/60 dark:placeholder-[#86868B]/40 focus:outline-none transition-all"
              placeholder="Detail meeting goals and study topics..."
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Meeting Date */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider pl-1">Date</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 text-xs font-semibold modal-input rounded-full text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none transition-all"
                {...register('meetingDate', { required: 'Date is required' })}
              />
              {errors.meetingDate && <p className="text-[10px] text-red-500 mt-1 font-semibold pl-2">{errors.meetingDate.message}</p>}
            </div>

            {/* Meeting Time */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider pl-1">Time</label>
              <input
                type="time"
                className="w-full px-4 py-2.5 text-xs font-semibold modal-input rounded-full text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none transition-all"
                {...register('meetingTime', { required: 'Time is required' })}
              />
              {errors.meetingTime && <p className="text-[10px] text-red-500 mt-1 font-semibold pl-2">{errors.meetingTime.message}</p>}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider pl-1">Location / Join Link</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-xs font-semibold modal-input rounded-full text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73]/60 dark:placeholder-[#86868B]/40 focus:outline-none transition-all"
              placeholder="e.g. Google Meet link or Room 204"
              {...register('location', { required: 'Location or meeting link is required' })}
            />
            {errors.location && <p className="text-[10px] text-red-500 mt-1 font-semibold pl-2">{errors.location.message}</p>}
          </div>

          <div className="flex gap-4 pt-3">
            <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1" disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" loading={actionLoading}>
              Save Meeting
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteMeetingId}
        onClose={() => setDeleteMeetingId(null)}
        title="Cancel Study Session"
        message="Are you sure you want to cancel and delete this study meeting? Other group members will be notified."
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  );
};

export default Meetings;
