import Link from "next/link";
import Button from "./Button";
import {
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaRocket,
} from "react-icons/fa";

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500 bg-opacity-30 rounded-full px-4 py-2 mb-6">
              <FaStar className="text-yellow-300" />
              <span className="text-sm font-medium">
                Event Management Made Easy
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Next Event
              <span className="block text-yellow-300">Starts Here</span>
            </h1>

            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Book workshops, conferences, and training sessions with ease. Join
              thousands of participants discovering amazing events.
            </p>

            <div className="flex gap-4">
              <Link href="/events">
                <Button>
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt />
                    Browse Events
                  </span>
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary">Get Started Free</Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold flex items-center justify-center gap-2">
                  <FaCalendarAlt className="text-yellow-300" />
                  500+
                </div>
                <div className="text-blue-200 text-sm mt-1">Events Hosted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold flex items-center justify-center gap-2">
                  <FaUsers className="text-yellow-300" />
                  10K+
                </div>
                <div className="text-blue-200 text-sm mt-1">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold flex items-center justify-center gap-2">
                  <FaMapMarkerAlt className="text-yellow-300" />
                  50+
                </div>
                <div className="text-blue-200 text-sm mt-1">Cities</div>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="space-y-4">
              <div className="bg-blue-500 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded-xl p-3">
                    <FaRocket className="text-3xl text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      React Workshop
                    </h3>
                    <p className="text-blue-100">March 15, 2026 • Casablanca</p>
                    <div className="flex items-center gap-1 mt-1">
                      <FaUsers className="text-sm text-blue-200" />
                      <span className="text-sm text-blue-200">
                        25 seats left
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-500 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded-xl p-3">
                    <FaHeart className="text-3xl text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      Tech Conference
                    </h3>
                    <p className="text-purple-100">April 20, 2026 • Rabat</p>
                    <div className="flex items-center gap-1 mt-1">
                      <FaUsers className="text-sm text-purple-200" />
                      <span className="text-sm text-purple-200">
                        50 seats left
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-pink-500 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded-xl p-3">
                    <FaStar className="text-3xl text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      Design Summit
                    </h3>
                    <p className="text-pink-100">May 10, 2026 • Marrakech</p>
                    <div className="flex items-center gap-1 mt-1">
                      <FaUsers className="text-sm text-pink-200" />
                      <span className="text-sm text-pink-200">
                        30 seats left
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
