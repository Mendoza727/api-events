import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function EventFormComponent({ initialData = null, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    place: initialData?.place || "",
    total_tickets: initialData?.total_tickets || "",
    available_tickets: initialData?.total_tickets || "",
    ticket_price: initialData?.ticket_price || "",
    dateHourToEvent: initialData?.dateHourToEvent || "",
    is_active: initialData?.is_active || true, // Asegúrate de que también se tome este campo
  })

  // Función para manejar los cambios de los inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    console.log("Changing", name, value)  // Agregado para debugging
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, is_active: checked }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificar que se están tomando los valores correctamente
    console.log("Submitting form data", formData);

    // Validar campos necesarios
    if (!formData.name || !formData.place || !formData.dateHourToEvent) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Asegurarse de que los valores de tickets sean números válidos
    const totalTickets = Number.parseInt(formData.total_tickets);
    const availableTickets = Number.parseInt(initialData ? formData.available_tickets : formData.total_tickets);

    if (isNaN(totalTickets) || isNaN(availableTickets)) {
      alert('La cantidad de boletos debe ser un número válido.');
      return;
    }

    // Enviar los datos correctamente estructurados
    onSubmit({
      name: formData.name,
      place: formData.place,
      total_tickets: totalTickets,
      available_tickets: availableTickets,
      ticket_price: Number.parseFloat(formData.ticket_price),
      dateHourToEvent: formData.dateHourToEvent,
      is_active: formData.is_active,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="name" className="mb-2 block">Event Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter event name"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="place" className="mb-2 block">Place</Label>
          <Input
            id="place"
            name="place"
            value={formData.place}
            onChange={handleChange}
            placeholder="Event location"
            required
          />
        </div>

        <div>
          <Label htmlFor="dateHourToEvent" className="mb-2 block">Date & Time</Label>
          <Input
            id="dateHourToEvent"
            name="dateHourToEvent"
            type="datetime-local"  // Cambié el tipo aquí a datetime-local
            value={formData.dateHourToEvent}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="total_tickets" className="mb-2 block">Total Tickets</Label>
          <Input
            id="total_tickets"
            name="total_tickets"
            type="number"
            min="1"
            value={formData.total_tickets}
            onChange={handleChange}
            placeholder="Total number of tickets"
            required
          />
        </div>

        <div>
          <Label htmlFor="ticket_price" className="mb-2 block">Ticket Price ($)</Label>
          <Input
            id="ticket_price"
            name="ticket_price"
            type="number"
            min="0"
            step="0.01"
            value={formData.ticket_price}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>

        {initialData && (
          <div className="flex items-center space-x-2">
            <Switch id="is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="is_active">Active Event</Label>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" className="bg-purple-700 hover:bg-purple-800" disabled={loading}>
          {loading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              {initialData ? "Updating..." : "Creating..."}
            </>
          ) : initialData ? (
            "Update Event"
          ) : (
            "Create Event"
          )}
        </Button>
      </div>
    </form>
  )
}

// Button Component
const Button = ({ children, onClick, type = "button", className, disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-6 py-3 rounded-md text-white font-semibold ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={disabled}
  >
    {children}
  </button>
);

// Input Component
const Input = ({ value, onChange, placeholder, type = "text", name, required = false }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
  />
);

// Label Component
const Label = ({ htmlFor, children, className }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </label>
);

// Switch Component
const Switch = ({ checked, onCheckedChange }) => (
  <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} />
);
