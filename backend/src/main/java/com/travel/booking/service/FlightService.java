package com.travel.booking.service;

import com.travel.booking.dto.FlightRequestDTO;
import com.travel.booking.dto.FlightResponseDTO;
import com.travel.booking.entity.Flight;
import com.travel.booking.exception.ResourceNotFoundException;
import com.travel.booking.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    public List<FlightResponseDTO> getAllFlights() {
        return flightRepository.findAll().stream().map(this::toResponse).toList();
    }

    public FlightResponseDTO getFlightById(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
        return toResponse(flight);
    }

    public FlightResponseDTO createFlight(FlightRequestDTO request) {
        Flight flight = new Flight();
        mapRequestToEntity(request, flight);
        return toResponse(flightRepository.save(flight));
    }

    public FlightResponseDTO updateFlight(Long id, FlightRequestDTO request) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
        mapRequestToEntity(request, flight);
        return toResponse(flightRepository.save(flight));
    }

    public void deleteFlight(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new ResourceNotFoundException("Flight not found with id: " + id);
        }
        flightRepository.deleteById(id);
    }

    public void validateFlightExists(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new ResourceNotFoundException("Flight not found with id: " + id);
        }
    }

    private void mapRequestToEntity(FlightRequestDTO request, Flight flight) {
        flight.setSource(request.getSource());
        flight.setDestination(request.getDestination());
        flight.setDate(request.getDate());
        flight.setPrice(request.getPrice());
    }

    private FlightResponseDTO toResponse(Flight flight) {
        return new FlightResponseDTO(
                flight.getId(),
                flight.getSource(),
                flight.getDestination(),
                flight.getDate(),
                flight.getPrice()
        );
    }
}
