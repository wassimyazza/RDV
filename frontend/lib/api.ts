const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      role: "PARTICIPANT",
    }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
}

export async function getPublishedEvents() {
  const response = await fetch(`${API_URL}/events/published`);

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

export async function getMyReservations(token: string) {
  const response = await fetch(`${API_URL}/reservations/my-reservations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reservations");
  }

  return response.json();
}

export async function createReservation(eventId: string, token: string) {
  const response = await fetch(`${API_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ eventId }),
  });

  if (!response.ok) {
    throw new Error("Failed to create reservation");
  }

  return response.json();
}

export async function downloadTicket(reservationId: string, token: string) {
  const response = await fetch(
    `${API_URL}/reservations/${reservationId}/download-ticket`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to download ticket");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ticket-${reservationId}.pdf`;
  a.click();
}

export async function getStatistics(token: string) {
  const response = await fetch(`${API_URL}/statistics/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch statistics");
  }

  return response.json();
}

export async function getAllEvents(token: string) {
  const response = await fetch(`${API_URL}/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

export async function createEvent(eventData: any, token: string) {
  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Failed to create event");
  }

  return response.json();
}

export async function publishEvent(eventId: string, token: string) {
  const response = await fetch(`${API_URL}/events/${eventId}/publish`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to publish event");
  }

  return response.json();
}

export async function cancelEvent(eventId: string, token: string) {
  const response = await fetch(`${API_URL}/events/${eventId}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to cancel event");
  }

  return response.json();
}

export async function getAllReservations(token: string) {
  const response = await fetch(`${API_URL}/reservations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reservations");
  }

  return response.json();
}

export async function confirmReservation(reservationId: string, token: string) {
  const response = await fetch(
    `${API_URL}/reservations/${reservationId}/confirm`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to confirm reservation");
  }

  return response.json();
}

export async function refuseReservation(reservationId: string, token: string) {
  const response = await fetch(
    `${API_URL}/reservations/${reservationId}/refuse`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to refuse reservation");
  }

  return response.json();
}
