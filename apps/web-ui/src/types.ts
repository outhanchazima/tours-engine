export interface Tour {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

export interface User {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  token: string;
}

export interface Transaction {
  id: string;
  tourId: string;
  amount: number;
  status: 'completed' | 'failed';
  date: string;
}

export interface BookingDetails {
  tourId: string;
  participants: number;
  specialRequirements?: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}
