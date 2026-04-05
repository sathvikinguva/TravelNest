package com.travel.booking.controller;

import com.travel.booking.dto.FlightResponseDTO;
import com.travel.booking.service.FlightService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @GetMapping
    public List<FlightResponseDTO> getAllFlights() {
        return flightService.getAllFlights();
    }

    @GetMapping("/{id}")
    public FlightResponseDTO getFlightById(@PathVariable Long id) {
        return flightService.getFlightById(id);
    }
}
