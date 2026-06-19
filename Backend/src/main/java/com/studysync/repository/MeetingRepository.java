package com.studysync.repository;

import com.studysync.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    List<Meeting> findByGroup_Id(Long groupId);
    List<Meeting> findByGroup_IdIn(List<Long> groupIds);
}
