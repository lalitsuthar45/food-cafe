import { Award, Heart, Users, Clock } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Only the finest ingredients from trusted local suppliers',
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every dish is crafted with passion and attention to detail',
    },
    {
      icon: Users,
      title: 'Expert Chefs',
      description: 'Our team brings decades of culinary expertise',
    },
    {
      icon: Clock,
      title: 'Always Fresh',
      description: 'Prepared fresh daily to ensure the best taste',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-amber-600">Savory Haven</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Since 2009, Savory Haven has been delighting food lovers with our unique blend of
              traditional recipes and modern culinary techniques. Our passion for excellence drives
              us to source the freshest ingredients and create unforgettable dining experiences.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Whether you're joining us for a casual lunch, romantic dinner, or special celebration,
              our dedicated team is committed to making every visit memorable. We believe that great
              food brings people together, and we're honored to be part of your special moments.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white px-6 py-4 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-amber-600">15+</div>
                <div className="text-gray-600">Years Serving</div>
              </div>
              <div className="bg-white px-6 py-4 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-amber-600">25+</div>
                <div className="text-gray-600">Expert Chefs</div>
              </div>
              <div className="bg-white px-6 py-4 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-amber-600">100%</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Restaurant interior"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-xl shadow-xl">
              <div className="text-4xl font-bold text-amber-600">4.9/5</div>
              <div className="text-gray-600">Customer Rating</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="bg-amber-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
