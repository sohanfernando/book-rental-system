import React from 'react'

function Books({
	books,
	availableBooks,
	loadingBooks,
	bookForm,
	setBookForm,
	editingBookId,
	editBookForm,
	setEditBookForm,
	startEditBook,
	cancelEditBook,
	handleAddBook,
	handleUpdateBook,
	handleDeleteBook
}) {
	return (
		<>
			<section className="mb-6">
				<h2 className="text-lg font-semibold mb-2">Available Books</h2>
				{loadingBooks ? (
					<div>Loading books...</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
						{availableBooks.map(book => (
							<div key={book.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow transition">
								<div className="font-semibold">{book.title}</div>
								<div className="text-gray-700">{book.author}</div>
								<div className="text-xs text-gray-500">{book.genre}</div>
								<div className="mt-2">
									<small>Status: {book.availabilityStatus}</small>
								</div>
							</div>
						))}
						{availableBooks.length === 0 && (
							<div>No available books.</div>
						)}
					</div>
				)}
			</section>

			<section className="mb-6">
				<h2 className="text-lg font-semibold mb-2">Manage Books</h2>
				{loadingBooks ? (
					<div>Loading books...</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
						{books.map(book => (
							<div key={book.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
								{editingBookId === book.id ? (
									<form onSubmit={handleUpdateBook} className="grid gap-2">
										<input className="p-2 border border-gray-200 rounded-md" placeholder="Title" value={editBookForm.title} onChange={e => setEditBookForm(v => ({ ...v, title: e.target.value }))} required />
										<input className="p-2 border border-gray-200 rounded-md" placeholder="Author" value={editBookForm.author} onChange={e => setEditBookForm(v => ({ ...v, author: e.target.value }))} required />
										<input className="p-2 border border-gray-200 rounded-md" placeholder="Genre" value={editBookForm.genre} onChange={e => setEditBookForm(v => ({ ...v, genre: e.target.value }))} required />
										<div className="grid gap-1">
											<label htmlFor={`avail-${book.id}`} className="text-xs text-gray-700">Availability</label>
											<select id={`avail-${book.id}`} className="p-2 border border-gray-200 rounded-md" value={editBookForm.availabilityStatus} onChange={e => setEditBookForm(v => ({ ...v, availabilityStatus: e.target.value }))}>
												<option value="AVAILABLE">AVAILABLE</option>
												<option value="UNAVAILABLE">UNAVAILABLE</option>
											</select>
										</div>
										<div className="flex gap-2">
											<button type="submit" className="px-3 py-2 bg-green-600 text-white rounded-md">Save</button>
											<button type="button" onClick={cancelEditBook} className="px-3 py-2 bg-gray-600 text-white rounded-md">Cancel</button>
										</div>
									</form>
								) : (
									<>
										<div className="font-semibold">{book.title}</div>
										<div className="text-gray-700">{book.author}</div>
										<div className="text-xs text-gray-500">{book.genre}</div>
										<div className="mt-2">
											<small>Status: {book.availabilityStatus}</small>
										</div>
										<div className="flex gap-2 mt-2">
											<button onClick={() => startEditBook(book)} className="px-3 py-2 bg-blue-600 text-white rounded-md">Edit</button>
											<button onClick={() => handleDeleteBook(book.id)} className="px-3 py-2 bg-red-600 text-white rounded-md">Delete</button>
										</div>
									</>
								)}
							</div>
						))}
						{books.length === 0 && (
							<div>No books found.</div>
						)}
					</div>
				)}
			</section>

			<section className="mb-6">
				<h2 className="text-lg font-semibold mb-2">Add New Book</h2>
				<form onSubmit={handleAddBook} className="grid gap-2 max-w-md">
					<input className="p-2 border border-gray-200 rounded-md" placeholder="Title" value={bookForm.title} onChange={e => setBookForm(v => ({ ...v, title: e.target.value }))} required />
					<input className="p-2 border border-gray-200 rounded-md" placeholder="Author" value={bookForm.author} onChange={e => setBookForm(v => ({ ...v, author: e.target.value }))} required />
					<input className="p-2 border border-gray-200 rounded-md" placeholder="Genre" value={bookForm.genre} onChange={e => setBookForm(v => ({ ...v, genre: e.target.value }))} required />
					<button type="submit" className="px-3 py-2 bg-gray-900 text-white rounded-md">Add Book</button>
				</form>
			</section>
		</>
	)
}

export default Books