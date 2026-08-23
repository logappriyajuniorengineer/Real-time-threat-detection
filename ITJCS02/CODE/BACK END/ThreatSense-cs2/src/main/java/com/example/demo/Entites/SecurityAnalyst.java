package com.example.demo.Entites;

import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("SECURITY_ANALYST")
@EqualsAndHashCode(callSuper = true)
public class SecurityAnalyst extends User  {

}
