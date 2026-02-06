"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMyReservations, downloadTicket } from "@/lib/api";
import Button from "@/components/Button";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDownload,
  FaTicketAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

type Reservation = {
  id: string;
  status: string;
  createdAt: string;
  event: {
    title: string;
    description: string;
    date: string;
    location: string;
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    loadReservations(token);
  }, [router]);

  const loadReservations = async (token: string) => {
    try {
      const data = await getMyReservations(token);
      setReservations(data);
    } catch (err) {
      setError("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = async (reservationId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await downloadTicket(reservationId, token);
    } catch (err) {
      alert(
        "Failed to download ticket. Make sure your reservation is confirmed.",
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "REFUSED":
        return "bg-red-100 text-red-800 border-red-300";
      case "CANCELED":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <FaCheckCircle className="text-green-600" />;
      case "PENDING":
        return <FaClock className="text-yellow-600" />;
      default:
        return <FaTicketAlt className="text-gray-600" />;
    }
  };

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter((r) => r.status === "CONFIRMED").length,
    pending: reservations.filter((r) => r.status === "PENDING").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Manage your event reservations and download tickets
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Reservations
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <FaTicketAlt className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Confirmed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.confirmed}
                </p>
              </div>
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Reservations</h2>
          <Button onClick={() => router.push("/events")}>
            <span className="flex items-center gap-2">
              <FaTicketAlt />
              Browse Events
            </span>
          </Button>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTicketAlt className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No reservations yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring and book your first event!
            </p>
            <Button onClick={() => router.push("/events")}>
              Browse Events
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {reservation.event.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(reservation.status)}`}
                        >
                          {getStatusIcon(reservation.status)}
                          {reservation.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {reservation.event.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                        <FaCalendarAlt className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date & Time</p>
                        <p className="font-medium">
                          {new Date(reservation.event.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center">
                        <FaMapMarkerAlt className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium">
                          {reservation.event.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {reservation.status === "CONFIRMED" && (
                    <Button
                      onClick={() => handleDownloadTicket(reservation.id)}
                      variant="secondary"
                    >
                      <span className="flex items-center gap-2">
                        <FaDownload />
                        Download Ticket (PDF)
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
