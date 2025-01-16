import { useState, useEffect, useRef } from 'react';

const AutoFlowCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const banners = [
    { src: '/img/banners/sb1.png', link: 'https://t.me/markmelly' },
    { src: '/img/banners/sb2.png', link: 'https://cryptovotelist.com' },
    { src: '/img/banners/sb3.png', link: 'https://t.me/MasterMalerts' },
    { src: '/img/banners/sb4.png', link: 'https://www.melegaswap.finance/apply' },
  ];

  const carouselRef = useRef(null);
  const bannersLength = banners.length;
  const totalSlides = banners.length * 2; // We are showing banners twice for continuous scrolling

  // Automatic carousel movement
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannersLength);
      }, 3000); // Move every 3 seconds
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  // Pause carousel on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Handling infinite loop by resetting translateX when needed
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      const totalWidth = carousel.scrollWidth / 2; // width of the full carousel
      const slideWidth = carousel.children[0].offsetWidth; // width of each banner
      if (currentSlide === bannersLength) {
        // Reset the carousel to the first slide smoothly
        carousel.style.transition = 'none';
        setTimeout(() => {
          carousel.style.transition = 'transform 1s ease';
          carousel.style.transform = `translateX(0)`;
        }, 50);
        setCurrentSlide(0);
      } else {
        carousel.style.transform = `translateX(-${(currentSlide * slideWidth)}px)`;
      }
    }
  }, [currentSlide, bannersLength]);

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Content */}
      <div
        ref={carouselRef}
        className="flex w-max transition-transform duration-1000"
        style={{
          whiteSpace: 'nowrap',
          transform: `translateX(-${(currentSlide * 100) / totalSlides}%)`,
        }}
      >
        {banners.map((banner, index) => (
          <div
            key={index}
            className="flex-shrink-0 pt-12"
            style={{ width: `${100 / totalSlides}%` }}
          >
            <a href={banner.link} target="_blank" rel="noopener noreferrer">
              <img
                src={banner.src}
                alt={`Banner ${index + 1}`}
                className="h-[200px] w-full object-cover"
              />
            </a>
          </div>
        ))}
        {/* Cloning banners */}
        {banners.map((banner, index) => (
          <div
            key={index + banners.length}
            className="flex-shrink-0 pt-12"
            style={{ width: `${100 / totalSlides}%` }}
          >
            <a href={banner.link} target="_blank" rel="noopener noreferrer">
              <img
                src={banner.src}
                alt={`Banner ${index + banners.length + 1}`}
                className="h-[200px] w-full object-cover"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide % banners.length ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default AutoFlowCarousel;
