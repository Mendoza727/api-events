import { useState } from "react"
import EventFilterComponent from "../../components/event-filter"
import EventListComponent from "../../components/event-list"

export default function EventsPage({ isStaff }) {
  const [filters, setFilters] = useState({
    date: "",
    category: "",
  })

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Events</h1>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <EventFilterComponent filters={filters} onFilterChange={handleFilterChange} />
            </div>

            <div className="md:w-3/4">
              <EventListComponent filters={filters} isStaff={isStaff} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
