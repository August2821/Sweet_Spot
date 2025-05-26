package com.sweetspot.server.pin;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PinRepository extends JpaRepository<PinEntity, Long> {
    
}
