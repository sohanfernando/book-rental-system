package lk.bookrental.backend.service;

import lk.bookrental.backend.dto.request.BookRequest;
import lk.bookrental.backend.dto.response.BookResponse;

import java.util.List;

public interface BookService {
    BookResponse createBook(BookRequest request);
    BookResponse updateBook(Long id, BookRequest request);
    void deleteBook(Long id);
    BookResponse getBookById(Long id);
    List<BookResponse> getAllBooks();
}
