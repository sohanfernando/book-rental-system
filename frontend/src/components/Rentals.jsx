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
	const activeRentals = rentals.filter(r => !r.returnDate)
	const returnedRentals = rentals.filter(r => r.returnDate)

	return (
		<div className="space-y-8">
			{/* Rent a Book Section */}
			<section className="animate-fade-in">
				<div className="card p-8">
					<div className="flex items-center mb-6">
						<div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4">
							<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900">Rent a Book</h2>
							<p className="text-gray-600">Create a new rental for a book</p>
						</div>
					</div>
					
					<form onSubmit={handleRentBook} className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
							<input 
								className="input-field" 
								placeholder="Enter your full name" 
								value={rentalForm.username} 
								onChange={e => setRentalForm(v => ({ ...v, username: e.target.value }))} 
								required 
							/>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Select Book</label>
							<select 
								className="select-field" 
								value={rentalForm.bookId} 
								onChange={e => setRentalForm(v => ({ ...v, bookId: e.target.value }))} 
								required
							>
								<option value="">Choose a book to rent</option>
								{availableBooks.map(book => (
									<option key={book.id} value={book.id}>
										{book.title} — {book.author}
									</option>
								))}
							</select>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Rental Date</label>
							<input 
								className="input-field" 
								type="date" 
								required 
								value={rentalForm.rentalDate} 
								onChange={e => setRentalForm(v => ({ ...v, rentalDate: e.target.value }))} 
							/>
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Return Date (Optional)</label>
							<input 
								className="input-field" 
								type="date" 
								value={rentalForm.returnDate} 
								onChange={e => setRentalForm(v => ({ ...v, returnDate: e.target.value }))} 
							/>
						</div>
						
						<div className="md:col-span-2">
							<button type="submit" className="btn-primary rounded">
								<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
								Rent Book
							</button>
						</div>
					</form>
				</div>
			</section>

			{/* Active Rentals Section */}
			<section className="animate-fade-in">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Active Rentals</h2>
						<p className="text-gray-600 mt-1">Books currently rented out</p>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
						<span className="text-sm text-gray-600">{activeRentals.length} active</span>
					</div>
				</div>
				
				{loadingRentals ? (
					<div className="flex items-center justify-center py-12">
						<div className="loading-spinner"></div>
						<span className="ml-3 text-gray-600">Loading rentals...</span>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{activeRentals.map(rental => (
							<div key={rental.id} className="card p-6">
								<div className="flex items-start justify-between mb-4">
									<div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
										<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<span className="status-badge status-rented">Rented</span>
								</div>
								
								<h3 className="font-bold text-gray-900 mb-2">{rental.book?.title}</h3>
								<p className="text-gray-600 text-sm mb-1">by {rental.book?.author}</p>
								<p className="text-gray-500 text-xs mb-4">Rented by {rental.username}</p>
								
								<div className="space-y-2 mb-4">
									<div className="flex justify-between text-xs">
										<span className="text-gray-500">Rental Date:</span>
										<span className="text-gray-700">{rental.rentalDate}</span>
									</div>
									<div className="flex justify-between text-xs">
										<span className="text-gray-500">Return Date:</span>
										<span className="text-gray-700">Not returned</span>
									</div>
								</div>
								
								<div className="flex space-x-2">
									<button 
										onClick={() => handleMarkReturned(rental.id)}
										className="btn-success flex-1 rounded"
									>
										<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										Mark Returned
									</button>
									<button 
										onClick={() => handleDeleteRental(rental.id)}
										className="btn-danger rounded"
									>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								</div>
							</div>
						))}
						
						{activeRentals.length === 0 && (
							<div className="col-span-full">
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">No active rentals</h3>
									<p className="text-gray-600">All books are currently available!</p>
								</div>
							</div>
						)}
					</div>
				)}
			</section>

			{/* Rental History Section */}
			<section className="animate-fade-in">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Rental History</h2>
						<p className="text-gray-600 mt-1">Completed rentals</p>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 bg-green-500 rounded-full"></div>
						<span className="text-sm text-gray-600">{returnedRentals.length} returned</span>
					</div>
				</div>
				
				{loadingRentals ? (
					<div className="flex items-center justify-center py-12">
						<div className="loading-spinner"></div>
						<span className="ml-3 text-gray-600">Loading rentals...</span>
					</div>
				) : (
					<div className="space-y-4">
						{returnedRentals.map(rental => (
							<div key={rental.id} className="card p-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
											<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
											</svg>
										</div>
										<div>
											<h3 className="font-bold text-gray-900">{rental.book?.title}</h3>
											<p className="text-gray-600 text-sm">by {rental.book?.author}</p>
											<p className="text-gray-500 text-xs">Rented by {rental.username}</p>
										</div>
									</div>
									
									<div className="text-right">
										<div className="space-y-1">
											<div className="text-xs text-gray-500">
												<span>Rented: {rental.rentalDate}</span>
											</div>
											<div className="text-xs text-gray-500">
												<span>Returned: {rental.returnDate}</span>
											</div>
										</div>
										<button 
											onClick={() => handleDeleteRental(rental.id)}
											className="btn-danger mt-2 rounded"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									</div>
								</div>
							</div>
						))}
						
						{returnedRentals.length === 0 && (
							<div className="text-center py-12">
								<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
								</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">No rental history</h3>
								<p className="text-gray-600">Rent some books to see them here!</p>
							</div>
						)}
					</div>
				)}
			</section>
		</div>
	)
}

export default Rentals