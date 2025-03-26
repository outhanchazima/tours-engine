import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookingDetails, Tour } from '../types';

const stripePromise = loadStripe('pk_test_51Q9C2fATe0aJYKUIyKsNbDTjYtI7EZgLZIBtJrM4fis4Io5itC10bBiWZsprtM0ZvCZ4fn8UU2XSieBleIcudg3V00i3Iiwxd1');

const BookingForm = () => {
  const { tourId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    tourId: tourId || '',
    participants: 1,
    specialRequirements: '',
  });

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/tours/${tourId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch tour details');
        const data = await response.json();
        setTour(data);
        setBookingDetails(prev => ({
          ...prev,
        }));
      } catch (error) {
        console.error('Error fetching tour details:', error);
        navigate('/');
      }
    };

    if (tourId) fetchTourDetails();
  }, [tourId, user?.token, navigate]);

  useEffect(() => {
    if (tour) {
      setBookingDetails(prev => ({
        ...prev,
        totalAmount: tour.price * prev.participants,
      }));
    }
  }, [bookingDetails.participants, tour?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;
    delete bookingDetails.totalAmount;
    try {
      const bookingResponse = await fetch('http://localhost:3000/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(bookingDetails),
      });

      console.log("Bookng Response", bookingResponse);

      if (!bookingResponse.ok) throw new Error('Booking failed');
      const { sessionId } = await bookingResponse.json();

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  if (!tour) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Book {tour.name}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="participants" className="block text-gray-700 mb-2">
            Number of Participants
          </label>
          <input
            type="number"
            id="participants"
            min="1"
            value={bookingDetails.participants}
            onChange={(e) =>
              setBookingDetails({
                ...bookingDetails,
                participants: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="specialRequirements" className="block text-gray-700 mb-2">
            Special Requirements
          </label>
          <textarea
            id="specialRequirements"
            value={bookingDetails.specialRequirements}
            onChange={(e) =>
              setBookingDetails({
                ...bookingDetails,
                specialRequirements: e.target.value,
              })
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          />
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
          <p>Tour: {tour.name}</p>
          <p>Price per person: ${tour.price}</p>
          <p className="text-xl font-bold mt-2">
            Total: ${bookingDetails.totalAmount}
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default BookingForm;