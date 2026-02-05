"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPublishedEvents, createReservation } from "@/lib/api";
import { Event } from "@/types";
import EventCard from "@/components/EventCard";

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getPublishedEvents();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (eventId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setReserving(true);
    try {
      await createReservation(eventId, token);
      alert("Reservation created successfully!");
      router.push("/dashboard");
    } catch (err) {
      alert(
        "Failed to create reservation. Event may be full or you already have a reservation.",
      );
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">Available Events</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            No events available at the moment
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onReserve={handleReserve} />
          ))}
        </div>
      )}

      {reserving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-lg">Creating reservation...</p>
          </div>
        </div>
      )}
    </div>
  );
}
