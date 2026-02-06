"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getStatistics,
  getAllEvents,
  createEvent,
  publishEvent,
  cancelEvent,
  getAllReservations,
  confirmReservation,
  refuseReservation,
} from "@/lib/api";
import Button from "@/components/Button";
import CreateEventModal from "@/components/CreateEventModal";
import {
  FaCalendarAlt,
  FaChartBar,
  FaTicketAlt,
  FaPlus,
  FaCheck,
  FaTimes,
  FaUsers,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

type Stats = {
  upcomingEvents: {
    total: number;
  };
  fillRate: {
    fillRate: number;
    totalCapacity: number;
    totalReserved: number;
  };
  reservationsByStatus: {
    total: number;
    pending: number;
    confirmed: number;
    refused: number;
    canceled: number;
  };
};

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"events" | "reservations">(
    "events",
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    loadData(token);
  }, [router]);

  const loadData = async (token: string) => {
    try {
      const [statsData, eventsData, reservationsData] = await Promise.all([
        getStatistics(token),
        getAllEvents(token),
        getAllReservations(token),
      ]);

      setStats(statsData);
      setEvents(eventsData);
      setReservations(reservationsData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await createEvent(eventData, token);
      setShowCreateModal(false);
      loadData(token);
      alert("Event created successfully!");
    } catch (err) {
      alert("Failed to create event");
    }
  };

  const handlePublishEvent = async (eventId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await publishEvent(eventId, token);
      loadData(token);
      alert("Event published successfully!");
    } catch (err) {
      alert("Failed to publish event");
    }
  };

  const handleCancelEvent = async (eventId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Are you sure you want to cancel this event?")) return;

    try {
      await cancelEvent(eventId, token);
      loadData(token);
      alert("Event canceled successfully!");
    } catch (err) {
      alert("Failed to cancel event");
    }
  };

  const handleConfirmReservation = async (reservationId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await confirmReservation(reservationId, token);
      loadData(token);
      alert("Reservation confirmed!");
    } catch (err) {
      alert("Failed to confirm reservation");
    }
  };

  const handleRefuseReservation = async (reservationId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Are you sure you want to refuse this reservation?")) return;

    try {
      await refuseReservation(reservationId, token);
      loadData(token);
      alert("Reservation refused!");
    } catch (err) {
      alert("Failed to refuse reservation");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELED":
        return "bg-red-100 text-red-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REFUSED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100 text-lg">
            Manage events and reservations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Upcoming Events
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.upcomingEvents.total}
                  </p>
                </div>
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Fill Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.fillRate.fillRate.toFixed(0)}%
                  </p>
                </div>
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <FaChartBar className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.reservationsByStatus.pending}
                  </p>
                </div>
                <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <FaClock className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Reservations
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.reservationsByStatus.total}
                  </p>
                </div>
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <FaTicketAlt className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("events")}
                className={`px-6 py-4 font-medium ${
                  activeTab === "events"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Events Management
              </button>
              <button
                onClick={() => setActiveTab("reservations")}
                className={`px-6 py-4 font-medium ${
                  activeTab === "reservations"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Reservations Management
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "events" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">All Events</h2>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <span className="flex items-center gap-2">
                      <FaPlus />
                      Create Event
                    </span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{event.title}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                event.status,
                              )}`}
                            >
                              {event.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-700">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="text-blue-600" />
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaUsers className="text-purple-600" />
                              {event.reservedSeats}/{event.capacity}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {event.status === "DRAFT" && (
                            <Button
                              onClick={() => handlePublishEvent(event.id)}
                              variant="secondary"
                            >
                              <span className="flex items-center gap-2">
                                <FaCheck />
                                Publish
                              </span>
                            </Button>
                          )}
                          {event.status !== "CANCELED" && (
                            <Button
                              onClick={() => handleCancelEvent(event.id)}
                              variant="secondary"
                            >
                              <span className="flex items-center gap-2">
                                <FaTimes />
                                Cancel
                              </span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reservations" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">All Reservations</h2>

                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold">
                              {reservation.event?.title}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                reservation.status,
                              )}`}
                            >
                              {reservation.status}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            Participant: {reservation.user?.firstName}{" "}
                            {reservation.user?.lastName}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Email: {reservation.user?.email}
                          </p>
                        </div>
                        {reservation.status === "PENDING" && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                handleConfirmReservation(reservation.id)
                              }
                              variant="secondary"
                            >
                              <span className="flex items-center gap-2">
                                <FaCheckCircle className="text-green-600" />
                                Confirm
                              </span>
                            </Button>
                            <Button
                              onClick={() =>
                                handleRefuseReservation(reservation.id)
                              }
                              variant="secondary"
                            >
                              <span className="flex items-center gap-2">
                                <FaTimes className="text-red-600" />
                                Refuse
                              </span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
}
