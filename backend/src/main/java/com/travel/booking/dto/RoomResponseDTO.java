package com.travel.booking.dto;

public class RoomResponseDTO {

    private Long id;
    private String name;
    private String location;
    private String imageUrl;
    private String roomType;
    private String description;
    private Double price;
    private Boolean available;

    public RoomResponseDTO(Long id, String name, String location, String imageUrl, String roomType, String description, Double price, Boolean available) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.imageUrl = imageUrl;
        this.roomType = roomType;
        this.description = description;
        this.price = price;
        this.available = available;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getRoomType() {
        return roomType;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public Boolean getAvailable() {
        return available;
    }
}
