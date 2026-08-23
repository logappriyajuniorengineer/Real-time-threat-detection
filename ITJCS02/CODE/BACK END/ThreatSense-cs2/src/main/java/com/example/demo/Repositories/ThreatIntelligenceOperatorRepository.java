package com.example.demo.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entites.ThreatIntelligenceOperator;

public interface ThreatIntelligenceOperatorRepository extends JpaRepository<ThreatIntelligenceOperator, Long> {

	Optional<ThreatIntelligenceOperator> findByEmail(String email);

}
