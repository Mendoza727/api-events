import { useState } from "react"
import Swal from "sweetalert2"
import EventFormComponent from "../../components/event-form"
import { EventActions } from "../../actions/events/EventsActions"

export default function CreateEventPage() {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (eventData) => {
        setLoading(true);
        try {
            // Estructura correcta de datos sin anidar bajo "name"
            const formattedData = {
                name: eventData.name,  // "name" como un campo directo
                place: eventData.place, // "place" como un campo directo
                total_tickets: parseInt(eventData.total_tickets),
                available_tickets: parseInt(eventData.available_tickets),
                ticket_price: parseFloat(eventData.ticket_price),
                dateHourToEvent: eventData.dateHourToEvent,
                is_active: eventData.is_active ? 1 : 0
            };

            // Usando el hook para obtener las funciones
            const { CreateNewEvent } = EventActions();
            const newEvent = await CreateNewEvent(formattedData);

            if (newEvent.status === 201) {
                Swal.fire({
                    title: "Success!",
                    text: newEvent.data.message,
                    icon: "success",
                    confirmButtonColor: "#6d28d9",
                }).then(() => {
                    // Verifica si newEvent.id existe
                    if (newEvent.data.id) {
                        window.location.href = `/events/${newEvent.data.id}`;
                    } else {
                        console.error("ID del evento no encontrado");
                    }
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: newEvent.details || "Failed to create event",
                    icon: "error",
                    confirmButtonColor: "#6d28d9",
                });
            }
        } catch (error) {
            console.error("Error creating event:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to create event",
                icon: "error",
                confirmButtonColor: "#6d28d9",
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
                    <EventFormComponent onSubmit={handleSubmit} loading={loading} />
                </div>
            </main>
        </div>
    )
}
