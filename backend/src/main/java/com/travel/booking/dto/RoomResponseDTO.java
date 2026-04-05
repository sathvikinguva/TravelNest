package com.travel.booking.dto;

public class RoomResponseDTO {

    private Long id;
    private String name;
    private String location;
    private Double price;
    private Boolean available;

    public RoomResponseDTO(Long id, String name, String location, Double price, Boolean available) {
        this.id = id;
        this.name = name;
        this.location = location;
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

    public Double getPrice() {
        return price;
    }

    public Boolean getAvailable() {
        return available;
    }
}
