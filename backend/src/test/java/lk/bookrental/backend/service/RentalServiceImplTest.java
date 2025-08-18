package lk.bookrental.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lk.bookrental.backend.dto.request.RentalRequest;
import lk.bookrental.backend.dto.response.RentalResponse;
import lk.bookrental.backend.model.AvailabilityStatus;
import lk.bookrental.backend.model.Book;
import lk.bookrental.backend.model.Rental;
import lk.bookrental.backend.repository.BookRepository;
import lk.bookrental.backend.repository.RentalRepository;
import lk.bookrental.backend.service.impl.RentalServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RentalServiceImplTest {

    @Mock
    private RentalRepository rentalRepository;

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private RentalServiceImpl rentalService;

    @Test
    void createRental_marksBookUnavailable_andThrowsIfAlreadyUnavailable() {
        Book availableBook = Book.builder().id(1L).title("Dune").author("Frank Herbert").genre("Sci-Fi").availabilityStatus(AvailabilityStatus.AVAILABLE).build();
        when(bookRepository.findById(1L)).thenReturn(Optional.of(availableBook));
        when(rentalRepository.save(any(Rental.class))).thenAnswer(invocation -> {
            Rental r = invocation.getArgument(0);
            r.setId(10L);
            return r;
        });

        RentalRequest request = new RentalRequest("user", LocalDate.now(), null, 1L);
        RentalResponse created = rentalService.createRental(request);

        assertThat(created.getBook().getAvailabilityStatus()).isEqualTo(AvailabilityStatus.UNAVAILABLE);
        assertThat(availableBook.getAvailabilityStatus()).isEqualTo(AvailabilityStatus.UNAVAILABLE);

        assertThrows(IllegalStateException.class, () -> rentalService.createRental(request));
    }

    @Test
    void updateRental_setsReturnDate_andMarksBookAvailable() {
        Book book = Book.builder().id(2L).title("Book").author("A").genre("G").availabilityStatus(AvailabilityStatus.UNAVAILABLE).build();
        Rental rental = Rental.builder().id(20L).username("user").rentalDate(LocalDate.now()).book(book).build();
        when(rentalRepository.findById(20L)).thenReturn(Optional.of(rental));
        when(rentalRepository.save(any(Rental.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RentalRequest update = new RentalRequest(null, null, LocalDate.now().plusDays(1), null);
        RentalResponse updated = rentalService.updateRental(20L, update);

        assertThat(updated.getReturnDate()).isNotNull();
        assertThat(book.getAvailabilityStatus()).isEqualTo(AvailabilityStatus.AVAILABLE);
    }

    @Test
    void deleteRental_ofActiveRental_marksBookAvailable() {
        Book book = Book.builder().id(3L).title("B").author("A").genre("G").availabilityStatus(AvailabilityStatus.UNAVAILABLE).build();
        Rental rental = Rental.builder().id(30L).username("user").rentalDate(LocalDate.now()).book(book).build();
        when(rentalRepository.findById(30L)).thenReturn(Optional.of(rental));

        rentalService.deleteRental(30L);

        assertThat(book.getAvailabilityStatus()).isEqualTo(AvailabilityStatus.AVAILABLE);
        verify(rentalRepository).deleteById(30L);
        verify(bookRepository).save(book);
    }

    @Test
    void createRental_throwsWhenBookNotFound() {
        when(bookRepository.findById(999L)).thenReturn(Optional.empty());
        RentalRequest req = new RentalRequest("user", LocalDate.now(), null, 999L);
        assertThrows(EntityNotFoundException.class, () -> rentalService.createRental(req));
    }
}


