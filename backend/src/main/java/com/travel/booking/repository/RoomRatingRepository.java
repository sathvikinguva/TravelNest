package com.travel.booking.repository;

import com.travel.booking.entity.RoomRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoomRatingRepository extends JpaRepository<RoomRating, Long> {
    List<RoomRating> findAllByOrderByCreatedAtDesc();

    @Query("select rr.roomId, avg(rr.rating), count(rr) from RoomRating rr group by rr.roomId")
    List<Object[]> findRoomRatingSummary();
}
