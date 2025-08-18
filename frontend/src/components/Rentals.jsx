import React from 'react'

function Rentals({
	rentals,
	loadingRentals,
	rentalForm,
	setRentalForm,
	availableBooks,
	handleRentBook,
	handleMarkReturned,
	handleDeleteRental
}) {
	return (
		<>
			<section className="mb-6">
				<h2 className="text-lg font-semibold mb-2">Rent a Book</h2>
				<form onSubmit={handleRentBook} className="grid gap-3 w-full max-w-xl">
					<input className="w-full p-2 border border-gray-200 rounded-md" placeholder="Your name" value={rentalForm.username} onChange={e => setRentalForm(v => ({ ...v, username: e.target.value }))} required />
					<select className="w-full p-2 border border-gray-200 rounded-md" value={rentalForm.bookId} onChange={e => setRentalForm(v => ({ ...v, bookId: e.target.value }))} required>
						<option value="">Select book</option>
						{availableBooks.map(book => (
							<option key={book.id} value={book.id}>{book.title} — {book.author}</option>
						))}
					</select>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
						<div className="grid gap-1">
							<label htmlFor="rentalDate" className="text-xs text-gray-700">Rental date</label>
							<input id="rentalDate" className="w-full p-2 border border-gray-200 rounded-md" type="date" required value={rentalForm.rentalDate} onChange={e => setRentalForm(v => ({ ...v, rentalDate: e.target.value }))} />
						</div>
						<div className="grid gap-1">
							<label htmlFor="returnDate" className="text-xs text-gray-700">Return date (optional)</label>
							<input id="returnDate" className="w-full p-2 border border-gray-200 rounded-md" type="date" value={rentalForm.returnDate} onChange={e => setRentalForm(v => ({ ...v, returnDate: e.target.value }))} />
						</div>
					</div>
					<button type="submit" className="w-full sm:w-auto px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-md">Rent</button>
				</form>
			</section>

			<section className="mb-6">
				<h2 className="text-lg font-semibold mb-2">Rental History</h2>
				{loadingRentals ? (
					<div>Loading rentals...</div>
				) : (
					<div className="grid gap-2">
						{rentals.map(r => (
							<div key={r.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
								<div className="font-semibold">{r.book?.title} <span className="text-gray-500 font-normal">by {r.book?.author}</span></div>
								<div className="text-xs text-gray-700">Rented by {r.username} on {r.rentalDate}</div>
								<div className="text-xs text-gray-700">Returned: {r.returnDate || 'Not returned'}</div>
								<div className="flex flex-col sm:flex-row gap-2 mt-2">
									{!r.returnDate && (
										<button onClick={() => handleMarkReturned(r.id)} className="w-full sm:w-auto px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base bg-green-600 text-white rounded-md">Mark Returned</button>
									)}
									<button onClick={() => handleDeleteRental(r.id)} className="w-full sm:w-auto px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base bg-red-600 text-white rounded-md">Delete</button>
								</div>
							</div>
						))}
						{rentals.length === 0 && (
							<div>No rentals yet.</div>
						)}
					</div>
				)}
			</section>
		</>
	)
}

export default Rentals