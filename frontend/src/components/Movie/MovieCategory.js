import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Import the Skeleton component
import Skeleton from '../UI/Skeleton';

const MovieCategory = ({ title, endpoint, showTopMovies = true }) => {
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // State to track images that have finished loading
  const [loadedImages, setLoadedImages] = useState({});

  // Cải thiện hàm xử lý việc load hình ảnh
  const handleImageLoad = (id) => {
    // Tạo hiệu ứng mượt mà hơn với setTimeout
    if (!loadedImages[id]) {  
      // Thêm timeout để hiệu ứng mượt hơn
      setTimeout(() => {
        setLoadedImages(prev => ({
          ...prev,
          [id]: true
        }));
      }, 300); // Delay 300ms để hiệu ứng blur thể hiện rõ hơn
    }
  };

  const fetchMovies = async (pageNumber) => {
    try {
      setLoading(true);
      const response = await fetch(`https://ophim1.com/${endpoint}?page=${pageNumber}`);
      const data = await response.json();

      if (data.items) {
        const moviesWithDetails = await Promise.all(
          data.items.map(async (movie) => {
            try {
              const detailResponse = await fetch(`https://ophim1.com/phim/${movie.slug}`);
              const detailData = await detailResponse.json();
              return {
                ...movie,
                ...detailData.movie,
                episodes: detailData.episodes,
                
                thumb_url: movie.thumb_url.startsWith('http') 
                  ? movie.thumb_url 
                  : `${data.pathImage}${movie.thumb_url}`,
                poster_url: movie.poster_url.startsWith('http')
                  ? movie.poster_url
                  : `${data.pathImage}${movie.poster_url}`
              };
            } catch (error) {
              console.error(`Error fetching details for ${movie.slug}:`, error);
              return {
                ...movie,
                thumb_url: movie.thumb_url.startsWith('http') 
                  ? movie.thumb_url 
                  : `${data.pathImage}${movie.thumb_url}`,
                poster_url: movie.poster_url.startsWith('http')
                  ? movie.poster_url
                  : `${data.pathImage}${movie.poster_url}`
              };
            }
          })
        );

        if (pageNumber === 1) {
          setFeaturedMovies(moviesWithDetails.slice(0, 5)); // Changed to 5 featured movies
          setTopMovies(moviesWithDetails.slice(5, 17));
          setMovies(moviesWithDetails);
        } else {
          setMovies(prevMovies => [...prevMovies, ...moviesWithDetails]);
        }
      }
    } catch (error) {
      console.error(`Lỗi khi tải phim cho ${title}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, [endpoint]);

  // Thêm vào useEffect
  useEffect(() => {
    // Preload ảnh cho phim nổi bật
    if (featuredMovies.length > 0) {
      featuredMovies.forEach(movie => {
        const img = new Image();
        img.src = movie.thumb_url || movie.poster_url || '/placeholder.jpg';
      });
    }
  }, [featuredMovies]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage);
  };

  // Removed unused handlePrev function

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNext(); // Automatically go to the next movie
    }, 5000); // Change every 5 seconds
  
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [activeIndex, featuredMovies]);
  
  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
  
    const nextIndex = activeIndex === featuredMovies.length - 1 ? 0 : activeIndex + 1;
    const nextMovie = featuredMovies[nextIndex];
    const img = new Image();
    img.src = nextMovie.thumb_url || nextMovie.poster_url || '/placeholder.jpg';
  
    setActiveIndex(nextIndex);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="movie-section mb-5">
      {/* Enhanced Carousel with Better Background - MOVED TO TOP */}
      {featuredMovies.length > 0 && (
        <div className="featured-movies mb-5">
          <div className="position-relative" style={{ 
            height: '800px', // Increased height for larger background
            width:'100%',
            overflow: 'hidden',
            background: '#000'
          }}>
            {/* Full screen backdrop for selected movie - Enhanced version */}
            {featuredMovies[activeIndex] && (
              <>
                {/* Main large backdrop image */}
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    backgroundImage: `url(${featuredMovies[activeIndex].backdrop_url || featuredMovies[activeIndex].poster_url || featuredMovies[activeIndex].thumb_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    filter: 'brightness(1)', // Increased brightness for better visibility
                    opacity: 1,
                    transition: 'all 0.7s ease-in-out',
                    zIndex: 1
                  }}
                />
                
                {/* Backdrop overlay with gradients */}
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)',
                    zIndex: 1
                  }}
                />
              </>
            )}
            
            {/* Cinematic color effect */}
            <div 
              className="position-absolute top-0 start-0 w-100 h-100" 
              style={{
                background: 'radial-gradient(circle at center, rgba(255,0,0,0.07) 0%, rgba(0,0,0,0) 70%)',
                zIndex: 2
              }}
            />
            
            {/* Carousel items */}
            <div className="d-flex justify-content-center align-items-center h-100" style={{ zIndex: 3, position: 'relative' }}>
            {featuredMovies.map((movie, index) => {
          const totalItems = featuredMovies.length;
          let position = (index - activeIndex + totalItems) % totalItems;

          if (position > Math.floor(totalItems / 2)) position = position - totalItems;

          let zIndex = 4 - Math.abs(position);
          let scale = position === 0 ? 1 : 0.7 - Math.abs(position) * 0.1;
          let translateX = position * 300;
          let opacity = 1 - Math.abs(position) * 0.2;
          let visibility = Math.abs(position) <= 2 ? 'visible' : 'hidden';
          let rotation = position * -15;
          const imageId = `featured-${movie.slug}`;

          return (
            <div 
              key={imageId}
              className="position-absolute"
              style={{ 
                width: '400px', // Wider cards
                visibility,
                zIndex,
                transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotation}deg)`,
                opacity,
                transition: 'all 0.5s ease',
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
              onClick={() => {
                if (position !== 0 && !isTransitioning) {
                  setActiveIndex(index);
                } else if (position === 0) {
                  // Navigate to movie page when clicking the center card
                  window.location.href = `/movie/${movie.slug}`;
                }
              }}
            >
              <div className="card bg-dark border-0">
                <div className="position-relative">
                  <div 
                    className={`blur-load ${loadedImages[imageId] ? 'loaded' : ''}`}
                    style={{ 
                      height: '600px',
                      backgroundImage: `url(${movie.thumb_url || movie.poster_url})`,
                      backgroundSize: 'cover',
                      filter: loadedImages[imageId] ? 'none' : 'blur(10px)',
                      transition: 'filter 0.3s ease-in-out',
                      borderRadius: '15px 15px 0 0'
                    }}
                  >
                    {!loadedImages[imageId] && (
                      <Skeleton height="600px" borderRadius="15px 15px 0 0" />
                    )}
                    <img
                      src={movie.thumb_url || movie.poster_url}
                      alt={movie.name}
                      className="card-img-top"
                      loading="lazy"
                      style={{ 
                        height: '600px', 
                        objectFit: 'cover', 
                        borderRadius: '15px 15px 0 0',
                        boxShadow: position === 0 
                          ? '0 10px 30px rgba(255, 0, 0, 0.3)' 
                          : '0 5px 15px rgba(0, 0, 0, 0.5)'
                      }}
                      onLoad={() => handleImageLoad(imageId)}
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                        handleImageLoad(imageId);
                      }}
                    />
                  </div>

                  {/* Add "WATCH" and "ADD LIST" buttons here */}
                  {index === activeIndex && (
  <div className="position-absolute start-50 translate-middle-x" style={{ bottom: '150px', zIndex: 5 }}> {/* Điều chỉnh vị trí bottom */}
    <h5 className="card-title mb-1 text-truncate text-white text-center">{featuredMovies[activeIndex]?.name}</h5>
    <p className="card-text m-0 text-muted text-center">{featuredMovies[activeIndex]?.origin_name}</p>
    <div className="d-flex gap-2 justify-content-center mt-3"> {/* Sắp xếp nút nằm ngang */}
      <Link
        href={`/movie/${featuredMovies[activeIndex]?.slug}`}
        className="btn btn-danger d-flex align-items-center"
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        <i className="fas fa-play me-2"></i>
        WATCH
      </Link>
      <button
        className="btn btn-warning d-flex align-items-center"
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        <i className="fas fa-plus me-2"></i>
        ADD LIST
      </button>
    </div>
  </div>
)}

                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-danger">
                      {movie.year}
                    </span>
                    {movie.quality && (
                      <span className="badge bg-primary ms-1">
                        {movie.quality}
                      </span>
                    )}
                  </div>
                </div>
                <div className="card-body bg-dark text-white p-3" style={{ borderRadius: '0 0 15px 15px' }}>
                  <h5 className="card-title mb-1 text-truncate">{movie.name}</h5>
                  <p className="card-text m-0 text-muted">{movie.origin_name}</p>
                </div>
              </div>
            </div>
          );
        })}

            </div>
            
            {/* Side navigation buttons have been removed */}
            
            {/* Indicators */}
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4" style={{ zIndex: 10 }}>
              <div className="d-flex gap-2">
                {featuredMovies.map((_, index) => (
                  <button
                    key={index}
                    className="p-0 border-0"
                    style={{
                      width: index === activeIndex ? '30px' : '10px',
                      height: '10px',
                      borderRadius: '5px',
                      background: index === activeIndex ? '#dc3545' : 'rgba(255,255,255,0.5)',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => !isTransitioning && setActiveIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chỉ hiển thị phim đề xuất nếu showTopMovies = true */}
      {showTopMovies && topMovies.length > 0 && (
        <div className="top-movies mb-5">
          <h3 className="text-white mb-3">Phim Đề Xuất</h3>
          <div className="d-flex overflow-auto pb-3" style={{ scrollbarWidth: 'thin' }}>
            {topMovies.map((movie) => {
              const imageId = `top-${movie.slug}`;
              return (
                <div key={imageId} className="flex-shrink-0 me-3" style={{ width: '220px' }}>
                  <div className="card bg-dark movie-card border-0">
                    <div className="position-relative movie-poster">
                      <div 
                        className={`blur-load ${loadedImages[imageId] ? 'loaded' : ''}`} 
                        style={{ 
                          backgroundImage: `url(${movie.thumb_url})`,
                          backgroundSize: 'cover',
                          filter: loadedImages[imageId] ? 'none' : 'blur(10px)',
                          transition: 'filter 0.3s ease-in-out',
                          height: '300px',
                          borderRadius: '8px'
                        }}
                      >
                        {!loadedImages[imageId] && (
                          <Skeleton height="300px" borderRadius="8px" />
                        )}
                        <img
                          src={movie.thumb_url}
                          className="card-img-top"
                          alt={movie.name}
                          loading="lazy"
                          style={{ 
                            height: '300px', 
                            objectFit: 'cover', 
                            borderRadius: '8px' 
                          }}
                          onLoad={() => handleImageLoad(imageId)}
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                            handleImageLoad(imageId);
                          }}
                        />
                      </div>
                      <div className="overlay" style={{ borderRadius: '8px' }}>
                        <div className="d-flex gap-2">
                          <Link 
                            href={`/movie/${movie.slug}`}
                            className="btn btn-danger btn-sm d-flex align-items-center"
                            style={{
                              padding: '8px 16px',
                              fontSize: '13px',
                              fontWeight: '600',
                              letterSpacing: '0.5px',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <i className="fas fa-play me-2"></i>
                            Xem phim
                          </Link>
                          <button 
                            className="btn btn-outline-light btn-sm d-flex align-items-center"
                            style={{
                              padding: '8px 16px',
                              fontSize: '13px',
                              fontWeight: '600',
                              letterSpacing: '0.5px',
                              transition: 'all 0.3s ease',
                              backdropFilter: 'blur(5px)',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <i className="fas fa-plus me-2"></i>
                            Thêm
                          </button>
                        </div>
                      </div>
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-danger">
                          {movie.year}
                        </span>
                        {movie.quality && (
                          <span className="badge bg-primary ms-1">
                            {movie.quality}
                          </span>
                        )}
                      </div>
                      {movie.episodes && movie.episodes[0] && (
                        <div className="position-absolute bottom-0 start-0 m-2">
                          <span className="badge bg-success">
                            {movie.episodes[0].server_data.length} tập
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="card-body">
                      <h6 className="card-title text-white mb-1 text-truncate">
                        {movie.name}
                      </h6>
                      <p className="card-text small text-muted text-truncate">
                        {movie.origin_name}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid of Movies */}
      <h3 className="text-white mb-4">{title}</h3>
      <div className="row g-3">
        {loading && page === 1 
          ? [...Array(12)].map((_, i) => (
              <div key={`skeleton-${i}`} className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-1-7">
                <div className="card h-100 bg-dark border-0">
                  <Skeleton height="250px" />
                  <div className="card-body">
                    <Skeleton height="18px" width="85%" />
                    <div className="mt-1">
                      <Skeleton height="14px" width="65%" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          : movies.slice(0, page * 7).map((movie) => {
              const imageId = `grid-${movie.slug}`;
              return (
                <div key={movie.slug} className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-1-7">
                  <div className="card h-100 bg-dark movie-card border-0">
                    <div className="position-relative movie-poster">
                      <div 
                        className={`blur-load ${loadedImages[imageId] ? 'loaded' : ''}`}
                        style={{ 
                          backgroundImage: `url(${movie.thumb_url}?blur=30)`,
                          height: '250px'
                        }}
                      >
                        {!loadedImages[imageId] && (
                          <Skeleton height="250px" />
                        )}
                        <img
                          src={movie.thumb_url}
                          className="card-img-top"
                          alt={movie.name}
                          loading="lazy"
                          style={{ height: '250px', objectFit: 'cover' }}
                          onLoad={() => handleImageLoad(imageId)}
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                            handleImageLoad(imageId);
                          }}
                        />
                      </div>
                      <div className="overlay">
                        <div className="d-flex gap-2">
                          <Link 
                            href={`/movie/${movie.slug}`}
                            className="btn btn-danger btn-sm d-flex align-items-center"
                            style={{
                              padding: '8px 16px',
                              fontSize: '13px',
                              fontWeight: '600',
                              letterSpacing: '0.5px',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <i className="fas fa-play me-2"></i>
                            Xem phim
                          </Link>
                          <button 
                            className="btn btn-outline-light btn-sm d-flex align-items-center"
                            style={{
                              padding: '8px 16px',
                              fontSize: '13px',
                              fontWeight: '600',
                              letterSpacing: '0.5px',
                              transition: 'all 0.3s ease',
                              backdropFilter: 'blur(5px)',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <i className="fas fa-plus me-2"></i>
                            Thêm
                          </button>
                        </div>
                      </div>
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-danger">
                          {movie.year}
                        </span>
                        {movie.quality && (
                          <span className="badge bg-primary ms-1">
                            {movie.quality}
                          </span>
                        )}
                      </div>
                      {movie.episodes && movie.episodes[0] && (
                        <div className="position-absolute bottom-0 start-0 m-2">
                          <span className="badge bg-success">
                            {movie.episodes[0].server_data.length} tập
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="card-body">
                      <h6 className="card-title text-white mb-1 text-truncate">
                        {movie.name}
                      </h6>
                      <p className="card-text small text-muted text-truncate">
                        {movie.origin_name}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
      <div className="text-center mt-4">
        <button 
          className="btn btn-outline-danger px-4"
          onClick={loadMore}
          disabled={loading}
        >
          {loading ? 'Đang tải...' : 'Xem thêm'}
        </button>
      </div>
    </div>
  );
};

export default MovieCategory;
