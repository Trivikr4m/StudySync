import React from 'react';
import Button from '../common/Button';
import { FiUsers, FiBookOpen, FiUser, FiCalendar, FiLogOut, FiArrowRight } from 'react-icons/fi';

const GroupOverview = ({
  group,
  membership,
  onJoin,
  onLeave,
  loadingAction,
}) => {
  const isCreator = group.createdBy?.id === membership?.currentUserId;
  const isFull = group.currentMembers >= group.maxMembers;
  
  const createdDate = group.createdDate
    ? new Date(group.createdDate).toLocaleDateString([], { dateStyle: 'long' })
    : 'Unknown Date';

  return (
    <div className="grid md:grid-cols-3 gap-6 pt-4">
      {/* Main Details (2/3 width) */}
      <div className="md:col-span-2 space-y-6">
        {/* Description Panel */}
        <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-100 dark:border-darkbg-border shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Study Group Description</h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">
            {group.description || 'No description provided for this study circle.'}
          </p>
        </div>

        {/* Technical metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-4 rounded-xl bg-white dark:bg-darkbg-card border border-slate-100 dark:border-darkbg-border flex items-center gap-3">
            <FiBookOpen className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Subject Topic</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 capitalize">{group.subject}</p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl bg-white dark:bg-darkbg-card border border-slate-100 dark:border-darkbg-border flex items-center gap-3">
            <FiUsers className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Member Capacity</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {group.currentMembers} / {group.maxMembers} Members
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Access Panel (1/3 width) */}
      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-100 dark:border-darkbg-border shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Study Group Admin</h2>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 text-primary font-bold text-sm">
              {group.createdBy?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{group.createdBy?.name}</p>
              <p className="text-[10px] text-slate-400">{group.createdBy?.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold border-t border-slate-100 dark:border-darkbg-border pt-4">
            <FiCalendar className="w-4 h-4" />
            <span>Formed on {createdDate}</span>
          </div>

          {/* Membership Context CTA */}
          <div className="pt-2 border-t border-slate-100 dark:border-darkbg-border">
            {isCreator ? (
              <div className="p-3 text-center rounded-xl bg-primary-50 dark:bg-primary-950/20 text-xs font-bold text-primary dark:text-primary-light">
                You are the Owner
              </div>
            ) : membership?.status === 'APPROVED' ? (
              <Button
                variant="danger"
                size="sm"
                fullWidth
                icon={FiLogOut}
                loading={loadingAction}
                onClick={onLeave}
              >
                Leave Group
              </Button>
            ) : membership?.status === 'PENDING' ? (
              <div className="p-3 text-center rounded-xl bg-primary-50 border border-color text-xs font-bold text-main">
                Join Request Pending
              </div>
            ) : membership?.status === 'REJECTED' ? (
              <div className="p-3 text-center rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border border-color/40 text-xs font-bold text-secondary">
                Join Request Rejected
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                fullWidth
                disabled={isFull}
                icon={FiArrowRight}
                loading={loadingAction}
                onClick={onJoin}
              >
                {isFull ? 'Group is Full' : 'Request to Join'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupOverview;
