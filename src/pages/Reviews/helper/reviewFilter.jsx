import { useState } from 'react'

function ReviewFilter(onFilterChange) {
    const [selectedFilter, setSelectedFilter] = useState('recent');

    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
        onFilterChange(e.target.value);
    }

    return (
        <div>
            <div className="review-filter">
                <label htmlFor="filter">Filter by:</label>
                <select
                    name="filter"
                    id="filter"
                    value={selectedFilter}
                    onChange={handleFilterChange}
                >
                    <option value="recent">Recent</option>
                    <option value="oldest">Oldest</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                </select>
            </div>
        </div>
    )
}

export default ReviewFilter