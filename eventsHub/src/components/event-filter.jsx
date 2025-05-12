"use client"

import { useState, useEffect } from "react"

export default function EventFilterComponent({ filters, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState({
    date: filters.date || "",
    search: filters.search || "",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // EventFilterComponent
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLocalFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e) => {
    const { name, value } = e.target
    setLocalFilters((prev) => ({ ...prev, [name]: value }))
  }

  const applyFilters = () => {
    onFilterChange(localFilters)
  }

  const clearFilters = () => {
    const cleared = {
      category: "",
      date: "",
      search: "",
    }
    setLocalFilters(cleared)
    onFilterChange(cleared)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Filter Events</h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="search" className="mb-2 block font-medium">
            Search
          </label>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search events..."
            value={localFilters.search}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="date" className="mb-2 block font-medium">
            Date
          </label>
          <select
            id="date"
            name="date"
            value={localFilters.date}
            onChange={handleSelectChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Any Date</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this-week">This Week</option>
            <option value="this-weekend">This Weekend</option>
            <option value="next-week">Next Week</option>
            <option value="this-month">This Month</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <button
            onClick={applyFilters}
            className="bg-purple-700 text-white px-4 py-2 cursor-pointer rounded hover:bg-purple-800"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="border border-gray-300 px-4 py-2 cursor-pointer rounded hover:bg-gray-100"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}
