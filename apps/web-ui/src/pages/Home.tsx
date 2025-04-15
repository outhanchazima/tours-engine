import { AlertCircle, Compass } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tour } from '../types';

const Home = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/tours?page=1&limit=10&sortBy=createdAt', {
          headers: {
            'Content-Type': 'application/json',
            ...(user && user.token && { 'Authorization': `Bearer ${user.token}` }),
          },
        });
        if (!response.ok) throw new Error('Failed to fetch tours');
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setTours(data.data);
        } else if (data.tours && Array.isArray(data.tours)) {
          setTours(data.tours);
        } else {
          setTours([]);
          setError('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
        setError('Unable to load tours at the moment');
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [user?.token]);

  const handleBookNow = (tourId: string) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/booking/${tourId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing destinations...</p>
        </div>
      </div>
    );
  }

  if (error || tours.length === 0) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
          {error ? (
            <>
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-6">
                We're having trouble loading the tours right now. Please try again later.
              </p>
            </>
          ) : (
            <>
              <Compass className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Tours Available</h2>
              <p className="text-gray-600 mb-6">
                We're currently updating our tour catalog. Please check back soon for exciting new destinations!
              </p>
            </>
          )}
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-200">
          <img
            src={tour.imageUrls[0]}
            alt={tour.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2 text-gray-800">{tour.name}</h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{tour.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">${tour.price}</p>
                <p className="text-gray-500">{tour.duration} days</p>
              </div>
              <button
                onClick={() => handleBookNow(tour.id)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-200"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;