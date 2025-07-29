import React, { useState, useEffect, useRef } from "react";
import "./home-slider.css";


function importAll(r) {
  return r
    .keys()
    .sort() 
    .map((key, i) => ({
      id: `slide-${i + 1}`,
      imgUrl: r(key),
      altText: `Slide ${i + 1}`,
      callToAction: "Shop Now",
      ctaLink: "/shop",
      
    }));
}

const slides = importAll(
  require.context("../../assets/slides", false, /\.(jpe?g|png|svg|webp)$/)
);

const HomeSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideCount = slides.length;
  const timeoutRef = useRef(null);

  
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => resetTimeout();
  }, [currentIndex, slideCount]);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const goToSlide = (index) => setCurrentIndex(index);
  const goPrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  const goNext = () =>
    setCurrentIndex((prev) => (prev === slideCount - 1 ? 0 : prev + 1));

  return (
    <section className="hm-carousel-container" aria-label="Homepage Image Carousel">
      <div
        className="hm-carousel-slides"
        onMouseEnter={resetTimeout}
        onMouseLeave={() => {
          timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % slideCount);
          }, 5000);
        }}
      >
        {slides.map(({ id, imgUrl, altText, callToAction, ctaLink, headline, subtext }, i) => (
          <div
            key={id}
            className={`hm-slide${i === currentIndex ? " active" : ""}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slideCount}`}
            aria-hidden={i !== currentIndex}
          >
            <img loading="lazy" src={imgUrl} alt={altText || "Slide image"} />

            {/* Caption container */}
            <div className="hm-carousel-caption">
              <h1 aria-label={Array.isArray(headline) ? headline.join(" ") : headline}>
                {Array.isArray(headline)
                  ? headline.map((word, idx) => (
                      <span
                        key={idx}
                        style={{
                          marginRight: "0.3rem",
                          fontWeight: word.includes("%") ? "900" : "700",
                          fontSize: word.includes("%") ? "4rem" : undefined,
                          color: word.includes("%") ? "#fff" : undefined,
                        }}
                      >
                        {word}
                      </span>
                    ))
                  : headline}
              </h1>

              {subtext && <p>{subtext}</p>}
            </div>

            {/* CTA Button */}
            {callToAction && ctaLink && (
              <a
                className="hm-carousel-cta"
                href={ctaLink}
                tabIndex={i === currentIndex ? 0 : -1}
                aria-label={`Call to action: ${callToAction}`}
              >
                {callToAction.toUpperCase()}
              </a>
            )}
          </div>
        ))}

        {/* Arrows */}
        {slideCount > 1 && (
          <>
            <button
              className="hm-carousel-arrow hm-prev"
              onClick={goPrev}
              aria-label="Previous Slide"
              type="button"
            >
              &#10094;
            </button>
            <button
              className="hm-carousel-arrow hm-next"
              onClick={goNext}
              aria-label="Next Slide"
              type="button"
            >
              &#10095;
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {slideCount > 1 && (
        <div className="hm-carousel-dots" role="tablist" aria-label="Select Slide">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`hm-dot${index === currentIndex ? " active" : ""}`}
              onClick={() => goToSlide(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-controls={`slide-${index}`}
              tabIndex={index === currentIndex ? 0 : -1}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeSlider;
