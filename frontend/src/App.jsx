import './index.css'
import { useEffect, useMemo, useState } from 'react'
import Books from './components/Books'
import Rentals from './components/Rentals'

function App() {
  const [books, setBooks] = useState([])
  const [loadingBooks, setLoadingBooks] = useState(false)
  const [bookForm, setBookForm] = useState({ title: '', author: '', genre: '' })
  const [editingBookId, setEditingBookId] = useState(null)
  const [editBookForm, setEditBookForm] = useState({ title: '', author: '', genre: '', availabilityStatus: 'AVAILABLE' })
  const [rentals, setRentals] = useState([])
  const [loadingRentals, setLoadingRentals] = useState(false)
  const [rentalForm, setRentalForm] = useState({ username: '', bookId: '', rentalDate: '', returnDate: '' })
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('books')

  const availableBooks = useMemo(() => books.filter(b => b.availabilityStatus === 'AVAILABLE'), [books])

  async function fetchBooks() {
    setLoadingBooks(true)
    setError('')
    try {
      const res = await fetch('/api/books')
      if (!res.ok) throw new Error('Failed to load books')
      const data = await res.json()
      setBooks(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingBooks(false)
    }
  }

  async function fetchRentals() {
    setLoadingRentals(true)
    setError('')
    try {
      const res = await fetch('/api/rentals')
      if (!res.ok) throw new Error('Failed to load rentals')
      const data = await res.json()
      setRentals(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingRentals(false)
    }
  }

  useEffect(() => {
    fetchBooks()
    fetchRentals()
  }, [])

  async function handleAddBook(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bookForm.title,
          author: bookForm.author,
          genre: bookForm.genre
        })
      })
      if (!res.ok) throw new Error('Failed to add book')
      setBookForm({ title: '', author: '', genre: '' })
      await fetchBooks()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleRentBook(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        username: rentalForm.username,
        bookId: rentalForm.bookId ? Number(rentalForm.bookId) : null,
        rentalDate: rentalForm.rentalDate
      }
      if (rentalForm.returnDate) {
        payload.returnDate = rentalForm.returnDate
      }
      const res = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to create rental')
      setRentalForm({ username: '', bookId: '', rentalDate: '', returnDate: '' })
      await Promise.all([fetchBooks(), fetchRentals()])
    } catch (e) {
      setError(e.message)
    }
  }

  function startEditBook(book) {
    setEditingBookId(book.id)
    setEditBookForm({
      title: book.title || '',
      author: book.author || '',
      genre: book.genre || '',
      availabilityStatus: book.availabilityStatus || 'AVAILABLE'
    })
  }

  function cancelEditBook() {
    setEditingBookId(null)
    setEditBookForm({ title: '', author: '', genre: '', availabilityStatus: 'AVAILABLE' })
  }

  async function handleUpdateBook(e) {
    e.preventDefault()
    if (!editingBookId) return
    setError('')
    try {
      const res = await fetch(`/api/books/${editingBookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editBookForm.title,
          author: editBookForm.author,
          genre: editBookForm.genre,
          availabilityStatus: editBookForm.availabilityStatus
        })
      })
      if (!res.ok) throw new Error('Failed to update book')
      cancelEditBook()
      await fetchBooks()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDeleteBook(id) {
    if (!id) return
    if (!window.confirm('Delete this book?')) return
    setError('')
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete book')
      if (editingBookId === id) cancelEditBook()
      await fetchBooks()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleMarkReturned(rentalId) {
    if (!rentalId) return
    setError('')
    try {
      const today = new Date().toISOString().slice(0, 10)
      const res = await fetch(`/api/rentals/${rentalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnDate: today })
      })
      if (!res.ok) throw new Error('Failed to mark returned')
      await Promise.all([fetchRentals(), fetchBooks()])
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDeleteRental(id) {
    if (!id) return
    if (!window.confirm('Delete this rental?')) return
    setError('')
    try {
      const res = await fetch(`/api/rentals/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete rental')
      await Promise.all([fetchRentals(), fetchBooks()])
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">Book Rental</h1>
          <nav className="flex gap-2">
            <button
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-sm sm:text-base font-medium border ${activeTab === 'books' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('books')}
            >
              Books
            </button>
            <button
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-sm sm:text-base font-medium border ${activeTab === 'rentals' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('rentals')}
            >
              Rentals
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">

      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded-md mb-3">
          {error}
        </div>
      )}

      {activeTab === 'books' ? (
        <Books
          books={books}
          availableBooks={availableBooks}
          loadingBooks={loadingBooks}
          bookForm={bookForm}
          setBookForm={setBookForm}
          editingBookId={editingBookId}
          editBookForm={editBookForm}
          setEditBookForm={setEditBookForm}
          startEditBook={startEditBook}
          cancelEditBook={cancelEditBook}
          handleAddBook={handleAddBook}
          handleUpdateBook={handleUpdateBook}
          handleDeleteBook={handleDeleteBook}
        />
      ) : (
        <Rentals
          rentals={rentals}
          loadingRentals={loadingRentals}
          rentalForm={rentalForm}
          setRentalForm={setRentalForm}
          availableBooks={availableBooks}
          handleRentBook={handleRentBook}
          handleMarkReturned={handleMarkReturned}
          handleDeleteRental={handleDeleteRental}
        />
      )}
      </main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Book Rental
        </div>
      </footer>
    </div>
  )
}

export default App