import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import groupService from '../services/groupService';
import { toast } from 'react-toastify';
import { FiUsers, FiBookOpen, FiFileText, FiPlusCircle, FiArrowLeft } from 'react-icons/fi';
import Button from '../components/common/Button';

const CreateStudyGroup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      groupName: '',
      subject: '',
      description: '',
      maxMembers: 10,
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        groupName: data.groupName,
        subject: data.subject,
        description: data.description,
        maxMembers: parseInt(data.maxMembers, 10),
      };

      const res = await groupService.createGroup(payload);
      if (res.success) {
        toast.success(res.message || 'Study group created successfully!');
        if (res.data && res.data.id) {
          navigate(`/groups/${res.data.id}`);
        } else {
          navigate('/groups');
        }
      } else {
        toast.error(res.message || 'Failed to create study group');
      }
    } catch (err) {
      console.error('Error creating study group', err);
      const errMsg = err.response?.data?.message || 'Failed to create study group. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Return link */}
      <button
        onClick={() => navigate('/groups')}
        className="flex items-center gap-2 text-xs font-semibold text-[#6E6E73] hover:text-primary hover:underline transition-all pl-1 focus:outline-none select-none"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to directory
      </button>

      {/* Header */}
      <div className="select-none pl-1">
        <h1 className="text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-3">
          <FiPlusCircle className="text-primary w-7 h-7" />
          Create a New Group
        </h1>
        <p className="text-xs font-semibold text-[#6E6E73] dark:text-[#86868B] mt-1.5">
          Form a new study group. Your academic department and year will be applied automatically.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-card p-8 md:p-10 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <style>{`
            .create-group-input {
              background: rgba(0, 0, 0, 0.04);
              border: 1px solid rgba(0, 0, 0, 0.02);
              color: #1D1D1F;
            }
            .dark .create-group-input {
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.02);
              color: #F5F5F7;
            }
            .create-group-input:focus {
              background: #ffffff;
              border-color: var(--btn-primary-bg);
              box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
            }
            .dark .create-group-input:focus {
              background: #000000;
              border-color: var(--btn-primary-bg);
              box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08);
            }
          `}</style>

          {/* Group Name */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase pl-1">
              Group Name
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                <FiUsers className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                placeholder="e.g. CSE 302 Algorithms Study Circle"
                className={`w-full pl-11 pr-4 py-3 text-xs font-semibold create-group-input rounded-full placeholder-[#6E6E73]/60 dark:placeholder-[#86868B]/40 focus:outline-none transition-all ${
                  errors.groupName ? 'border-red-500/50 focus:ring-red-500/10' : ''
                }`}
                {...register('groupName', {
                  required: 'Group name is required',
                  minLength: { value: 3, message: 'Group name must be at least 3 characters' },
                  maxLength: { value: 100, message: 'Group name must be under 100 characters' },
                })}
              />
            </div>
            {errors.groupName && (
              <p className="text-[10px] text-red-500 mt-1 font-semibold flex items-center gap-1.5 pl-2">{errors.groupName.message}</p>
            )}
          </div>

          {/* Subject Topic */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase pl-1">
              Subject Topic
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                <FiBookOpen className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                placeholder="e.g. Algorithms, Calculus, Chemistry"
                className={`w-full pl-11 pr-4 py-3 text-xs font-semibold create-group-input rounded-full placeholder-[#6E6E73]/60 dark:placeholder-[#86868B]/40 focus:outline-none transition-all ${
                  errors.subject ? 'border-red-500/50 focus:ring-red-500/10' : ''
                }`}
                {...register('subject', {
                  required: 'Subject topic is required',
                })}
              />
            </div>
            {errors.subject && (
              <p className="text-[10px] text-red-500 mt-1 font-semibold flex items-center gap-1.5 pl-2">{errors.subject.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase pl-1">
              Description / Study Plan
            </label>
            <div className="relative flex items-start">
              <div className="absolute left-4 top-3.5 text-[#6E6E73] dark:text-[#86868B]">
                <FiFileText className="w-4.5 h-4.5" />
              </div>
              <textarea
                rows={4}
                placeholder="Detail what subjects you plan to study, meeting frequencies, and goals..."
                className={`w-full pl-11 pr-4 py-3 text-xs font-semibold create-group-input rounded-2xl placeholder-[#6E6E73]/60 dark:placeholder-[#86868B]/40 focus:outline-none transition-all ${
                  errors.description ? 'border-red-500/50 focus:ring-red-500/10' : ''
                }`}
                {...register('description', {
                  maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' },
                })}
              />
            </div>
            {errors.description && (
              <p className="text-[10px] text-red-500 mt-1 font-semibold flex items-center gap-1.5 pl-2">{errors.description.message}</p>
            )}
          </div>

          {/* Inherited read-only items and Max members grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Creator Department (Read-only indication) */}
            <div className="space-y-1.5 select-none">
              <label className="block text-[11px] font-semibold text-[#6E6E73]/60 dark:text-[#86868B]/60 tracking-wider uppercase pl-1">
                Department
              </label>
              <input
                type="text"
                disabled
                value={user?.department || 'Not specified'}
                className="w-full px-4 py-2.5 text-xs font-bold bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.03] rounded-full text-[#6E6E73] dark:text-[#86868B] cursor-not-allowed"
              />
              <span className="text-[9px] text-[#6E6E73]/60 dark:text-[#86868B]/60 italic pl-1">Inherited from profile</span>
            </div>

            {/* Creator Year (Read-only indication) */}
            <div className="space-y-1.5 select-none">
              <label className="block text-[11px] font-semibold text-[#6E6E73]/60 dark:text-[#86868B]/60 tracking-wider uppercase pl-1">
                Academic Year
              </label>
              <input
                type="text"
                disabled
                value={`Year ${user?.year || '1'}`}
                className="w-full px-4 py-2.5 text-xs font-bold bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.03] rounded-full text-[#6E6E73] dark:text-[#86868B] cursor-not-allowed"
              />
              <span className="text-[9px] text-[#6E6E73]/60 dark:text-[#86868B]/60 italic pl-1">Inherited from profile</span>
            </div>

            {/* Max Members */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase pl-1">
                Maximum Members
              </label>
              <input
                type="number"
                min={2}
                max={100}
                className={`w-full px-4 py-2.5 text-xs font-semibold create-group-input rounded-full focus:outline-none transition-all ${
                  errors.maxMembers ? 'border-red-500/50 focus:ring-red-500/10' : ''
                }`}
                {...register('maxMembers', {
                  required: 'Max members is required',
                  min: { value: 2, message: 'At least 2 members required' },
                  max: { value: 100, message: 'At most 100 members allowed' },
                })}
              />
              {errors.maxMembers ? (
                <p className="text-[10px] text-red-500 mt-1 font-semibold flex items-center gap-1.5 pl-2">{errors.maxMembers.message}</p>
              ) : (
                <span className="text-[9px] text-[#6E6E73]/60 dark:text-[#86868B]/60 pl-1 select-none">Allows between 2 and 100</span>
              )}
            </div>
          </div>

          {/* Form Action */}
          <div className="pt-4 flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/groups')}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              Create Group
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudyGroup;
