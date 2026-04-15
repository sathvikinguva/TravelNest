package com.travel.booking.dto;

public class RoomRatingSummaryDTO {

    private Long roomId;
    private Double averageRating;
    private Long ratingCount;

    public RoomRatingSummaryDTO(Long roomId, Double averageRating, Long ratingCount) {
        this.roomId = roomId;
        this.averageRating = averageRating;
        this.ratingCount = ratingCount;
    }

    public Long getRoomId() {
        return roomId;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public Long getRatingCount() {
        return ratingCount;
    }
}
