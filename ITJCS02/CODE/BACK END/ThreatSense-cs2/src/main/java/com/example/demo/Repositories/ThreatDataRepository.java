package com.example.demo.Repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.Entites.ThreatData;

public interface ThreatDataRepository extends JpaRepository<ThreatData, Long> {

	@Query("SELECT t FROM ThreatData t WHERE DATE(t.collectedAt) = CURRENT_DATE ORDER BY t.collectedAt DESC")
    List<ThreatData> findTodayData();

    @Query("SELECT t FROM ThreatData t WHERE DATE(t.scrapedHour) = CURRENT_DATE ORDER BY t.scrapedHour DESC")
    List<ThreatData> findTodayDataByHour();

    @Query("SELECT t FROM ThreatData t WHERE t.scrapedHour >= :startTime AND t.scrapedHour < :endTime")
    List<ThreatData> findDataByHourRange(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

	List<ThreatData> findFirst10ByOrderByIdAsc();

	List<ThreatData> findByCollectedBy_EmailAndSource(String email, String source);

	List<ThreatData> findBySecurityAnalystEmail(String analystEmail);

	List<ThreatData> findBySecurityAnalystEmailAndSource(String analystEmail, String source);

	List<ThreatData> findBycollectedAtBetween(LocalDateTime atStartOfDay, LocalDateTime atTime);
}
