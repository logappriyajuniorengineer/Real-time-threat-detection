package com.example.demo.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entites.SecurityAnalyst;

public interface SecurityAnalystRepository extends JpaRepository<SecurityAnalyst, Long> {

	Optional<SecurityAnalyst> findByEmail(String email);

}
