package lk.bookrental.backend.service;

import lk.bookrental.backend.dto.request.RentalRequest;
import lk.bookrental.backend.dto.response.RentalResponse;

import java.util.List;

public interface RentalService {
    RentalResponse createRental(RentalRequest request);
    RentalResponse updateRental(Long id, RentalRequest request);
    RentalResponse getRentalById(Long id);
    List<RentalResponse> getAllRentals();
    void deleteRental(Long id);
}


