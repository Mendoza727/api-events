import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import EventForm from "@/components/event-form"
import { EventActions } from "../../actions/events/EventsActions"

export default function UpdateEventByIdPage() {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const { GetEventById, UpdateEventById } = EventActions()

  const id = typeof window !== "undefined"
    ? window.location.pathname.split("/")[2] || null
    : null

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return // If no id, don't fetch data

      try {
        const response = await GetEventById(id) // Assuming GetEventById is a function that fetches the event details
        setEvent(response.data.data) // Set the event data once fetched
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

    fetchEvent()
  }, [id])

  const handleSubmit = async (eventData) => {
    setSubmitting(true);
    try {
      // Pasamos los datos correctos al actualizar el evento
      await UpdateEventById(id, eventData);
      Swal.fire({
        title: "Success!",
        text: "Event updated successfully!",
        icon: "success",
        confirmButtonColor: "#6d28d9",
      }).then(() => {
        window.location.href = `/events/${id}`
      });
    } catch (error) {
      console.error("Error updating event:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update event",
        icon: "error",
        confirmButtonColor: "#6d28d9",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Edit Event</h1>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
            </div>
          ) : !event ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Event not found</h2>
              <button
                onClick={() => (window.location.href = "/events")}
                className="px-6 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
              >
                Back to Events
              </button>
            </div>
          ) : (
            <EventForm initialData={event} onSubmit={handleSubmit} loading={submitting} />
          )}
        </div>
      </main>
    </div>
  )
}
