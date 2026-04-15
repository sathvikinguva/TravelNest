package com.travel.booking.repository;

import com.travel.booking.entity.FlightPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlightPaymentRepository extends JpaRepository<FlightPayment, Long> {
    List<FlightPayment> findAllByOrderByPaidAtDesc();
}
