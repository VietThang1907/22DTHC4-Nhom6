import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import Link from 'next/link';

const HeroSlider = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    centerMode: true,
    centerPadding: "0px",
    slidesToShow: 3,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    arrows: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1
        }
      }
    ],
    afterChange: (index) => {
      // Update background image for hero slider
      const movie = movies[index];
      document.querySelector('.hero-slider').style.backgroundImage = `url(${movie.poster_url})`;
    }
  };

  const getImageUrl = (url, pathImage) => {
    if (url && !url.startsWith('http')) {
      return `${pathImage}${url}`;
    }
    return url;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=1');
        const moviesWithImage = response.data.items.map(movie => ({
          ...movie,
          poster_url: getImageUrl(movie.poster_url, response.data.pathImage),
          thumb_url: getImageUrl(movie.thumb_url, response.data.pathImage)
        }));
        setMovies(moviesWithImage);

        if (moviesWithImage.length > 0) {
          document.querySelector('.hero-slider').style.backgroundImage = `url(${moviesWithImage[0].poster_url})`;
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="hero-slider container py-4">
      <Slider {...settings}>
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div key={index} className="slider-item px-2">
              <div className="position-relative overflow-hidden rounded">
                <img 
                  src={movie.thumb_url || movie.poster_url || "/placeholder.jpg"}
                  alt={movie.name}
                  className="img-fluid w-100"
                  style={{ height: '500px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.jpg"; 
                  }}
                />

                <div className="slider-content position-absolute bottom-0 start-0 w-100 p-4 text-white">
                  <div className="d-flex gap-2 mb-2 flex-wrap align-items-center">
                    <span className="badge bg-warning text-dark">13+</span>
                    {movie.time && <span className="badge bg-secondary">{movie.time}</span>}
                    {movie.year && <span className="badge bg-dark">{movie.year}</span>}
                    {movie.lang && <span className="badge bg-info text-dark">{movie.lang}</span>}
                  </div>
                  <h2 className="fw-bold display-6 mb-2">{movie.name}</h2>
                  <p className="text-muted small mb-3">
                    {Array.isArray(movie.category)
                      ? movie.category.map((c) => (typeof c === "string" ? c : c.name)).join(", ")
                      : movie.category}
                  </p>
                  <div className="d-flex gap-2">
                    <Link href={`/movie/${movie.slug}`} className="btn btn-danger">
                      <i className="fas fa-play me-2" /> Xem ngay
                    </Link>
                    <button className="btn btn-warning text-dark">+ Danh sách</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No movies available</div>
        )}
      </Slider>
    </div>
  );
};

export default HeroSlider;
