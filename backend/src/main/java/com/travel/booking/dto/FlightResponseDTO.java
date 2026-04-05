package com.travel.booking.dto;

import java.time.LocalDateTime;

public class FlightResponseDTO {

    private Long id;
    private String source;
    private String destination;
    private LocalDateTime date;
    private Double price;

    public FlightResponseDTO(Long id, String source, String destination, LocalDateTime date, Double price) {
        this.id = id;
        this.source = source;
        this.destination = destination;
        this.date = date;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public Double getPrice() {
        return price;
    }
}
