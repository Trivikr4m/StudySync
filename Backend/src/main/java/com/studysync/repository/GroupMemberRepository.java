package com.studysync.repository;

import com.studysync.model.GroupMember;
import com.studysync.model.MemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByGroup_Id(Long groupId);
    List<GroupMember> findByGroup_IdAndStatus(Long groupId, MemberStatus status);
    Optional<GroupMember> findByGroup_IdAndUser_Id(Long groupId, Long userId);
    long countByGroup_IdAndStatus(Long groupId, MemberStatus status);
    List<GroupMember> findByUser_IdAndStatus(Long userId, MemberStatus status);
}
