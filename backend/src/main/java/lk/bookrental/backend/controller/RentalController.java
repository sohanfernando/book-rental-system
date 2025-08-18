package lk.bookrental.backend.controller;

import lk.bookrental.backend.dto.request.RentalRequest;
import lk.bookrental.backend.dto.response.RentalResponse;
import lk.bookrental.backend.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @PostMapping
    public ResponseEntity<RentalResponse> create(@RequestBody RentalRequest request) {
        return ResponseEntity.ok(rentalService.createRental(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RentalResponse> update(@PathVariable Long id, @RequestBody RentalRequest request) {
        return ResponseEntity.ok(rentalService.updateRental(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(rentalService.getRentalById(id));
    }

    @GetMapping
    public ResponseEntity<List<RentalResponse>> getAll() {
        return ResponseEntity.ok(rentalService.getAllRentals());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        rentalService.deleteRental(id);
        return ResponseEntity.noContent().build();
    }
}


