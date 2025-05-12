import { GestorApi } from "../../config/api/GestorApi";
import Cookies from "js-cookie"; // Asegúrate de tener la librería 'js-cookie' instalada

const eventApi = "eventos/"; // Definimos la URL base para evitar repetición

// Función auxiliar para obtener los headers con el token
const getAuthHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("token")}`
});

export const EventActions = () => {

    // Crear un evento
    const CreateNewEvent = async (
        formdata
    ) => {
        console.log(formdata)
        try {
            const eventData = {
                name: formdata.name,
                place: formdata.place,
                total_tickets: parseInt(formdata.total_tickets, 10),    // Convertimos a entero
                available_tickets: parseInt(formdata.available_tickets, 10),  // Convertimos a entero
                ticket_price: parseFloat(formdata.ticket_price),  // Convertimos a decimal
                dateHourToEvent: formdata.dateHourToEvent, // Aseguramos que esté en el formato correcto
            };


            // Realizamos la solicitud POST al API
            const { data, status } = await GestorApi.post(eventApi, eventData, {
                headers: getAuthHeaders() // Usamos la función auxiliar para los headers
            });

            return {
                data,
                status
            };
        } catch (error) {
            const mensaje = error.response?.data?.error || "Ocurrió un error";
            return {
                data: { error: mensaje },
                status: error.response?.status || 500
            };
        }
    };


    // Obtener todos los eventos
    const GetAllEvents = async () => {
        try {
            const { data, status } = await GestorApi.get(eventApi, {
                headers: getAuthHeaders() // Usamos la función auxiliar para los headers
            });

            return {
                data,
                status
            }
        } catch (error) {
            const mensaje = error.response?.data?.error || "Ocurrió un error";
            return {
                data: { error: mensaje },
                status: error.response?.status || 500
            };
        }
    }

    // Obtener un evento por ID
    const GetEventById = async (id) => {
        try {
            const { data, status } = await GestorApi.get(`${eventApi}${id}/`, {
                headers: getAuthHeaders() // Usamos la función auxiliar para los headers
            });

            return {
                data,
                status
            };
        } catch (error) {
            const mensaje = error.response?.data?.error || "Ocurrió un error";
            return {
                data: { error: mensaje },
                status: error.response?.status || 500
            };
        }
    }

    // actualizar un evento por ID
    const UpdateEventById = async (id) => {
        try {
            const { data, status } = await GestorApi.patch(`${eventApi}${id}/`, {}, {
                headers: getAuthHeaders() // Usamos la función auxiliar para los headers
            });

            return {
                data,
                status
            };
        } catch (error) {
            const mensaje = error.response?.data?.error || "Ocurrió un error";
            return {
                data: { error: mensaje },
                status: error.response?.status || 500
            };
        }
    }

    // eliminamos un evento por el id
    const DeleteEventById = async (id) => {
        try {
            // Eliminamos el cuerpo de la solicitud (no es necesario en DELETE)
            const { data, status } = await GestorApi.delete(`${eventApi}${id}/`, {
                headers: getAuthHeaders() // Usamos la función auxiliar para los headers
            });

            return {
                data,
                status
            };
        } catch (error) {
            const mensaje = error.response?.data?.error || "Ocurrió un error";
            return {
                data: { error: mensaje },
                status: error.response?.status || 500
            };
        }
    }

    return {
        CreateNewEvent,
        GetAllEvents,
        GetEventById,
        DeleteEventById,
        UpdateEventById
    };
};
