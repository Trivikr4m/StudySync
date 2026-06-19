import React, { useState } from 'react';
import SearchBar from '../common/SearchBar';
import Button from '../common/Button';
import { FiUser, FiCheck, FiX, FiShield } from 'react-icons/fi';

const GroupMembers = ({
  members,
  isCreator,
  isAdmin,
  onApprove,
  onReject,
  loadingAction,
}) => {
  const [memberQuery, setMemberQuery] = useState('');

  // Filter approved and pending members
  const approvedMembers = members.filter(m => m.status === 'APPROVED');
  const pendingRequests = members.filter(m => m.status === 'PENDING');

  // Search filter
  const filteredApproved = approvedMembers.filter(m => 
    m.userName.toLowerCase().includes(memberQuery.toLowerCase()) || 
    m.userEmail.toLowerCase().includes(memberQuery.toLowerCase())
  );

  const showManagement = isCreator || isAdmin;

  return (
    <div className="space-y-6 pt-4">
      {/* Pending requests management (Only shown to owners / admins) */}
      {showManagement && pendingRequests.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl bg-black/[0.01] dark:bg-white/[0.01] border border-color space-y-4">
          <h3 className="text-sm font-bold text-main flex items-center gap-2">
            <span>Pending Join Requests</span>
            <span className="px-2 py-0.5 rounded-full bg-primary-50 text-main text-[10px]">
              {pendingRequests.length}
            </span>
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-darkbg-border">
            {pendingRequests.map(req => (
              <div key={req.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 text-main font-bold text-xs">
                    {req.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{req.userName}</p>
                    <p className="text-[10px] text-slate-400">{req.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    loading={loadingAction}
                    onClick={() => onApprove(req.id)}
                    className="p-1 px-3"
                  >
                    <FiCheck className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={loadingAction}
                    onClick={() => onReject(req.id)}
                    className="p-1 px-3"
                  >
                    <FiX className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Members Listing */}
      <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-100 dark:border-darkbg-border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Active Members ({approvedMembers.length})
          </h3>
          <SearchBar
            value={memberQuery}
            onChange={setMemberQuery}
            onClear={() => setMemberQuery('')}
            placeholder="Search member name or email..."
            className="max-w-xs"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          {filteredApproved.length === 0 ? (
            <div className="col-span-2 text-center py-6 text-slate-400 text-xs">
              No active members found.
            </div>
          ) : (
            filteredApproved.map(member => {
              // Note: creator is usually the first member or creator is returned inside response. We check name/email.
              const isOwner = member.userEmail === member.userEmail; // In full logic we flag owner role
              return (
                <div 
                  key={member.id} 
                  className="p-4 rounded-xl border border-slate-150 dark:border-darkbg-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs">
                      {member.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{member.userName}</p>
                      <p className="text-[10px] text-slate-400">{member.userEmail}</p>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Joined {new Date(member.joinedDate).toLocaleDateString()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupMembers;
