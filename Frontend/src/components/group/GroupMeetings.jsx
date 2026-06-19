import React, { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiMapPin, FiPlus, FiTrash, FiEdit, FiVideo } from 'react-icons/fi';
import meetingService from '../../services/meetingService';

const GroupMeetings = ({
  meetings,
  groupId,
  isCreator,
  isAdmin,
  onRefresh,
}) => {
  const { user } = useAuth();
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
    }
  });

  // Split meetings
  const now = new Date();
  const getMeetingDateTime = (m) => new Date(m.meetingDate + 'T' + (m.meetingTime.substring(0, 5) || '00:00') + ':00');
  
  const upcomingMeetings = meetings
    .filter(m => getMeetingDateTime(m) >= now)
    .sort((a, b) => getMeetingDateTime(a) - getMeetingDateTime(b));

  const pastMeetings = meetings
    .filter(m => getMeetingDateTime(m) < now)
    .sort((a, b) => getMeetingDateTime(b) - getMeetingDateTime(a));

  // Open schedule modal
  const handleOpenAdd = () => {
    setEditingMeeting(null);
    reset({
      title: '',
      description: '',
      meetingDate: new Date().toISOString().split('T')[0],
      meetingTime: '12:00',
      location: '',
    });
    setModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (m) => {
    setEditingMeeting(m);
    reset({
      title: m.title,
      description: m.description || '',
      meetingDate: m.meetingDate,
      meetingTime: m.meetingTime.substring(0, 5),
      location: m.location,
    });
    setModalOpen(true);
  };

  // Submit create / edit
  const onSubmit = async (data) => {
    setActionLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        meetingDate: data.meetingDate,
        meetingTime: data.meetingTime.length === 5 ? data.meetingTime + ':00' : data.meetingTime,
        location: data.location,
        groupId: parseInt(groupId, 10),
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
        onRefresh();
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

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deleteMeetingId) return;
    setActionLoading(true);
    try {
      const res = await meetingService.deleteMeeting(deleteMeetingId);
      if (res.success) {
        toast.success('Meeting canceled and deleted!');
        setDeleteMeetingId(null);
        onRefresh();
      } else {
        toast.error(res.message || 'Failed to cancel meeting');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel meeting');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Header and schedule button */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Study Group Meetings ({meetings.length})
        </h3>
        <Button
          variant="primary"
          size="sm"
          icon={FiPlus}
          onClick={handleOpenAdd}
        >
          Schedule Session
        </Button>
      </div>

      {/* Grid: Upcoming & Past */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Column 1: Upcoming */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            UPCOMING ({upcomingMeetings.length})
          </h4>
          {upcomingMeetings.length === 0 ? (
            <div className="glass-panel p-6 text-center text-slate-400 text-xs rounded-2xl bg-white dark:bg-darkbg-card">
              No upcoming sessions scheduled.
            </div>
          ) : (
            upcomingMeetings.map(m => {
              const dt = getMeetingDateTime(m);
              const isLink = m.location?.startsWith('http');
              const showControls = isCreator || isAdmin; // simplify or allow meeting organizer

              return (
                <div 
                  key={m.id}
                  className="glass-panel p-5 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-100 dark:border-darkbg-border shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{m.title}</h5>
                      {showControls && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleOpenEdit(m)}
                            className="p-1 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 transition-colors"
                          >
                            <FiEdit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteMeetingId(m.id)}
                            className="p-1 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 transition-colors"
                          >
                            <FiTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {m.description || 'No agenda detailed.'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <FiClock className="w-4 h-4 flex-shrink-0" />
                      <span>{dt.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <FiMapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{m.location}</span>
                    </div>
                    {isLink ? (
                      <a
                        href={m.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 mt-2 w-full px-3 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md"
                      >
                        <FiVideo /> Join Online Session
                      </a>
                    ) : (
                      <div className="text-center text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 py-1.5 rounded-lg font-bold">
                        Offline Meeting
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Column 2: Past */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            PAST ({pastMeetings.length})
          </h4>
          {pastMeetings.length === 0 ? (
            <div className="glass-panel p-6 text-center text-slate-400 text-xs rounded-2xl bg-white dark:bg-darkbg-card">
              No historical sessions listed.
            </div>
          ) : (
            pastMeetings.map(m => {
              const dt = getMeetingDateTime(m);
              return (
                <div 
                  key={m.id}
                  className="glass-panel p-4 rounded-xl bg-slate-50/50 dark:bg-darkbg-card/40 border border-slate-200/50 dark:border-darkbg-border flex justify-between items-center opacity-70"
                >
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-350">{m.title}</h5>
                    <p className="text-[10px] text-slate-400">
                      Held on {dt.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    Completed
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMeeting ? 'Edit Study Session' : 'Schedule Study Session'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Session Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Chapter 4 Practice Problems"
              {...register('title', { required: 'Session title is required', minLength: 3, maxLength: 100 })}
            />
            {errors.title && <p className="text-[9px] text-red-500 mt-0.5">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Session Agenda</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Detail meeting goals and study topics..."
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Meeting Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('meetingDate', { required: 'Date is required' })}
              />
              {errors.meetingDate && <p className="text-[9px] text-red-500 mt-0.5">{errors.meetingDate.message}</p>}
            </div>

            {/* Meeting Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Time</label>
              <input
                type="time"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('meetingTime', { required: 'Time is required' })}
              />
              {errors.meetingTime && <p className="text-[9px] text-red-500 mt-0.5">{errors.meetingTime.message}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Location / Join Link</label>
            <input
              type="text"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Google Meet link or Room 204"
              {...register('location', { required: 'Location or meeting link is required' })}
            />
            {errors.location && <p className="text-[9px] text-red-500 mt-0.5">{errors.location.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)} className="flex-1" disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="flex-1" loading={actionLoading}>
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
        confirmLabel="Cancel Meeting"
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  );
};

export default GroupMeetings;
