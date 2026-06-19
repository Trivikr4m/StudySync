import React, { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiCheckSquare, FiPlus, FiTrash, FiEdit, FiClock, FiUser, FiArrowRight } from 'react-icons/fi';
import taskService from '../../services/taskService';

const GroupTasks = ({
  tasks,
  members,
  groupId,
  isCreator,
  isAdmin,
  onRefresh,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
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
      description: '',
      deadline: '',
      assignedToUserId: '',
      status: 'PENDING',
    }
  });

  const approvedMembers = members.filter(m => m.status === 'APPROVED');

  // Split tasks by status
  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const progressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  const completionRate = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  // Cycle task status
  const handleCycleStatus = async (task) => {
    setActionLoading(true);
    try {
      let nextStatus = 'PENDING';
      if (task.status === 'PENDING') nextStatus = 'IN_PROGRESS';
      else if (task.status === 'IN_PROGRESS') nextStatus = 'COMPLETED';

      // Mapping: Assigned User ID might be inside assignedTo property or returned as an object.
      // Let's verify what TaskResponse returns.
      // Usually, TaskResponse contains private UserResponse assignedTo. So we map to assignedTo.id.
      const payload = {
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        status: nextStatus,
        assignedToUserId: task.assignedTo?.id || approvedMembers[0]?.userId,
        groupId: parseInt(groupId, 10),
      };

      const res = await taskService.updateTask(task.id, payload);
      if (res.success) {
        toast.success(`Task status updated to ${nextStatus.replace('_', ' ').toLowerCase()}`);
        onRefresh();
      } else {
        toast.error(res.message || 'Failed to update task');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to cycle task status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingTask(null);
    reset({
      title: '',
      description: '',
      deadline: new Date().toISOString().split('T')[0],
      assignedToUserId: approvedMembers[0]?.userId || '',
      status: 'PENDING',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTask(t);
    reset({
      title: t.title,
      description: t.description || '',
      deadline: t.deadline,
      assignedToUserId: t.assignedTo?.id || '',
      status: t.status,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setActionLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        status: data.status,
        assignedToUserId: parseInt(data.assignedToUserId, 10),
        groupId: parseInt(groupId, 10),
      };

      let res;
      if (editingTask) {
        res = await taskService.updateTask(editingTask.id, payload);
      } else {
        res = await taskService.createTask(payload);
      }

      if (res.success) {
        toast.success(editingTask ? 'Task updated!' : 'Task assigned!');
        setModalOpen(false);
        onRefresh();
      } else {
        toast.error(res.message || 'Failed to save task');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save task');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      const res = await taskService.deleteTask(deleteId);
      if (res.success) {
        toast.success('Task deleted!');
        setDeleteId(null);
        onRefresh();
      } else {
        toast.error(res.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete task');
    } finally {
      setActionLoading(false);
    }
  };

  const statusStyles = {
    PENDING: 'bg-primary-50 text-main border border-color',
    IN_PROGRESS: 'bg-primary text-primary-text border border-primary',
    COMPLETED: 'bg-black/[0.02] text-secondary border border-color/40 line-through dark:bg-white/[0.02]',
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Progress metrics and schedule actions */}
      <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-100 dark:border-darkbg-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Overall Study Task Progress</span>
            <span>{completionRate}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={FiPlus}
          onClick={handleOpenAdd}
          className="flex-shrink-0"
        >
          Assign Study Task
        </Button>
      </div>

      {/* Kanban columns */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* PENDING COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Pending</span>
            <span className="px-2 py-0.5 rounded-full bg-primary-50 text-main text-[10px] font-bold">
              {pendingTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingTasks.map(task => renderTaskCard(task))}
          </div>
        </div>

        {/* IN_PROGRESS COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold text-main uppercase tracking-wider">In Progress</span>
            <span className="px-2 py-0.5 rounded-full bg-primary-50 text-main text-[10px] font-bold">
              {progressTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {progressTasks.map(task => renderTaskCard(task))}
          </div>
        </div>

        {/* COMPLETED COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Completed</span>
            <span className="px-2 py-0.5 rounded-full bg-primary-50 text-main text-[10px] font-bold">
              {completedTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {completedTasks.map(task => renderTaskCard(task))}
          </div>
        </div>
      </div>

      {/* Task Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Task Assign' : 'Assign Study Task'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Task Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Solve exercises 1-5"
              {...register('title', { required: 'Task title is required', minLength: 3, maxLength: 150 })}
            />
            {errors.title && <p className="text-[9px] text-red-500 mt-0.5">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Task Details</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Detail work scope..."
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Deadline */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Due Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('deadline', { required: 'Due date is required' })}
              />
              {errors.deadline && <p className="text-[9px] text-red-500 mt-0.5">{errors.deadline.message}</p>}
            </div>

            {/* Assign User Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Assign Partner</label>
              <select
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('assignedToUserId', { required: 'Please assign to a partner' })}
              >
                <option value="">Select Member</option>
                {approvedMembers.map(m => (
                  <option key={m.id} value={m.userId}>{m.userName}</option>
                ))}
              </select>
              {errors.assignedToUserId && <p className="text-[9px] text-red-500 mt-0.5">{errors.assignedToUserId.message}</p>}
            </div>
          </div>

          {/* Status select (only when editing or preset option) */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Task Status</label>
            <select
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('status')}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)} className="flex-1" disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="flex-1" loading={actionLoading}>
              Save Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Task"
        message="Are you sure you want to delete this study task?"
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  );

  // Sub-renderer for task cards
  function renderTaskCard(task) {
    const isOwner = isCreator || isAdmin || task.assignedTo?.email === user?.email;
    const deadlineDate = task.deadline
      ? new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })
      : 'No due date';

    return (
      <div 
        key={task.id}
        className="glass-panel p-4 rounded-xl bg-white dark:bg-darkbg-card border border-slate-100 dark:border-darkbg-border shadow-sm flex flex-col justify-between hover:shadow-md transition-all gap-3"
      >
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">{task.title}</h5>
            {isOwner && (
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => handleOpenEdit(task)}
                  className="text-slate-400 hover:text-primary p-0.5 rounded transition-colors"
                >
                  <FiEdit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setDeleteId(task.id)}
                  className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors"
                >
                  <FiTrash className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed line-clamp-2">
            {task.description || 'No detail provided.'}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-850 text-[9px] text-slate-400 font-semibold mt-1">
          <div className="flex items-center gap-1.5">
            <FiClock className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <span>Due {deadlineDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiUser className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <span>Assignee: {task.assignedTo?.name || 'Unassigned'}</span>
          </div>
          <button
            onClick={() => handleCycleStatus(task)}
            className="flex items-center justify-between mt-1 px-2.5 py-1 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all text-slate-500 dark:text-slate-400"
          >
            <span className={`px-2 py-0.5 rounded-full font-bold ${statusStyles[task.status]}`}>
              {task.status.replace('_', ' ').toLowerCase()}
            </span>
            <span className="flex items-center gap-0.5 font-bold">
              Cycle <FiArrowRight className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>
    );
  }
};

export default GroupTasks;
