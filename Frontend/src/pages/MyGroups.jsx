import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import groupService from '../services/groupService';
import meetingService from '../services/meetingService';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { toast } from 'react-toastify';
import { FiUsers, FiBookOpen, FiBookmark, FiLogOut, FiFolderMinus, FiExternalLink } from 'react-icons/fi';

const MyGroups = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // State
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveGroupId, setLeaveGroupId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMyGroups = async () => {
    setLoading(true);
    try {
      // 1. Fetch all meetings to discover group memberships from active sessions
      const meetingsRes = await meetingService.getAllMeetings();
      const groupIdsFromMeetings = new Set();
      if (meetingsRes.success && meetingsRes.data) {
        meetingsRes.data.forEach(m => {
          if (m.groupId) groupIdsFromMeetings.add(m.groupId);
        });
      }

      // 2. Read joined group IDs cache from local storage
      const localJoined = JSON.parse(localStorage.getItem('joinedGroups') || '[]');
      const localJoinedSet = new Set(localJoined);

      // 3. Fetch all groups
      const groupsRes = await groupService.getAllGroups({ size: 100 });
      if (groupsRes.success && groupsRes.data) {
        const allGroups = groupsRes.data.content || [];
        
        // Filter groups user owns OR belongs to
        const filtered = allGroups.filter(g => 
          g.createdBy?.id === user?.id || 
          groupIdsFromMeetings.has(g.id) ||
          localJoinedSet.has(g.id)
        );
        setMyGroups(filtered);
      }
    } catch (err) {
      console.error('Failed to fetch user study groups', err);
      toast.error('Failed to load your study groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, [user]);

  // Leave group confirm trigger
  const handleLeaveGroup = async () => {
    if (!leaveGroupId) return;
    setActionLoading(true);
    try {
      const res = await groupService.leaveGroup(leaveGroupId);
      if (res.success) {
        toast.success('Successfully left the study group!');
        
        // Remove from local cache
        const localJoined = JSON.parse(localStorage.getItem('joinedGroups') || '[]');
        const updatedCache = localJoined.filter(id => id !== leaveGroupId);
        localStorage.setItem('joinedGroups', JSON.stringify(updatedCache));

        setLeaveGroupId(null);
        fetchMyGroups();
      } else {
        toast.error(res.message || 'Failed to leave study group');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to leave study group');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-12 py-4">
        <div className="select-none">
          <h1 className="text-[28px] font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-3">
            <FiBookmark className="text-primary w-6 h-6" />
            My Study Groups
          </h1>
          <p className="text-[13px] font-medium text-[#6E6E73] dark:text-[#86868B] mt-1">Loading your customized workspace...</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-64 bg-slate-200/30 dark:bg-white/[0.04] animate-pulse rounded-[28px] border border-black/[0.03] dark:border-white/[0.03]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 select-none">
        <div className="space-y-1">
          <h1 className="text-[28px] font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-3">
            <FiBookmark className="text-primary w-6 h-6" />
            My Study Groups
          </h1>
          <p className="text-[13px] font-medium text-[#6E6E73] dark:text-[#86868B] mt-1">
            Easily manage, review agendas, or open your active study circles.
          </p>
        </div>
        <button
          onClick={() => navigate('/groups')}
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold bg-primary hover:bg-primary-dark text-primary-text rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] border border-black/[0.04] dark:border-white/[0.04] cursor-pointer"
        >
          Find New Groups
        </button>
      </div>

      {/* Main Grid list */}
      {myGroups.length === 0 ? (
        <EmptyState
          title="No Study Groups Joined"
          description="You haven't formed or requested membership in any study circles yet."
          actionLabel="Browse Directory"
          onAction={() => navigate('/groups')}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myGroups.map((group) => {
            const isOwner = group.createdBy?.id === user?.id;

            return (
              <div 
                key={group.id}
                className="glass-card p-8 rounded-[28px] premium-hover-card flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-4">
                  {/* Category header */}
                  <div className="flex justify-between items-center select-none">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary text-[9px] font-black uppercase tracking-wider border border-black/[0.04] dark:border-white/[0.04]">
                      {group.subject}
                    </span>
                    {isOwner ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary border border-black/[0.04] dark:border-white/[0.04] text-[9px] font-black uppercase tracking-wider">
                        Owner
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary border border-black/[0.04] dark:border-white/[0.04] text-[9px] font-black uppercase tracking-wider">
                        Member
                      </span>
                    )}
                  </div>

                  {/* Title & description */}
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-snug line-clamp-1">{group.groupName}</h3>
                    <p className="text-[10px] text-[#6E6E73] dark:text-[#86868B] font-bold tracking-tight select-none">Owner: {group.createdBy?.name}</p>
                    <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed line-clamp-3 pt-2 font-medium">
                      {group.description || 'No description provided.'}
                    </p>

                    {/* Member Avatars Stack */}
                    <div className="flex items-center -space-x-2 select-none pt-4">
                      {[...Array(Math.min(group.currentMembers || 1, 4))].map((_, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border border-white dark:border-[#0D0D0F] bg-black/5 dark:bg-white/5 text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] flex items-center justify-center shadow-sm"
                        >
                          {String.fromCharCode(65 + (i * 3 + group.id) % 26)}
                        </div>
                      ))}
                      {group.currentMembers > 4 && (
                        <div className="w-6 h-6 rounded-full border border-white dark:border-[#0D0D0F] bg-black/10 dark:bg-white/10 text-[9px] font-extrabold text-[#6E6E73] dark:text-[#86868B] flex items-center justify-center select-none shadow-sm">
                          +{group.currentMembers - 4}
                        </div>
                      )}
                      <span className="text-[10.5px] font-bold text-[#6E6E73] dark:text-[#86868B] pl-3">
                        {group.currentMembers} / {group.maxMembers} members
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-black/[0.04] dark:border-white/[0.04] mt-6">
                  <button
                    onClick={() => navigate(`/groups/${group.id}`)}
                    className="w-full py-2.5 px-5 text-xs font-bold text-primary-text bg-primary hover:bg-primary-dark rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border border-black/[0.04] dark:border-white/[0.04]"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    <span>Open Group</span>
                  </button>
                  {!isOwner && (
                    <button
                      onClick={() => setLeaveGroupId(group.id)}
                      className="px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 rounded-full border border-red-500/10 hover:border-red-500/20 active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Leave</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leave confirmation modal */}
      <ConfirmDialog
        isOpen={!!leaveGroupId}
        onClose={() => setLeaveGroupId(null)}
        title="Leave Study Circle"
        message="Are you sure you want to leave this study group? You will lose access to its announcements, tasks, resources, and meetings."
        onConfirm={handleLeaveGroup}
        loading={actionLoading}
      />
    </div>
  );
};

export default MyGroups;
