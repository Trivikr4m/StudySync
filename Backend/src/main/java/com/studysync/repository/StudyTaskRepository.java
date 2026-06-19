package com.studysync.repository;

import com.studysync.model.StudyTask;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudyTaskRepository extends JpaRepository<StudyTask, Long> {
    List<StudyTask> findByGroup_Id(Long groupId);
}
