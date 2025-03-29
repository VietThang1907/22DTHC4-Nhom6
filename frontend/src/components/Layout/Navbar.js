import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaBell } from "react-icons/fa"; // Import icon
import { useRouter } from "next/router";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const router = useRouter();

  // Xử lý hiệu ứng mờ khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchInput(false);
      setSearchQuery("");
    }
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
  };

  const handleAvatarClick = () => {
    // Chuyển hướng đến trang đăng nhập
    router.push('/auth/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? "bg-dark shadow-lg" : "bg-transparent"}`}>
      <div className="container-fluid px-5 d-flex align-items-center">
        {/* Logo Netflix */}
        <Link href="/" className="navbar-brand text-danger fw-bold fs-3 me-4">
          <h2>Phim Hay</h2> 
        </Link>

        {/* Danh mục menu */}
        <ul className="navbar-nav flex-row mx-auto"> {/* Canh giữa */}
          <li className="nav-item"><Link href="/" className="nav-link text-white px-3">Trang chủ</Link></li>
          <li className="nav-item"><Link href="/search" className="nav-link text-white px-3">Tìm kiếm</Link></li>
          <li className="nav-item"><Link href="#" className="nav-link text-white px-3">Phim Lẻ</Link></li>
          <li className="nav-item"><Link href="#" className="nav-link text-white px-3">Phim Bộ</Link></li>
          <li className="nav-item"><Link href="#" className="nav-link text-white px-3">Danh Sách Yêu Thích  </Link></li>
          <li className="nav-item"><Link href="#" className="nav-link text-white px-3">Danh Sách Xem sau </Link></li>
          <li className="nav-item"><Link href="#" className="nav-link text-white px-3">Danh Sách Phim Đã Xem </Link></li>
        </ul>

        {/* Biểu tượng bên phải */}
        <div className="d-flex align-items-center gap-3">
          {showSearchInput ? (
            <form onSubmit={handleSearch} className="d-flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control form-control-sm bg-dark text-white border-secondary"
                placeholder="Tìm kiếm..."
                autoFocus
              />
              <button type="submit" className="btn btn-sm btn-outline-danger ms-2">
                Tìm
              </button>
            </form>
          ) : (
            <FaSearch className="text-white fs-5 cursor-pointer" onClick={toggleSearchInput} />
          )}
          <FaBell className="text-white fs-5 cursor-pointer" />
          <div className="profile-avatar" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
            <img 
              src="/img/avatar.png" 
              alt="User Avatar" 
              className="rounded-circle" 
              style={{ width: '40px', height: '40px' }} 
              onError={(e) => { e.target.src = "/img/default-avatar.png"; }}
            />
          </div>
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .navbar {
          transition: background 0.3s ease-in-out, box-shadow 0.3s;
          z-index: 1000;
        }
        .nav-link {
          font-size: 16px;
          font-weight: 500;
          transition: color 0.3s;
        }
        .nav-link:hover {
          color: #e50914 !important; /* Màu đỏ Netflix khi hover */
        }
        .profile-avatar img {
          width: 35px;
          height: 35x;
          object-fit: cover;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
