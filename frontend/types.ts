export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  reservedSeats: number;
  status: string;
};