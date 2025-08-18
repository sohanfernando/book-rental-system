package lk.bookrental.backend.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lk.bookrental.backend.dto.request.RentalRequest;
import lk.bookrental.backend.dto.response.BookResponse;
import lk.bookrental.backend.dto.response.RentalResponse;
import lk.bookrental.backend.model.AvailabilityStatus;
import lk.bookrental.backend.model.Book;
import lk.bookrental.backend.model.Rental;
import lk.bookrental.backend.repository.BookRepository;
import lk.bookrental.backend.repository.RentalRepository;
import lk.bookrental.backend.service.RentalService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RentalServiceImpl implements RentalService {

    private final RentalRepository rentalRepository;
    private final BookRepository bookRepository;

    public RentalServiceImpl(RentalRepository rentalRepository, BookRepository bookRepository) {
        this.rentalRepository = rentalRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public RentalResponse createRental(RentalRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new EntityNotFoundException("Book not found"));

        if (book.getAvailabilityStatus() == AvailabilityStatus.UNAVAILABLE) {
            throw new IllegalStateException("Book is not available for rental");
        }

        Rental rental = Rental.builder()
                .username(request.getUsername())
                .rentalDate(request.getRentalDate())
                .returnDate(request.getReturnDate())
                .book(book)
                .build();

        // mark book as unavailable when rented
        book.setAvailabilityStatus(AvailabilityStatus.UNAVAILABLE);
        bookRepository.save(book);

        rental = rentalRepository.save(rental);
        return toResponse(rental);
    }

    @Override
    public RentalResponse updateRental(Long id, RentalRequest request) {
        Rental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rental not found"));

        if (request.getUsername() != null) rental.setUsername(request.getUsername());
        if (request.getRentalDate() != null) rental.setRentalDate(request.getRentalDate());
        if (request.getReturnDate() != null) {
            rental.setReturnDate(request.getReturnDate());
            // when return date is set, mark book as available again
            Book book = rental.getBook();
            book.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            bookRepository.save(book);
        }

        rental = rentalRepository.save(rental);
        return toResponse(rental);
    }

    @Override
    public RentalResponse getRentalById(Long id) {
        Rental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rental not found"));
        return toResponse(rental);
    }

    @Override
    public List<RentalResponse> getAllRentals() {
        return rentalRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public void deleteRental(Long id) {
        Rental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rental not found"));
        // if rental not returned yet, mark book available again
        if (rental.getReturnDate() == null) {
            Book book = rental.getBook();
            book.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            bookRepository.save(book);
        }
        rentalRepository.deleteById(id);
    }

    private RentalResponse toResponse(Rental rental) {
        Book book = rental.getBook();
        BookResponse bookResponse = BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .genre(book.getGenre())
                .availabilityStatus(book.getAvailabilityStatus())
                .build();

        return RentalResponse.builder()
                .id(rental.getId())
                .username(rental.getUsername())
                .rentalDate(rental.getRentalDate())
                .returnDate(rental.getReturnDate())
                .book(bookResponse)
                .build();
    }
}


