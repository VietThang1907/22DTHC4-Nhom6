import React, { useEffect, useState } from "react";
import Link from "next/link";
import MovieCategory from "./MovieCategory";


const MovieList = () => {
  const [categories, setCategories] = useState([
    {
      id: 'new',
      title: "Phim mới cập nhật",
      endpoint: 'danh-sach/phim-moi-cap-nhat',
      movies: []
    },

  ]);
  
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMovieDetail = async (slug) => {
    const response = await fetch(`https://ophim1.com/phim/${slug}`);
    const data = await response.json();
    return data.movie;
  };

  const fetchMoviesForCategory = async (endpoint, categoryId) => {
    try {
      const response = await fetch(`https://ophim1.com/phim${endpoint}`);
      const data = await response.json();
      
      if (data.items) {
        const moviePromises = data.items.map(async (movie) => {
          const movieDetail = await fetchMovieDetail(movie.slug);
          return movieDetail;
        });

        let movies = await Promise.all(moviePromises);
        movies = movies.filter(movie => movie !== null);

        // Lọc theo category
        if (categoryId === 'series') {
          movies = movies.filter(movie => 
            movie.type === 'series' || 
            movie.episode_current !== 'Full' ||
            movie.category?.some(cat => 
              cat.name.toLowerCase().includes('phim bộ'))
          );
        } else if (categoryId === 'single') {
          movies = movies.filter(movie => 
            movie.type === 'single' || 
            movie.episode_current === 'Full' ||
            movie.category?.some(cat => 
              cat.name.toLowerCase().includes('phim lẻ'))
          );
        }

        return movies;
      }
      return [];
    } catch (error) {
      console.error(`Lỗi khi fetch ${endpoint}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        setLoading(true);
        const updatedCategories = [...categories];
        
        for (let i = 0; i < categories.length; i++) {
          const movies = await fetchMoviesForCategory(
            categories[i].endpoint,
            categories[i].id
          );
          
          updatedCategories[i] = {
            ...categories[i],
            movies: movies
          };
        }
        
        setCategories(updatedCategories);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu phim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  const loadMoreMovies = async (categoryId) => {
    try {
      setLoading(true);
      const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
      if (categoryIndex === -1) return;

      const category = categories[categoryIndex];
      const nextPage = Math.ceil(category.movies.length / 20) + 1;

      const newMovies = await fetchMoviesForCategory(
        `${category.endpoint}?page=${nextPage}`,
        category.id
      );

      if (newMovies.length > 0) {
        const updatedCategories = [...categories];
        updatedCategories[categoryIndex] = {
          ...category,
          movies: [...category.movies, ...newMovies]
        };
        setCategories(updatedCategories);
      }
    } catch (error) {
      console.error("Lỗi khi tải thêm phim:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4">
      {categories.map((category) => (
        <MovieCategory
          key={category.id}
          title={category.title}
          endpoint={category.endpoint}
        />
      ))}

      {showModal && selectedMovie && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">
                  {selectedMovie.name}
                  <small className="text-muted ms-2">({selectedMovie.year})</small>
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="position-relative">
                      <img
                        src={selectedMovie.thumb_url || selectedMovie.poster_url}
                        alt={selectedMovie.name}
                        className="img-fluid rounded w-100"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = "";
                        }}
                      />
                      <div className="position-absolute bottom-0 start-0 end-0 p-2 text-center" 
                        style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                        <div className="d-flex gap-2 justify-content-center">
                          <button 
                            className="btn btn-danger"
                            onClick={() => setShowTrailer(true)} // Show trailer
                          >
                            <i className="fas fa-play me-2"></i>
                            Xem trailer
                          </button>
                          <button 
                            className="btn btn-danger"
                            onClick={() => setShowPlayer(true)} // Play the movie
                          >
                            <i className="fas fa-play me-2"></i>
                            Xem phim
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                  </div>
                </div>

                {/* Show Trailer */}
                {showTrailer && selectedMovie.trailer_url && (
                  <div className="mt-4">
                    <div className="ratio ratio-16x9">
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedMovie.trailer_url}`}
                        allowFullScreen
                        className="rounded"
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Player section */}
                {showPlayer && selectedMovie.episodes && selectedMovie.episodes[0] && (
                  <div className="mt-4">
                    <div className="ratio ratio-16x9">
                      <iframe
                        src={selectedMovie.episodes[0].server_data[0].link_embed}
                        allowFullScreen
                        className="rounded"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer border-secondary">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
                <Link 
                  href={`/movie/${selectedMovie.slug}`}
                  className="btn btn-danger"
                >
                  Chi tiết phim
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .col-xl-1-7 {
          flex: 0 0 calc(100% / 7);
          max-width: calc(100% / 7);
        }
        
        @media (max-width: 1200px) {
          .col-xl-1-7 {
            flex: 0 0 20%;
            max-width: 20%;
          }
        }
        
        @media (max-width: 992px) {
          .col-xl-1-7 {
            flex: 0 0 25%;
            max-width: 25%;
          }
        }
        
        @media (max-width: 768px) {
          .col-xl-1-7 {
            flex: 0 0 33.333333%;
            max-width: 33.333333%;
          }
        }
        
        @media (max-width: 576px) {
          .col-xl-1-7 {
            flex: 0 0 50%;
            max-width: 50%;
          }
        }
        
        .movie-poster {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
        }
        
        .movie-poster img {
          transition: transform 0.3s ease;
        }
        
        .movie-poster:hover img {
          transform: scale(1.05);
        }
        
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .movie-poster:hover .overlay {
          opacity: 1;
        }
        
        .watch-button {
          transform: translateY(20px);
          transition: transform 0.3s ease;
        }
        
        .movie-poster:hover .watch-button {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default MovieList;
