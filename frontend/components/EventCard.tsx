import { Event } from "@/types";
import Button from "./Button";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

type EventCardProps = {
  event: Event;
  onReserve?: (eventId: string) => void;
  showReserveButton?: boolean;
};

export default function EventCard({
  event,
  onReserve,
  showReserveButton = true,
}: EventCardProps) {
  const availableSeats = event.capacity - event.reservedSeats;
  const isFull = availableSeats <= 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
      <p className="text-gray-600 mb-4">{event.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-700">
          <FaCalendarAlt className="mr-2 text-blue-600" />
          <span>{formatDate(event.date)}</span>
        </div>

        <div className="flex items-center text-gray-700">
          <FaMapMarkerAlt className="mr-2 text-blue-600" />
          <span>{event.location}</span>
        </div>

        <div className="flex items-center text-gray-700">
          <FaUsers className="mr-2 text-blue-600" />
          <span>
            {availableSeats} / {event.capacity} seats available
          </span>
        </div>
      </div>

      {showReserveButton && (
        <Button
          onClick={() => onReserve && onReserve(event.id)}
          disabled={isFull}
        >
          {isFull ? "Sold Out" : "Reserve Now"}
        </Button>
      )}
    </div>
  );
}
