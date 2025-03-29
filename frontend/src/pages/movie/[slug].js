import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from 'next/link';
import Navbar from "../../components/Layout/Navbar";
import styles from "../../styles/MovieDetail.module.css";

const MovieDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [showQualitySettings, setShowQualitySettings] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [tempRating, setTempRating] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoRef, setVideoRef] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('default');
  const [currentQuality, setCurrentQuality] = useState('auto');
  const [availableQualities, setAvailableQualities] = useState([
    { label: 'Tự động', value: 'auto' },
    { label: '1080p', value: '1080' },
    { label: '720p', value: '720' },
    { label: '480p', value: '480' },
    { label: '360p', value: '360' }
  ]);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#000");

  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Các tùy chọn chất lượng video
  const qualityOptions = ['auto', '1080p', '720p', '480p', '360p'];

  // Các lý do báo cáo
  const reportReasons = [
    'Phim không xem được',
    'Phim sai nội dung',
    'Phim thiếu tập',
    'Lỗi phụ đề',
    'Lỗi âm thanh',
    'Khác'
  ];

  // Thêm các options cho tốc độ phát và tỷ lệ khung hình
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
  const aspectRatioOptions = [
    { value: 'default', label: 'Mặc định' },
    { value: '16:9', label: '16:9' },
    { value: '4:3', label: '4:3' },
    { value: 'cover', label: 'Lấp đầy' },
  ];

  useEffect(() => {
    // Kiểm tra người dùng đã đăng nhập từ localStorage
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const response = await fetch(`https://ophim1.com/phim/${slug}`);
        const data = await response.json();

        if (data.status && data.movie) {
          console.log("Movie data:", data.movie); // Debug log
          
          // Xử lý URL ảnh
          const processedMovie = {
            ...data.movie,
            episodes: data.episodes || [],
            thumb_url: data.movie.thumb_url.startsWith('http') 
              ? data.movie.thumb_url 
              : `${data.pathImage}${data.movie.thumb_url}`,
            poster_url: data.movie.poster_url.startsWith('http')
              ? data.movie.poster_url
              : `${data.pathImage}${data.movie.poster_url}`
          };
          
          setMovie(processedMovie);
          
          // Fetch related movies based on category
          if (data.movie.category && data.movie.category.length > 0) {
            try {
              const categoryName = typeof data.movie.category[0] === 'object' 
                ? data.movie.category[0].name 
                : data.movie.category[0];
              
              // Đường dẫn API chính xác
              const relatedResponse = await fetch(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?category=${encodeURIComponent(categoryName)}&limit=12`);
              const relatedData = await relatedResponse.json();
              
              console.log("Related data:", relatedData); // Thêm log kiểm tra
              
              if (relatedData.items && Array.isArray(relatedData.items)) {
                // Xử lý URL ảnh cho phim liên quan
                const processedRelatedMovies = relatedData.items
                  .filter(item => item.slug !== slug)
                  .map(movie => ({
                    ...movie,
                    thumb_url: movie.thumb_url?.startsWith('http') 
                      ? movie.thumb_url 
                      : `${relatedData.pathImage}${movie.thumb_url}`,
                    poster_url: movie.poster_url?.startsWith('http')
                      ? movie.poster_url
                      : `${relatedData.pathImage}${movie.poster_url}`
                  }));
                
                console.log("Processed related movies:", processedRelatedMovies); // Thêm log kiểm tra
                
                setRelatedMovies(processedRelatedMovies);
              }
            } catch (relatedError) {
              console.error("Error fetching related movies:", relatedError);
            }
          }
        } else {
          setError("Không tìm thấy phim");
        }
      } catch (err) {
        console.error("Error fetching movie:", err);
        setError("Có lỗi xảy ra khi tải phim");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

  useEffect(() => {
    // Kiểm tra trạng thái yêu thích và xem sau từ localStorage
    const checkUserPreferences = () => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
      const savedRating = localStorage.getItem(`rating_${slug}`);
      
      setIsFavorite(favorites.includes(slug));
      setIsWatchLater(watchLater.includes(slug));
      if (savedRating) setUserRating(parseInt(savedRating));
    };

    checkUserPreferences();
  }, [slug]);

  useEffect(() => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      setVideoRef(iframe);
      
      // Lắng nghe thông điệp từ iframe
      window.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'timeupdate') {
            setCurrentTime(data.time);
          }
        } catch (e) {
          // Bỏ qua lỗi parse JSON
        }
      });
    }
  }, [selectedServer, selectedEpisode]);

  useEffect(() => {
    if (movie?.poster_url || movie?.thumb_url) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Thêm CORS
      img.src = movie.poster_url || movie.thumb_url;
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          setBackgroundColor(`rgb(${r}, ${g}, ${b})`);
        } catch (error) {
          console.error("Lỗi khi lấy màu từ hình ảnh:", error);
          setBackgroundColor("#000"); // Màu nền mặc định
        }
      };
      img.onerror = () => {
        console.error("Không thể tải hình ảnh.");
        setBackgroundColor("#000"); // Màu nền mặc định
      };
    }
  }, [movie]);

  const handleFavorite = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const newFavorites = favorites.filter(id => id !== slug);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(slug);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleWatchLater = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
    if (isWatchLater) {
      const newWatchLater = watchLater.filter(id => id !== slug);
      localStorage.setItem('watchLater', JSON.stringify(newWatchLater));
      setIsWatchLater(false);
    } else {
      watchLater.push(slug);
      localStorage.setItem('watchLater', JSON.stringify(watchLater));
      setIsWatchLater(true);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleReport = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setShowReportModal(true);
  };

  const submitReport = () => {
    // Xử lý gửi báo cáo
    console.log('Báo cáo:', { movieSlug: slug, reason: reportReason });
    setShowReportModal(false);
    setReportReason('');
    // Hiển thị thông báo thành công
    alert('Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét và khắc phục sớm nhất!');
  };

  const handleRating = (value) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setUserRating(value);
    localStorage.setItem(`rating_${slug}`, value.toString());
    setShowRatingModal(false);
  };

  const handleShowRating = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setTempRating(userRating);
    setShowRatingModal(true);
  };

  const handleFullscreen = () => {
    const player = document.getElementById("video-player");
    if (player.requestFullscreen) {
      player.requestFullscreen();
    } else if (player.webkitRequestFullscreen) {
      player.webkitRequestFullscreen();
    } else if (player.msRequestFullscreen) {
      player.msRequestFullscreen();
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const slider = scrollContainerRef.current;
    setStartX(e.pageX - slider.offsetLeft);
    setScrollLeft(slider.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const slider = scrollContainerRef.current;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Tốc độ cuộn
    slider.scrollLeft = scrollLeft - walk;
  };

  if (loading) {
    return (
      <div className={`bg-black min-vh-100 ${styles.loadingSpinner}`}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="bg-black min-vh-100">
        <Navbar />
        <div className={`container mt-5 text-white text-center ${styles.errorContainer}`}>
          <h2>{error || "Không tìm thấy phim"}</h2>
          <button 
            className="btn btn-danger mt-3"
            onClick={() => router.push("/")}
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-black ${styles.container}`} style={{ backgroundColor }}>
      <Navbar />
      
      <div className={styles.banner}>
        <div className={styles.bannerBackground}>
          <img
            src={movie.poster_url || movie.thumb_url}
            alt={movie.name || "Movie Background"}
            className={styles.bannerImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/img/default-banner.jpg"; // Add a default banner image
            }}
          />
          <div className={styles.bannerGradient}></div>
        </div>
        
        <div className={styles.bannerOverlay}>
          <div className="container">
            <div className={styles.bannerContent}>
              <div className={styles.leftSection}>
                <div className={styles.moviePoster}>
                  <img
                    src={movie.thumb_url || movie.poster_url}
                    alt={movie.name || "Movie Poster"}
                    className={styles.posterImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/default-poster.jpg"; // Add a default poster image
                    }}
                  />
                  <div className={styles.posterOverlay}>
                    <button 
                      className={styles.playButtonOverlay}
                      onClick={() => setShowPlayer(true)}
                    >
                      <div className={styles.playButtonContent}>
                        <img src="/img/play.png" alt="play" className={styles.playIcon} />
                      </div>
                    </button>
                  </div>
                  <div className={styles.movieActions}>
                    <button 
                      className={styles.actionButton} 
                      onClick={() => setShowReportModal(true)}
                    >
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Báo lỗi</span>
                    </button>
                    <button 
                      className={styles.actionButton}
                      onClick={handleShare}
                    >
                      <i className="fas fa-share-alt"></i>
                      <span>Chia sẻ</span>
                    </button>
                  </div>
                </div>
                
                <div className={styles.movieInfo}>
                  <h3 className={styles.movieTitle}>{movie.name}</h3>
                  {movie.origin_name && (
                    <h4 className={styles.originalTitle}>{movie.origin_name}</h4>
                  )}
                  <div className={styles.movieMeta}>
                    <span className={styles.metaItem}>
                      <i className="fas fa-calendar-alt"></i>
                      {movie.year}
                    </span>
                    <span className={styles.metaItem}>
                      <i className="fas fa-clock"></i>
                      {movie.duration || "N/A"}
                    </span>
                    <span className={styles.metaItem}>
                      <i className="fas fa-user-shield"></i>
                      {movie.age || "18+"}
                    </span>
                  </div>
                  
                  <div className={styles.actionButtons}>
                    <button 
                      className={`${styles.favoriteButton} btn btn-outline-light btn-lg ${isFavorite ? styles.active : ''}`}
                      onClick={handleFavorite}
                    >
                      <i className={`fas ${isFavorite ? 'fa-check' : 'fa-plus'} me-2`}></i>
                      {isFavorite ? 'Đã lưu' : 'Thêm vào danh sách'}
                    </button>
                    
                    {/* Thay thế phần sao bằng nút đánh giá */}
                    <button 
                      className="btn btn-outline-light btn-lg mt-3"
                      onClick={handleShowRating}
                    >
                      <i className="fas fa-star me-2"></i>
                      {userRating > 0 ? `Đánh giá của bạn: ${userRating}/10` : 'Đánh giá phim này'}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={styles.rightSection}>
                <div className={styles.describe}>
                  <h5 className={styles.sectionTitle}>Mô Tả</h5>
                  <p className={styles.movieDescription}>{movie.content || movie.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container text-white mt-5">
        {showPlayer && (
          <div 
            className={styles.videoPlayerOverlay}
            onClick={(e) => {
              if (e.target.classList.contains(styles.videoPlayerOverlay)) {
                setShowPlayer(false);
              }
            }}
          > 
            <div id="video-player" className={styles.videoPlayerContainer}>
              <div className="ratio ratio-16x9">
                <iframe
                  src={`${movie.episodes[selectedServer]?.server_data[selectedEpisode]?.link_embed}`}
                  allowFullScreen
                  className="rounded"
                ></iframe>
              </div>
             
            </div>
          </div>
        )}
         {/* Danh sách các tập phim */}
         {movie.episodes && movie.episodes.length > 0 && (
              <div className={styles.episodeList}>
                <h3 className="text-white">Các tập Phim </h3>
                <div className="d-flex flex-wrap gap-2">
                  {movie.episodes[selectedServer]?.server_data.map((episode, index) => (
                    <button
                      key={index}
                      className={`btn btn-outline-light ${styles.episodeBtn} ${selectedEpisode === index ? styles.episodeBtnActive : ''}`}
                      onClick={() => {
                        setSelectedEpisode(index);
                        setShowPlayer(true);
                      }}
                    >
                      Tập {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

        {/* Phim cùng thể loại */}
        {relatedMovies.length > 0 && (
          <div className="mt-5 mb-5">
            <h3 className="text-white mb-4">Phim cùng thể loại</h3>
            <div className={styles.relatedMoviesContainer}>
              <button 
                className={`${styles.scrollButton} ${styles.scrollLeft}`}
                onClick={scrollLeft}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              
              <div 
                ref={scrollContainerRef}
                className={styles.relatedMovies}
              >
                {relatedMovies.map((relatedMovie) => (
                  <div key={relatedMovie.slug} className={styles.relatedMovieCard}>
                    <Link 
                      href={`/movie/${relatedMovie.slug}`}
                      className={styles.movieLink}
                    >
                      <div className={styles.relatedMoviePoster}>
                        <img
                          src={relatedMovie.thumb_url || relatedMovie.poster_url}
                          alt={relatedMovie.name}
                          className={styles.relatedMovieImage}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/img/default-poster.jpg";
                          }}
                        />
                        <div className={styles.relatedMovieOverlay}>
                          <i className="fas fa-play"></i>
                        </div>
                      </div>
                      <h5 className={styles.relatedMovieTitle}>{relatedMovie.name}</h5>
                    </Link>
                  </div>
                ))}
              </div>
              
              <button 
                className={`${styles.scrollButton} ${styles.scrollRight}`}
                onClick={scrollRight}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        )}

        <h5 className={styles.sectionTitle}>Diễn Viên</h5>
        <div className={styles.actorsContainer}>
          {movie.actor?.map((actor, index) => (
            <div key={index} className={styles.actorCard}>
              <div className={styles.actorAvatar}>
                <img 
                  src={actor.avatar || "/img/user-avatar.png"} 
                  alt={actor.name || "Actor"} 
                  className={styles.actorImage}
                  onError={(e) => { e.target.src = "/img/user-avatar.png" }}
                />
              </div>
              <p className={styles.actorName}>{actor.name || actor}</p>
            </div>
          ))}
        </div>

        <h5 className={styles.sectionTitle}>Thể Loại</h5>
        <div className={styles.genresContainer}>
          {movie.category?.map((cat, index) => (
            <span key={index} className={styles.genreBadge}>
              {typeof cat === 'object' ? cat.name : cat}
            </span>
          ))}
        </div>

        {/* Phần bình luận */}
        <div className={styles.commentsSection}>
          <h5 className={styles.sectionTitle}>Bình luận</h5>
          
          {/* Danh sách bình luận */}
          <div className={styles.commentsList}>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentUser}>
                      <img 
                        src={comment.avatar || "/img/user-avatar.png"} 
                        alt={comment.username} 
                        className={styles.commentAvatar}
                        onError={(e) => { e.target.src = "/img/user-avatar.png" }}
                      />
                      <span className={styles.commentUsername}>{comment.username}</span>
                    </div>
                    <span className={styles.commentDate}>{comment.date}</span>
                  </div>
                  <p className={styles.commentContent}>{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
            )}
          </div>
          
          {/* Form thêm bình luận */}
          <div className={styles.addCommentForm}>
            {user ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                if (newComment.trim()) {
                  const commentObj = {
                    username: user.username,
                    avatar: user.avatar,
                    content: newComment,
                    date: new Date().toLocaleDateString('vi-VN')
                  };
                  setComments([...comments, commentObj]);
                  setNewComment("");
                }
              }}>
                <div className="form-group mb-3">
                  <textarea
                    className="form-control bg-dark text-white"
                    rows="3"
                    placeholder="Viết bình luận của bạn..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-danger">
                  Gửi bình luận
                </button>
              </form>
            ) : (
              <div className="alert alert-dark">
                <Link href="/auth/login" className="text-danger">
                  Đăng nhập
                </Link> để bình luận về phim này.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h5>Báo cáo lỗi</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white"
                onClick={() => setShowReportModal(false)}
              ></button>
            </div>
            <div className={styles.modalBody}>
              <div className="form-group">
                <label className="mb-2">Chọn lý do:</label>
                <select 
                  className="form-select bg-dark text-white border-secondary"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                >
                  <option value="">-- Chọn lý do --</option>
                  {reportReasons.map((reason, index) => (
                    <option key={index} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowReportModal(false)}
              >
                Hủy
              </button>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={submitReport}
                disabled={!reportReason}
              >
                Gửi báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h5>Chia sẻ phim</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white"
                onClick={() => setShowShareModal(false)}
              ></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.socialButtons}>
                <button className="btn btn-primary">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="btn btn-info">
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="btn btn-danger">
                  <i className="fab fa-pinterest"></i>
                </button>
                <button className="btn btn-success">
                  <i className="fab fa-whatsapp"></i>
                </button>
              </div>
              <div className="mt-3">
                <label className="mb-2">Link chia sẻ:</label>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control bg-dark text-white border-secondary"
                    value={window.location.href}
                    readOnly
                  />
                  <button 
                    className="btn btn-outline-light"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Đã sao chép link!');
                    }}
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowShareModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h5>Đánh giá phim</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white"
                onClick={() => setShowRatingModal(false)}
              ></button>
            </div>
            <div className={styles.modalBody}>
              <p>Bạn đánh giá phim này bao nhiêu điểm?</p>
              <div className={styles.ratingButtons}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <button
                    key={score}
                    className={`${styles.ratingButton} ${tempRating === score ? styles.ratingActive : ''}`}
                    onClick={() => setTempRating(score)}
                  >
                    {score}
                  </button>
                ))}
              </div>
              <div className={styles.ratingLabel}>
                {tempRating === 0 && "Chọn điểm"}
                {tempRating === 1 && "Quá tệ"}
                {tempRating === 2 && "Tệ"}
                {tempRating === 3 && "Không hay"}
                {tempRating === 4 && "Không tốt lắm"}
                {tempRating === 5 && "Bình thường"}
                {tempRating === 6 && "Xem được"}
                {tempRating === 7 && "Khá hay"}
                {tempRating === 8 && "Hay"}
                {tempRating === 9 && "Rất hay"}
                {tempRating === 10 && "Tuyệt vời"}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowRatingModal(false)}
              >
                Hủy
              </button>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => handleRating(tempRating)}
                disabled={tempRating === 0}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;