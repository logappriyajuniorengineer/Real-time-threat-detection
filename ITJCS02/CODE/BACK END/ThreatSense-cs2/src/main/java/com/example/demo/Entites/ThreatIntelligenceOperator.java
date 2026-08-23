package com.example.demo.Entites;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("THREAT_INTELLIGENCE_OPERATOR")
@EqualsAndHashCode(callSuper = true) 
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ThreatIntelligenceOperator extends User {
	

}
