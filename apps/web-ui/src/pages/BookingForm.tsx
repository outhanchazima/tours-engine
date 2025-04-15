import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookingDetails, Tour } from '../types';

const stripePromise = loadStripe('pk_test_51Q9C2fATe0aJYKUIyKsNbDTjYtI7EZgLZIBtJrM4fis4Io5itC10bBiWZsprtM0ZvCZ4fn8UU2XSieBleIcudg3V00i3Iiwxd1');

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Something went wrong');
      setProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      navigate('/payment-success');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <div className="text-red-600">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

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
  const [clientSecret, setClientSecret] = useState<string>('');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await fetch(`/api/tours/${tourId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch tour details');
        const data = await response.json();
        setTour(data);
        setBookingDetails(prev => ({
          ...prev,
          totalAmount: data.price,
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
  }, [bookingDetails.participants, tour]);

  const handleProceedToPayment = async () => {
    if (!tour) return;
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(bookingDetails),
      });

      if (!response.ok) throw new Error('Booking failed');
      const { clientSecret: secret } = await response.json();
      setClientSecret(secret);
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="w-full h-[50vh] relative bg-gray-900">
        {tour.imageUrls && tour.imageUrls.length > 0 && (
          <>
            <img
              src={tour.imageUrls[selectedImageIdx]}
              alt={`Tour - ${tour.title}`}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{tour.title}</h1>
            <p className="text-xl text-gray-200">${tour.price} per person</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Tour Details Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Image Gallery */}
            {tour.imageUrls && tour.imageUrls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-2">
                {tour.imageUrls.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`flex-shrink-0 transition duration-200 ${
                      idx === selectedImageIdx
                        ? 'ring-2 ring-blue-500 scale-95'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="h-20 w-32 object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Tour Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">About This Tour</h2>
              <p className="text-gray-600 leading-relaxed">{tour.description}</p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold">{tour.duration} hours</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Max Capacity</p>
                  <p className="font-semibold">{tour.capacity || 'Unlimited'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-semibold">${tour.price} per person</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form Column */}
          <div className="md:col-span-1">
            {!clientSecret ? (
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 sticky top-8">
                <h3 className="text-xl font-semibold">Book Your Tour</h3>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Number of Participants
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      min="1"
                      value={bookingDetails.participants}
                      onChange={(e) =>
                        setBookingDetails({
                          ...bookingDetails,
                          participants: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Special Requirements
                  </label>
                  <div className="mt-2">
                    <textarea
                      value={bookingDetails.specialRequirements}
                      onChange={(e) =>
                        setBookingDetails({
                          ...bookingDetails,
                          specialRequirements: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                      placeholder="Any special requests?"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per person</span>
                    <span className="font-medium">${tour.price}</span>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-medium">×{bookingDetails.participants}</span>
                  </div>
                  <div className="flex justify-between mt-4 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">${bookingDetails.totalAmount}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl text-base font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm clientSecret={clientSecret} />
                </Elements>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;