import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Discover Your Dream Home',
    subtitle: 'Explore our exclusive collection of luxury residential properties across the city.',
    link: '/residential',
    buttonText: 'View Residential'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Premium Spaces for Your Business',
    subtitle: 'Find the perfect commercial property to elevate your enterprise to the next level.',
    link: '/commercial',
    buttonText: 'View Commercial'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Invest in the Future',
    subtitle: 'Browse our latest projects and secure your investment in prime real estate.',
    link: '/projects',
    buttonText: 'Explore Projects'
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-slate-900 group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Background Image with Zoom animation */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'
                }`}
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto h-full w-full">
            <div className={`max-w-xl transition-all duration-1000 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl text-slate-200 mb-8 max-w-lg leading-relaxed drop-shadow-md border-l-4 border-blue-500 pl-4">
                {slide.subtitle}
              </p>
              <button
                onClick={() => navigate(slide.link)}
                className="bg-blue-500 text-slate-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-400 transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1"
              >
                {slide.buttonText}
                <HiArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Manual Slide Controls/Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${index === currentSlide
              ? 'w-8 h-2.5 bg-blue-500'
              : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
