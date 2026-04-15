package com.travel.booking.repository;

import com.travel.booking.entity.RoomPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomPaymentRepository extends JpaRepository<RoomPayment, Long> {
    List<RoomPayment> findAllByOrderByPaidAtDesc();
}
