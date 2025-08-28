import React from 'react';
import { Star, Users, MapPin, Award, Shield, Clock, Heart, Globe } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: "10M+", label: "Happy Guests", icon: Users },
    { number: "50K+", label: "Premium Hotels", icon: MapPin },
    { number: "200+", label: "Countries", icon: Globe },
    { number: "4.9", label: "Average Rating", icon: Star }
  ];

  const values = [
    {
      icon: Heart,
      title: "Exceptional Service",
      description: "We believe every guest deserves personalized attention and world-class service that exceeds expectations."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Your security and peace of mind are our top priorities. We ensure verified properties and secure transactions."
    },
    {
      icon: Award,
      title: "Luxury Standards",
      description: "We curate only the finest accommodations that meet our rigorous standards for luxury and comfort."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our dedicated team is available around the clock to assist you with any questions or concerns."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=300&h=300&fit=crop&crop=face",
      description: "Former hospitality executive with 15+ years in luxury travel"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Tech innovator passionate about creating seamless booking experiences"
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Hospitality expert ensuring every stay meets our luxury standards"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3')] bg-cover bg-center opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Redefining Luxury
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Hospitality
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              At PlaceStay, we connect discerning travelers with the world's most exceptional 
              accommodations, creating unforgettable experiences that inspire and delight.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Founded in 2018 by a team of hospitality veterans and technology innovators, 
                  PlaceStay was born from a simple yet powerful vision: to make luxury travel 
                  accessible to everyone while maintaining the highest standards of service and quality.
                </p>
                <p>
                  What started as a passion project has grown into a global platform trusted by 
                  millions of travelers worldwide. We've partnered with boutique hotels, luxury 
                  resorts, and unique accommodations in over 200 countries, each carefully vetted 
                  to ensure they meet our exacting standards.
                </p>
                <p>
                  Today, PlaceStay continues to innovate, leveraging cutting-edge technology to 
                  create seamless booking experiences while never losing sight of the personal 
                  touch that makes travel truly memorable.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Luxury hotel interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              What Drives Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values shape everything we do, from the partnerships we forge 
              to the experiences we create for our guests.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group hover:bg-gray-50 p-6 rounded-2xl transition-all duration-300">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Leadership
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The visionaries and innovators behind PlaceStay's mission to transform luxury travel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 w-32 h-32 rounded-full mx-auto bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-lg text-purple-600 font-semibold mb-4">{member.role}</div>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl lg:text-2xl leading-relaxed text-gray-200">
            "To create a world where luxury travel is not just about beautiful destinations, 
            but about meaningful connections, unforgettable experiences, and the joy of discovery. 
            We exist to turn every journey into a story worth telling."
          </p>
          <div className="mt-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full">
              <Heart className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Ready to Experience PlaceStay?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join millions of travelers who trust us to curate their perfect getaway.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              Start Your Journey
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-purple-600 hover:text-purple-600 transition-colors duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}