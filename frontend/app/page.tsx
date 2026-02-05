import Hero from "@/components/Hero";
import Link from "next/link";
import { FaRocket, FaShieldAlt, FaBolt, FaHeart } from "react-icons/fa";

export default function HomePage() {
  return (
    <div>
      <Hero />

      <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose RDV?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            The all-in-one platform for event management and seamless bookings
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group hover:scale-105 transition-transform">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 h-full border-2 border-transparent group-hover:border-blue-300">
              <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaRocket className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quick Setup</h3>
              <p className="text-gray-700">
                Get started in minutes. No complicated setup required.
              </p>
            </div>
          </div>

          <div className="group hover:scale-105 transition-transform">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 h-full border-2 border-transparent group-hover:border-purple-300">
              <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaShieldAlt className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Booking</h3>
              <p className="text-gray-700">
                Your data is protected with enterprise-grade security.
              </p>
            </div>
          </div>

          <div className="group hover:scale-105 transition-transform">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 h-full border-2 border-transparent group-hover:border-yellow-300">
              <div className="bg-yellow-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaBolt className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Tickets</h3>
              <p className="text-gray-700">
                Download PDF tickets immediately after confirmation.
              </p>
            </div>
          </div>

          <div className="group hover:scale-105 transition-transform">
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 h-full border-2 border-transparent group-hover:border-pink-300">
              <div className="bg-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaHeart className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">User Friendly</h3>
              <p className="text-gray-700">
                Intuitive interface designed for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community and start booking events today!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              href="/events"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
