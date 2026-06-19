import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import groupService from '../services/groupService';
import meetingService from '../services/meetingService';
import announcementService from '../services/announcementService';
import resourceService from '../services/resourceService';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';
import { 
  FiUsers, 
  FiBookOpen, 
  FiCalendar, 
  FiBell, 
  FiFileText, 
  FiCheckSquare,
  FiArrowLeft,
  FiLock,
  FiInfo,
  FiActivity,
  FiClock,
  FiChevronRight,
  FiLogOut,
  FiExternalLink
} from 'react-icons/fi';

// Import Tab Components
import GroupOverview from '../components/group/GroupOverview';
import GroupMembers from '../components/group/GroupMembers';
import GroupMeetings from '../components/group/GroupMeetings';
import GroupAnnouncements from '../components/group/GroupAnnouncements';
import GroupResources from '../components/group/GroupResources';
import GroupTasks from '../components/group/GroupTasks';
import LoadingSpinner from '../components/common/LoadingSpinner';

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState('overview');

  // Group Data State
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [resources, setResources] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Page Loading State
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all group data
  const loadGroupDetails = async () => {
    try {
      const groupRes = await groupService.getGroupById(id);
      if (!groupRes.success) {
        toast.error('Study group not found');
        navigate('/groups');
        return;
      }
      setGroup(groupRes.data);

      // Fetch members list to check membership access
      const membersRes = await groupService.getGroupMembers(id);
      const membersList = membersRes.data || [];
      setMembers(membersList);

      // Identify user membership status
      const currentUserMembership = membersList.find(m => m.userEmail === user?.email);
      const isApprovedMember = currentUserMembership?.status === 'APPROVED';
      const isCreator = groupRes.data.createdBy?.id === user?.id;

      // Only load other sub-resources if user is creator, admin, or an approved member
      if (isCreator || isAdmin || isApprovedMember) {
        const [meetingsRes, announcementsRes, resourcesRes, tasksRes] = await Promise.all([
          meetingService.getAllMeetings(id),
          announcementService.getAnnouncementsByGroup(id),
          resourceService.getResourcesByGroup(id),
          taskService.getTasksByGroup(id),
        ]);

        setMeetings(meetingsRes.data || []);
        setAnnouncements(announcementsRes.data || []);
        setResources(resourcesRes.data || []);
        setTasks(tasksRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load group details', err);
      toast.error('Access denied or group details unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadGroupDetails();
    }
  }, [id, user]);

  // Actions
  const handleJoin = async () => {
    setActionLoading(true);
    try {
      const res = await groupService.joinGroup(id);
      if (res.success) {
        toast.success('Join request submitted successfully!');
        loadGroupDetails();
      } else {
        toast.error(res.message || 'Failed to submit request');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join group');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this study group?')) return;
    setActionLoading(true);
    try {
      const res = await groupService.leaveGroup(id);
      if (res.success) {
        toast.success('You have left the study group.');
        navigate('/groups');
      } else {
        toast.error(res.message || 'Failed to leave group');
      }
    } catch (err) {
      toast.error('Failed to leave study group');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveMember = async (memberId) => {
    setActionLoading(true);
    try {
      const res = await groupService.approveMember(id, memberId);
      if (res.success) {
        toast.success('Membership request approved!');
        loadGroupDetails();
      } else {
        toast.error(res.message || 'Failed to approve request');
      }
    } catch (err) {
      toast.error('Failed to approve request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectMember = async (memberId) => {
    setActionLoading(true);
    try {
      const res = await groupService.rejectMember(id, memberId);
      if (res.success) {
        toast.success('Membership request rejected!');
        loadGroupDetails();
      } else {
        toast.error(res.message || 'Failed to reject request');
      }
    } catch (err) {
      toast.error('Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-xs text-slate-500 font-medium">Loading group details workspace...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Group Not Found</h2>
        <button onClick={() => navigate('/groups')} className="text-primary mt-2">Back to groups list</button>
      </div>
    );
  }

  // Determine role contexts
  const currentUserMembership = members.find(m => m.userEmail === user?.email);
  const membership = currentUserMembership;
  const isCreator = group.createdBy?.id === user?.id;
  const isApproved = isCreator || isAdmin || currentUserMembership?.status === 'APPROVED';
  const isPending = currentUserMembership?.status === 'PENDING';

  // Available tabs configuration
  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiBookOpen, protected: false },
    { id: 'members', name: 'Members', icon: FiUsers, protected: true },
    { id: 'meetings', name: 'Meetings', icon: FiCalendar, protected: true },
    { id: 'announcements', name: 'Discussions', icon: FiBell, protected: true },
    { id: 'resources', name: 'Resources', icon: FiFileText, protected: true },
    { id: 'tasks', name: 'Tasks', icon: FiCheckSquare, protected: true },
  ];

  const renderOverviewTab = () => {
    const isCreator = group.createdBy?.id === user?.id;
    const isFull = group.currentMembers >= group.maxMembers;
    const createdDate = group.createdDate
      ? new Date(group.createdDate).toLocaleDateString([], { dateStyle: 'long' })
      : 'Unknown Date';

    // Parse approved members
    const approvedMembers = members.filter(m => m.status === 'APPROVED');

    // Compile timeline items
    const timelineItems = [];
    if (isApproved) {
      announcements.forEach(a => {
        timelineItems.push({
          id: `ann-${a.id}`,
          type: 'announcement',
          title: a.title,
          content: a.content,
          date: new Date(a.createdDate || a.id),
          user: a.createdBy?.name || 'Owner',
        });
      });

      tasks.forEach(t => {
        timelineItems.push({
          id: `task-${t.id}`,
          type: 'task',
          title: `Task: ${t.title}`,
          content: `Assigned: ${t.assignedTo?.name || 'Unassigned'} • Status: ${t.status}`,
          date: new Date(t.createdDate || t.id),
          user: t.createdBy?.name || 'Creator',
        });
      });

      meetings.forEach(m => {
        timelineItems.push({
          id: `meet-${m.id}`,
          type: 'meeting',
          title: `Meeting: ${m.title}`,
          content: `Starts: ${new Date(m.startTime).toLocaleString()} • Duration: ${m.duration} mins`,
          date: new Date(m.createdDate || m.startTime),
          user: m.hostName || 'Host',
        });
      });

      resources.forEach(r => {
        timelineItems.push({
          id: `res-${r.id}`,
          type: 'resource',
          title: `Resource: ${r.title}`,
          content: `Type: ${r.fileType} • Description: ${r.description || 'No description'}`,
          date: new Date(r.createdDate || r.id),
          user: r.uploadedBy?.name || 'Uploader',
        });
      });

      timelineItems.sort((a, b) => b.date - a.date);
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About / Description glass-card */}
          <div className="glass-card p-8 rounded-[28px] shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
              About this Study Circle
            </h2>
            <p className="text-xs md:text-sm text-[#6E6E73] dark:text-[#86868B] leading-relaxed whitespace-pre-wrap font-medium">
              {group.description || 'No description provided for this study circle.'}
            </p>
            
            {/* Quick Metadata Deck */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/[0.04] dark:border-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black/[0.04] dark:bg-white/5 text-main flex items-center justify-center">
                  <FiBookOpen className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#6E6E73] dark:text-[#86868B] font-bold uppercase tracking-wider">Subject Topic</p>
                  <p className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7] capitalize">{group.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black/[0.04] dark:bg-white/5 text-main flex items-center justify-center">
                  <FiUsers className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#6E6E73] dark:text-[#86868B] font-bold uppercase tracking-wider">Group Capacity</p>
                  <p className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {group.currentMembers} / {group.maxMembers} Members
                  </p>
                </div>
              </div>
            </div>
          </div>

          {isApproved ? (
            <>
              {/* Activity Timeline */}
              <div className="glass-card p-8 rounded-[28px] shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.04] pb-4">
                  <h2 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-2">
                    <FiActivity className="w-4.5 h-4.5 text-main" />
                    Activity Timeline
                  </h2>
                  <span className="text-[10px] font-bold bg-black/[0.04] dark:bg-white/5 text-[#6E6E73] dark:text-[#86868B] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {timelineItems.length} events
                  </span>
                </div>
                
                {timelineItems.length === 0 ? (
                  <p className="text-xs text-[#6E6E73] dark:text-[#86868B]/60 text-center py-6 font-medium">No activity recorded yet.</p>
                ) : (
                  <div className="relative pl-6 border-l border-black/[0.06] dark:border-white/[0.08] space-y-8 select-none">
                    {timelineItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="relative">
                        {/* Timeline Bullet Pin */}
                        <div className={`absolute -left-[31px] top-0.5 w-2.5 h-2.5 rounded-full border-[2px] bg-[#F5F5F7] dark:bg-[#0D0D0F] transition-all duration-300 ${
                          item.type === 'announcement' ? 'border-neutral-400 dark:border-neutral-500' :
                          item.type === 'task' ? 'border-neutral-700 dark:border-neutral-300' :
                          item.type === 'meeting' ? 'border-primary' :
                          'border-neutral-300 dark:border-neutral-600'
                        }`} />
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <h4 className="text-xs font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">{item.title}</h4>
                            <span className="text-[9px] text-[#6E6E73] dark:text-[#86868B] font-bold">
                              {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-xs text-[#6E6E73] dark:text-[#86868B] font-medium line-clamp-2">{item.content}</p>
                          <p className="text-[9px] text-[#6E6E73]/70 dark:text-[#86868B]/60 font-bold uppercase tracking-wider">By: {item.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shared Resources Shortcut */}
              <div className="glass-card p-8 rounded-[28px] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.04] pb-4">
                  <h2 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                    Shared Resources
                  </h2>
                  <button
                    onClick={() => setActiveTab('resources')}
                    className="text-[10px] font-bold text-main uppercase tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    View All <FiChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {resources.length === 0 ? (
                  <p className="text-xs text-[#6E6E73] dark:text-[#86868B]/60 text-center py-4 font-medium">No resources shared yet.</p>
                ) : (
                  <div className="grid gap-3 pt-2">
                    {resources.slice(0, 3).map((res) => (
                      <div
                        key={res.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.02] dark:border-white/[0.02]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-black/[0.04] dark:bg-white/5 text-main flex items-center justify-center">
                            <FiFileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight line-clamp-1">{res.title}</p>
                            <p className="text-[10px] text-[#6E6E73] dark:text-[#86868B] font-bold uppercase tracking-wider">{res.fileType}</p>
                          </div>
                        </div>
                        <a
                          href={res.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-main"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}

        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-8">
          
          {/* Creator Profile */}
          <div className="glass-card p-8 rounded-[28px] shadow-sm space-y-5">
            <h2 className="text-xs font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">
              Creator Profile
            </h2>
            <div className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 rounded-full bg-black/[0.04] dark:bg-white/5 text-main flex items-center justify-center text-sm font-black border border-color">
                {group.createdBy?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">{group.createdBy?.name}</p>
                <p className="text-[10px] text-[#6E6E73] dark:text-[#86868B] font-bold">{group.createdBy?.department}</p>
                <p className="text-[9px] text-[#6E6E73]/80 dark:text-[#86868B]/70 font-semibold mt-0.5">Year {group.createdBy?.year || 1} Student</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-[#6E6E73] dark:text-[#86868B] font-bold border-t border-black/[0.04] dark:border-white/[0.04] pt-4 select-none">
              <FiClock className="w-3.5 h-3.5" />
              <span>Formed on {createdDate}</span>
            </div>

            {/* Membership CTA Action buttons */}
            <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.04] select-none">
              {isCreator ? (
                <div className="py-2.5 text-center rounded-full bg-black/[0.04] dark:bg-white/5 text-xs font-bold text-main border border-color">
                  You are the Workspace Owner
                </div>
              ) : membership?.status === 'APPROVED' ? (
                <button
                  onClick={handleLeave}
                  disabled={actionLoading}
                  className="w-full py-2.5 px-4 text-xs font-bold text-red-500 hover:text-white border border-red-500/10 hover:bg-red-500 rounded-full transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Leave Study Circle</span>
                </button>
              ) : membership?.status === 'PENDING' ? (
                <div className="py-2.5 text-center rounded-full bg-black/[0.04] dark:bg-white/5 text-xs font-bold text-main border border-color animate-pulse">
                  Join Request Pending Approval
                </div>
              ) : membership?.status === 'REJECTED' ? (
                <div className="py-2.5 text-center rounded-full bg-red-500/10 text-xs font-bold text-red-600 dark:text-red-400 border border-red-500/20">
                  Join Request Rejected
                </div>
              ) : (
                <button
                  disabled={isFull || actionLoading}
                  onClick={handleJoin}
                  className={`w-full py-3 text-xs font-bold text-primary-text bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                    isFull ? 'bg-black/5 dark:bg-white/5 text-[#6E6E73] dark:text-[#86868B] cursor-not-allowed shadow-none' : ''
                  }`}
                >
                  {isFull ? 'Group is Full' : 'Request to Join Group'}
                </button>
              )}
            </div>
          </div>

          {isApproved ? (
            <>
              {/* Active Members Avatars Deck */}
              <div className="glass-card p-8 rounded-[28px] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.04] pb-4">
                  <h2 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                    Members ({approvedMembers.length})
                  </h2>
                  <button
                    onClick={() => setActiveTab('members')}
                    className="text-[10px] font-bold text-main uppercase tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    View All <FiChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {approvedMembers.slice(0, 8).map((m) => (
                    <div
                      key={m.id}
                      title={m.userName}
                      className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 text-xs font-black text-[#6E6E73] dark:text-[#86868B] flex items-center justify-center border border-black/[0.04] dark:border-white/[0.04]"
                    >
                      {m.userName.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {approvedMembers.length > 8 && (
                    <div className="w-9 h-9 rounded-full bg-black/10 dark:bg-white/10 text-xs font-extrabold text-[#6E6E73] dark:text-[#86868B] flex items-center justify-center">
                      +{approvedMembers.length - 8}
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Meetings Deck */}
              <div className="glass-card p-8 rounded-[28px] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.04] pb-4">
                  <h2 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                    Upcoming Sessions
                  </h2>
                  <button
                    onClick={() => setActiveTab('meetings')}
                    className="text-[10px] font-bold text-main uppercase tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    Calendar <FiChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {meetings.length === 0 ? (
                  <p className="text-xs text-[#6E6E73] dark:text-[#86868B]/60 text-center py-4 font-medium">No sessions scheduled.</p>
                ) : (
                  <div className="grid gap-3 pt-2">
                    {meetings.slice(0, 3).map((meet) => (
                      <div
                        key={meet.id}
                        className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.02] dark:border-white/[0.02] space-y-2"
                      >
                        <p className="text-xs font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-tight line-clamp-1">{meet.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-[#6E6E73] dark:text-[#86868B] font-bold">
                          <FiClock className="w-3.5 h-3.5 text-main" />
                          <span>{new Date(meet.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Discussions / Announcements */}
              <div className="glass-card p-8 rounded-[28px] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.04] pb-4">
                  <h2 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                    Discussions
                  </h2>
                  <button
                    onClick={() => setActiveTab('announcements')}
                    className="text-[10px] font-bold text-main uppercase tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    View All <FiChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {announcements.length === 0 ? (
                  <p className="text-xs text-[#6E6E73] dark:text-[#86868B]/60 text-center py-4 font-medium">No announcements yet.</p>
                ) : (
                  <div className="grid gap-3 pt-2">
                    {announcements.slice(0, 2).map((ann) => (
                      <div
                        key={ann.id}
                        className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.02] dark:border-white/[0.02] space-y-1"
                      >
                        <p className="text-xs font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight line-clamp-1">{ann.title}</p>
                        <p className="text-[11px] text-[#6E6E73] dark:text-[#86868B] line-clamp-2 font-medium">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}

        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      {/* Return button */}
      <button
        onClick={() => navigate('/groups')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#6E6E73] hover:text-[#1D1D1F] dark:text-[#86868B] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer select-none"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to directory
      </button>

      {/* Beautiful Hero Banner */}
      <div className="relative overflow-hidden rounded-[32px] glass-panel p-8 md:p-12 shadow-lg border border-white/20 dark:border-white/10 select-none">
        {/* Glow Effects inside Hero */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 dark:bg-white/5 rounded-full blur-[60px] pointer-events-none animate-pulse-subtle" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/5 text-main text-[10px] font-black uppercase tracking-wider border border-color">
                {group.subject}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[11px] font-bold text-[#6E6E73] dark:text-[#86868B] border border-black/[0.02] dark:border-white/[0.02]">
                <FiUsers className="w-3.5 h-3.5" />
                {group.currentMembers} / {group.maxMembers} Members
              </span>
              {isApproved && (
                <span className="px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/5 text-main text-[10px] font-black uppercase tracking-wider border border-color">
                  Workspace Connected
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-tight">
              {group.groupName}
            </h1>
            <p className="text-[13px] font-medium text-[#6E6E73] dark:text-[#86868B] max-w-xl">
              Created by {group.createdBy?.name} • Formed on {new Date(group.createdDate || group.id).toLocaleDateString([], { dateStyle: 'long' })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {!isApproved && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/[0.04] dark:bg-white/5 border border-color text-xs text-main font-bold select-none">
                {isPending ? (
                  <span>Request Pending Approval</span>
                ) : (
                  <span className="flex items-center gap-1"><FiLock className="w-3.5 h-3.5" /> Join Group to Unlock Details</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs navigation bar - VisionOS Segmented Control */}
      {isApproved && (
        <div className="glass-panel p-1.5 rounded-full flex items-center overflow-x-auto no-scrollbar gap-1 max-w-max border border-black/[0.03] dark:border-white/[0.04] select-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const locked = tab.protected && !isApproved;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                disabled={locked}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  active
                    ? 'bg-primary text-primary-text shadow-sm'
                    : locked
                      ? 'text-[#6E6E73]/40 dark:text-[#86868B]/40 cursor-not-allowed'
                      : 'text-[#6E6E73] dark:text-[#86868B] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{tab.name}</span>
                {locked && <FiLock className="w-3 h-3 flex-shrink-0 text-[#6E6E73]/50" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Tabs panels viewport */}
      <div className="min-h-[40vh] transition-all duration-300">
        {activeTab === 'overview' && renderOverviewTab()}

        {isApproved && (
          <>
            {activeTab === 'members' && (
              <GroupMembers
                members={members}
                isCreator={isCreator}
                isAdmin={isAdmin}
                onApprove={handleApproveMember}
                onReject={handleRejectMember}
                loadingAction={actionLoading}
              />
            )}

            {activeTab === 'meetings' && (
              <GroupMeetings
                meetings={meetings}
                groupId={id}
                isCreator={isCreator}
                isAdmin={isAdmin}
                onRefresh={loadGroupDetails}
              />
            )}

            {activeTab === 'announcements' && (
              <GroupAnnouncements
                announcements={announcements}
                groupId={id}
                isCreator={isCreator}
                isAdmin={isAdmin}
                onRefresh={loadGroupDetails}
              />
            )}

            {activeTab === 'resources' && (
              <GroupResources
                resources={resources}
                groupId={id}
                isCreator={isCreator}
                isAdmin={isAdmin}
                onRefresh={loadGroupDetails}
              />
            )}

            {activeTab === 'tasks' && (
              <GroupTasks
                tasks={tasks}
                members={members}
                groupId={id}
                isCreator={isCreator}
                isAdmin={isAdmin}
                onRefresh={loadGroupDetails}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;
