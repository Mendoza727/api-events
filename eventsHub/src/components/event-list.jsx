import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { EventActions } from "../actions/events/EventsActions";

function isDateInRange(date, range) {
  const today = new Date()
  const eventDate = new Date(date)
  const day = eventDate.getDay()

  switch (range) {
    case "today":
      return eventDate.toDateString() === today.toDateString()

    case "tomorrow": {
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      return eventDate.toDateString() === tomorrow.toDateString()
    }

    case "this-week": {
      const start = new Date(today)
      const end = new Date(today)
      end.setDate(today.getDate() + (7 - today.getDay()))
      return eventDate >= start && eventDate <= end
    }

    case "this-weekend":
      return day === 6 || day === 0 // Saturday or Sunday

    case "next-week": {
      const start = new Date(today)
      const end = new Date(today)
      start.setDate(today.getDate() + (7 - today.getDay()))
      end.setDate(start.getDate() + 6)
      return eventDate >= start && eventDate <= end
    }

    case "this-month":
      return (
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear()
      )

    default:
      return true
  }
}

export default function EventListComponent({ featured = false, limit = 0, filters = {} }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState([])

  const { GetAllEvents } = EventActions();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await GetAllEvents();
        if (response && Array.isArray(response.data.data)) {
          setEvents(response.data.data);
        } else {
          throw new Error("The data is not an array or is undefined.");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter((event) => {
      let matches = true

      if (filters.search && !event.name.toLowerCase().includes(filters.search.toLowerCase())) {
        matches = false
      }

      if (filters.category && event.category !== filters.category) {
        matches = false
      }

      if (filters.date && !isDateInRange(event.dateHourToEvent, filters.date)) {
        matches = false
      }

      if (filters.available && event.available_tickets <= 0) {
        matches = false
      }

      if (filters.priceRange) {
        const price = parseFloat(event.ticket_price)
        if (
          (filters.priceRange.min && price < filters.priceRange.min) ||
          (filters.priceRange.max && price > filters.priceRange.max)
        ) {
          matches = false
        }
      }

      return matches
    })

    setFilteredEvents(filtered)
  }, [filters, events])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">No events found</h3>
        <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new events.</p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h1 className="text-3xl font-bold mb-8">Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src={event.image || "https://placehold.co/600x400/purple/white?text=" + event.name}
                alt={event.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x400/purple/white?text=Event";
                }}
              />
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold line-clamp-1">{event.name}</h3>
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {event.category}
                </span>
              </div>

              <div className="flex flex-col gap-2 mb-4 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(event.dateHourToEvent).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(event.dateHourToEvent).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="line-clamp-1">{event.place}</span>
                </div>
              </div>

              <a href={`/events/${event.id}`} className="block mt-4">
                <button className="w-full border border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white px-4 py-2 cursor-pointer rounded">
                  View Event
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
