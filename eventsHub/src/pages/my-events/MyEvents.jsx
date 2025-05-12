import { useState, useEffect } from "react"
import { Edit, Trash2, Plus, Calendar, Users } from "lucide-react"
import Swal from "sweetalert2"
import { EventActions } from "../../actions/events/EventsActions"
import { useNavigate } from 'react-router-dom';

export default function MyEventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { GetAllEvents, DeleteEventById } = EventActions()
  const navigate = useNavigate();  // Usamos useNavigate para la redirección

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await GetAllEvents()
        setEvents(allEvents.data.data)  // Aquí guardamos los eventos recibidos
      } catch (error) {
        console.error("Error fetching events:", error)
        Swal.fire({
          title: "Error!",
          text: "Failed to load your events",
          icon: "error",
          confirmButtonColor: "#6d28d9",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleClick = () => {
    navigate('/events/create');  // Redirige a la ruta deseada
  };

  const handlebyId = (id) => {
    navigate(`/events/${id}`)
  }


  const handleEdit = (id) => {
    navigate(`/event/${id}/edit`); // Navigate to the edit page with the event id
  };


  const handleDelete = (eventId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6d28d9",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await DeleteEventById(eventId)
          setEvents(events.filter((event) => event.id !== eventId))
          Swal.fire({
            title: "Deleted!",
            text: "Your event has been deleted.",
            icon: "success",
            confirmButtonColor: "#6d28d9",
          })
        } catch (error) {
          console.error("Error deleting event:", error)
          Swal.fire({
            title: "Error!",
            text: "Failed to delete event",
            icon: "error",
            confirmButtonColor: "#6d28d9",
          })
        }
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Events</h1>
            <button
              onClick={handleClick}
              className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md flex cursor-pointer items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Event
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">You haven't created any events yet</h2>
              <p className="text-gray-600 mb-6">Start creating your first event now!</p>
              <button className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Create New Event
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={event.image || "https://placehold.co/100x100/purple/white?text=E"}
                              alt={event.name}
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = "https://placehold.co/100x100/purple/white?text=E"
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{event.name}</div>
                            <div className="text-sm text-gray-500">{event.place}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-900">{new Date(event.dateHourToEvent).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${parseFloat(event.ticket_price).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-900">{event.available_tickets} tickets left</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlebyId(event.id)} // Calls the function with the event id
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md cursor-pointer"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleEdit(event.id)} // Pass the event id to the handleEdit function
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="bg-gray-200 hover:bg-gray-300 text-red-600 py-1 px-3 rounded-md cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
