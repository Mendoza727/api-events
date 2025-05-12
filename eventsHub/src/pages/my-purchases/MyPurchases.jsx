import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Calendar, Clock, MapPin } from "lucide-react"

// Simula una función de API
const getUserPurchases = async () => {
  // Aquí deberías reemplazar esto con una llamada real
  return [
    {
      id: 1,
      amount: 49.99,
      purchaseDate: "2024-08-10T12:00:00Z",
      event: {
        id: 101,
        name: "Sample Event",
        image: "",
        date: "2024-09-15",
        time: "18:00",
        place: "Main Hall",
      },
    },
  ]
}

export default function MyPurchasesPage() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await getUserPurchases()
        setPurchases(data)
      } catch (error) {
        console.error("Error fetching purchases:", error)
        Swal.fire({
          title: "Error!",
          text: "Failed to load your purchases",
          icon: "error",
          confirmButtonColor: "#6d28d9",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Purchases</h1>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
            </div>
          ) : purchases.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">You haven't purchased any tickets yet</h2>
              <p className="text-gray-600 mb-6">Browse our events and find something you'll love!</p>
              <a href="/events" className="inline-block bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800">
                Browse Events
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={purchase.event.image || "https://placehold.co/600x400/purple/white?text=Event"}
                      alt={purchase.event.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "https://placehold.co/600x400/purple/white?text=Event"
                      }}
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{purchase.event.name}</h3>

                    <div className="flex flex-col gap-2 mb-4 text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(purchase.event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{purchase.event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{purchase.event.place}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold">${purchase.amount.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </div>
                    </div>

                    <a href={`/events/${purchase.event.id}`} className="block mt-4">
                      <button className="w-full border border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white px-4 py-2 rounded">
                        View Event
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
