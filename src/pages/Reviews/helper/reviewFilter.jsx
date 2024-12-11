function ReviewFilter({ onFilterChange }) {
    const handleFilterChange = (e) => {
        const newFilter = e.target.value;
        onFilterChange(newFilter);
        console.log(newFilter);
    }

    return (
        <div>
            <div className="review-filter font-lato flex gap-2 mb-4">
                <label htmlFor="filter">Filter by:</label>
                <select
                    name="filter"
                    id="filter"
                    onChange={handleFilterChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w p-1 w-20 "
                >
                    <option value="Newest">Recent</option>
                    <option value="Oldest">Oldest</option>
                    <option value="Highest">Highest Rating</option>
                    <option value="Lowest">Lowest Rating</option>
                </select>
            </div>
        </div>
    )
}

export default ReviewFilter