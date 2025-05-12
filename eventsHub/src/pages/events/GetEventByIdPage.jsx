import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { useAuth } from "../../context/auth-context"
import { EventActions } from "../../actions/events/EventsActions"
import { Calendar, Clock, MapPin, Users } from "lucide-react"


const Button = ({ onClick, children, className, disabled }) => (
  <button
    onClick={onClick}
    className={`w-full py-3 px-6 text-white rounded-lg ${disabled ? 'bg-gray-400' : 'bg-purple-700 hover:bg-purple-800'} ${className}`}
    disabled={disabled}
  >
    {children}
  </button>
)

export default function GetEventByIdPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const { GetEventById } = EventActions()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Realizamos la petición para obtener el evento por ID
        const response = await GetEventById(id)
        setEvent(response.data.data)
      } catch (error) {
        console.error("Error fetching event:", error)
        Swal.fire({
          title: "Error!",
          text: "Failed to load event details",
          icon: "error",
          confirmButtonColor: "#6d28d9",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchEvent()
    }
  }, [])

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to purchase tickets",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#6d28d9",
        cancelButtonColor: "#d33",
        confirmButtonText: "Log in",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/login?redirect=/eventos/${id}`)
        }
      })
      return
    }

    try {
      await purchaseEvent(event.id)
      Swal.fire({
        title: "Success!",
        text: "You have successfully purchased tickets for this event!",
        icon: "success",
        confirmButtonColor: "#6d28d9",
      }).then(() => {
        GetEventById(id).then(({ data }) => setEvent(data))
      })
    } catch (error) {
      console.error("Error purchasing event:", error)
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to purchase tickets",
        icon: "error",
        confirmButtonColor: "#6d28d9",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Button onClick={() => navigate("/eventos")}>Back to Events</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src={event.image || "https://placehold.co/800x400/purple/white?text=" + event.name}
                alt={event.name}
                className="w-full h-[400px] object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "https://placehold.co/800x400/purple/white?text" + event.name
                }}
              />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.name}</h1>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{new Date(event.dateHourToEvent).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{event.place}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                <span>{event.available_tickets} tickets available</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="text-3xl font-bold mb-4">
                ${event?.ticket_price && !isNaN(event.ticket_price) ? Number(event.ticket_price).toFixed(2) : 'N/A'}
              </div>



              <Button
                onClick={handlePurchase}
                className="w-full bg-purple-700 hover:bg-purple-800 mb-4"
                disabled={event.available_tickets <= 0}
              >
                {event.available_tickets > 0 ? "Purchase Tickets" : "Sold Out"}
              </Button>

              <div className="text-sm text-gray-500 mb-4">
                {event.available_tickets > 0
                  ? `Only ${event.available_tickets} tickets remaining!`
                  : "This event is sold out."}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Event Details</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Total Tickets:</span>
                    <span className="font-medium">{event.available_tickets}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
