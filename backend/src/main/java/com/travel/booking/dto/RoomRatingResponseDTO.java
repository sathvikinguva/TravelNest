package com.travel.booking.dto;

public class RoomRatingResponseDTO {

    private Long id;
    private Long roomId;
    private Long userId;
    private String userEmail;
    private Integer rating;
    private String review;
    private String createdAt;

    public RoomRatingResponseDTO(Long id, Long roomId, Long userId, String userEmail, Integer rating, String review, String createdAt) {
        this.id = id;
        this.roomId = roomId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.rating = rating;
        this.review = review;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getRoomId() { return roomId; }
    public Long getUserId() { return userId; }
    public String getUserEmail() { return userEmail; }
    public Integer getRating() { return rating; }
    public String getReview() { return review; }
    public String getCreatedAt() { return createdAt; }
}
