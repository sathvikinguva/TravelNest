package com.travel.booking.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class FlightResponseDTO {

    private Long id;
    private String flightName;
    private String source;
    private String destination;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime date;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime departureTime;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime arrivalTime;
    private String imageUrl;
    private String cabinClass;
    private Double price;

    public FlightResponseDTO(
            Long id,
            String flightName,
            String source,
            String destination,
            LocalDateTime date,
            LocalDateTime departureTime,
            LocalDateTime arrivalTime,
            String imageUrl,
            String cabinClass,
            Double price
    ) {
        this.id = id;
        this.flightName = flightName;
        this.source = source;
        this.destination = destination;
        this.date = date;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.imageUrl = imageUrl;
        this.cabinClass = cabinClass;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public String getFlightName() {
        return flightName;
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

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getCabinClass() {
        return cabinClass;
    }

    public Double getPrice() {
        return price;
    }
}
