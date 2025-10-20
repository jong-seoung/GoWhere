package com.gowhere.backend.service;

import com.gowhere.backend.dto.TripDto;
import com.gowhere.backend.entity.Trip;
import com.gowhere.backend.entity.User;
import com.gowhere.backend.repository.TripRepository;
import com.gowhere.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Transactional
    public Trip createTrip(TripDto dto) {
        Trip trip = new Trip();
        trip.setTitle(dto.getTitle());
        trip.setDescription(dto.getDescription());
        trip.setStartDate(dto.getStartDate());
        trip.setEndDate(dto.getEndDate());
        trip.setTriptype(dto.getTripType());
        trip.setDeparture(dto.getDeparture());
        trip.setDestination(dto.getDestination());

        //  현재 로그인한 사용자가져오기
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        trip.setAutor(author);

        return tripRepository.save(trip);
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + id));
    }

    @Transactional
    public Trip updateTrip(Long id, TripDto dto) {
        Trip trip = getTripById(id);

        // 권한 체크: 작성자만 수정 가능
        checkAuthor(trip);

        trip.setTitle(dto.getTitle());
        trip.setDescription(dto.getDescription());
        trip.setStartDate(dto.getStartDate());
        trip.setEndDate(dto.getEndDate());
        trip.setTriptype(dto.getTripType());
        trip.setDeparture(dto.getDeparture());
        trip.setDestination(dto.getDestination());
        return tripRepository.save(trip);
    }

    @Transactional
    public boolean deleteTrip(Long id) {
        Trip trip = getTripById(id);

        // 권한 체크: 작성자만 삭제 가능
        checkAuthor(trip);

        tripRepository.delete(trip);
        return true;
    }

    // 작성자 권한 확인
    private void checkAuthor(Trip trip) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!trip.getAutor().getUsername().equals(username)) {
            throw new RuntimeException("권한이 없습니다. 본인이 작성한 게시물 외에는 수정/삭제할 수 없습니다.");
        }
    }
}
