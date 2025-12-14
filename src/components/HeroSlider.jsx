import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slides = [
  {
    title: "Discover Life Lessons",
    desc: "Learn from experiences of real people and grow daily.",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80",
   
  },
  {
    title: "Master Your Skills",
    desc: "Step-by-step guidance to implement lessons into life.",
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&auto=format&fit=crop&q=80",
    
  },
  {
    title: "Join the Community",
    desc: "Connect with like-minded learners worldwide.",
    img: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tbXVuaXR5fGVufDB8fDB8fHww",
   
  },
];

const HeroSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    pauseOnHover: true,
    fade: true,
  };

  return (
    <div className="relative w-full overflow-hidden">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative h-[600px] w-full">
            <img
              src={slide.img}
              alt={slide.title}
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6 md:px-12">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg animate-fade-in">
                {slide.title}
              </h2>
              <p className="text-lg md:text-2xl max-w-2xl mb-6 drop-shadow-md animate-fade-in delay-200">
                {slide.desc}
              </p>
              {slide.cta && (
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-all rounded-full font-semibold shadow-lg animate-fade-in delay-400">
                  {slide.cta}
                </button>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
