import { useState } from "react";
import { Facebook, Instagram } from "lucide-react";

type GalleryImage = {
  url: string;
  alt: string;
};

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const images: GalleryImage[] = [
    {
      url: "https://i.pinimg.com/1200x/48/98/3e/48983e3d343694dd9b780b9651e8793d.jpg",
      alt: "Restaurant",
    },
    {
      url: "https://i.pinimg.com/736x/56/43/33/5643333d786a162edbe13d069f24e78d.jpg",
      alt: "Menu",
    },
    {
      url: "https://i.pinimg.com/1200x/c7/7a/45/c77a45e2c2a22dff89c28ab800dcee6c.jpg",
      alt: "Table",
    },
    {
      url: "https://i.pinimg.com/1200x/c6/c0/6c/c6c06cefc361e1cabf992516ff2840c2.jpg",
      alt: "Kitchen",
    },
    {
      url: "https://i.pinimg.com/736x/90/b8/e2/90b8e2092a439e79a8644dfcf56089ca.jpg",
      alt: "Service Review",
    },
    {
      url: "https://i.pinimg.com/736x/88/26/28/8826280cf0007953ea7c98ed0ccf9718.jpg",
      alt: "Counter",
    },
    {
      url: "https://i.pinimg.com/736x/dd/e9/74/dde974f310de20710e8c4d58d677f267.jpg",
      alt: "Lights",
    },
    {
      url: "https://i.pinimg.com/736x/67/47/22/67472213c9148b004c162a22629c5805.jpg",
      alt: "Staff",
    },
  ];

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gallery
          </h2>
          <p className="text-xl text-gray-600">
            A glimpse of our restaurant atmosphere
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(image)}
              className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer aspect-square"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-semibold">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Share Your Experience</h3>

          <p className="text-lg mb-6">
            Tag us on social media and share your favorite moments
          </p>

          <div className="flex justify-center gap-6">
            <a
              href="https://www.instagram.com/savoryhaven"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-semibold hover:text-pink-500 transition duration-300"
            >
              #SavoryHaven
            </a>

            <a
              href="https://www.facebook.com/savoryhaven"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-semibold hover:text-blue-600 transition duration-300"
            >
              @savoryhaven
            </a>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-6 text-gray-700 text-3xl font-bold z-20"
            >
              ✕
            </button>

            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 bg-black flex items-center justify-center p-6">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  className="max-h-[70vh] w-full object-contain rounded-xl"
                />
              </div>

              <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-4 text-gray-900">
                  {selectedImage.alt}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                  Experience the charm and elegance of our restaurant ambiance.
                  Every corner is thoughtfully designed to create a warm,
                  welcoming, and unforgettable dining atmosphere.
                </p>

                <div className="flex gap-6 items-center">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full text-white transition"
                  >
                    <Facebook size={20} />
                  </a>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-3 rounded-full text-white transition"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}