package com.studysync.repository;

import com.studysync.model.StudyGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {
    @Query("SELECT g FROM StudyGroup g WHERE " +
           "(:subject IS NULL OR LOWER(g.subject) LIKE LOWER(CONCAT('%', :subject, '%'))) AND " +
           "(:department IS NULL OR LOWER(g.department) LIKE LOWER(CONCAT('%', :department, '%'))) AND " +
           "(:year IS NULL OR g.year = :year)")
    Page<StudyGroup> findByFilters(
            @Param("subject") String subject,
            @Param("department") String department,
            @Param("year") Integer year,
            Pageable pageable
    );
}
