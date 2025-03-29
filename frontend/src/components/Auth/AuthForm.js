import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaGoogle, FaFacebook, FaHome } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function AuthForm() {
    const router = useRouter();
    const isLogin = router.pathname === '/auth/login';
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentView, setCurrentView] = useState(isLogin ? 'login' : 'signup');

    useEffect(() => {
        setCurrentView(isLogin ? 'login' : 'signup');
    }, [isLogin]);

    const handleSwitchAuth = (e) => {
        e.preventDefault();
        setIsAnimating(true);
        const path = isLogin ? '/auth/signup' : '/auth/login';
        
        // Thêm class để bắt đầu animation
        setTimeout(() => {
            router.push(path);
        }, 300);

        // Reset trạng thái animation
        setTimeout(() => {
            setIsAnimating(false);
        }, 600);
    };

    const handleHomeClick = () => {
        router.push('/');
    };

    return (
        <div className="auth-container">
            <button className="home-button" onClick={handleHomeClick}>
                <FaHome /> Home
            </button>
            <div className={`auth-box ${isAnimating ? 'animating' : ''} ${currentView}`}>
                <div className="form-container">
                    <div className="form-section">
                        <h2>{isLogin ? 'Login' : 'Sign up'}</h2>
                        <form>
                            <div className="input-group">
                                <input type="text" placeholder="Username" />
                            </div>
                            {!isLogin && (
                                <div className="input-group">
                                    <input type="email" placeholder="Email" />
                                </div>
                            )}
                            <div className="input-group">
                                <input type="password" placeholder="Password" />
                            </div>
                            <button type="submit" className="auth-button">
                                {isLogin ? 'Login' : 'Sign up'}
                            </button>
                        </form>

                        <div className="social-login">
                            <button className="social-button google">
                                <FaGoogle /> Sign {isLogin ? 'in' : 'up'} with Google
                            </button>
                            <button className="social-button facebook">
                                <FaFacebook /> Sign {isLogin ? 'in' : 'up'} with Facebook
                            </button>
                        </div>

                        <p className="switch-auth">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <a href="#" onClick={handleSwitchAuth}>
                                {isLogin ? 'Sign Up' : 'Login'}
                            </a>
                        </p>
                    </div>
                </div>
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1>{isLogin ? 'WELCOME BACK!' : 'WELCOME!'}</h1>
                        <p>
                            {isLogin
                                ? "We're happy to have you with us back again! If you need anything we're here to help"
                                : "We're glad you're here. If you need any assistance, feel free to reach out!"}
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .auth-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #0a1119;
                    padding: 20px;
                    perspective: 1000px;
                }

                .auth-box {
                    display: flex;
                    width: 900px;
                    height: 600px;
                    background: #0d1520;
                    border-radius: 20px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .form-container {
                    position: absolute;
                    width: 45%;
                    height: 100%;
                    left: 0;
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .welcome-section {
                    position: absolute;
                    width: 55%;
                    height: 100%;
                    right: 0;
                    background: linear-gradient(135deg,rgb(5, 120, 133),rgb(36, 61, 75));
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .welcome-content {
                    padding: 50px;
                    color: white;
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .auth-box.signup .form-container {
                    transform: translateX(122%);
                }

                .auth-box.signup .welcome-section {
                    transform: translateX(-81.8%);
                }

                .form-section {
                    padding: 50px;
                    opacity: 1;
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .auth-box.animating {
                    transform: scale(0.98);
                }

                .welcome-section {
                    clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
                }

                .auth-box.signup .welcome-section {
                    clip-path: polygon(0 0, 85% 0, 100% 100%, 15% 100%);
                }

                h1 {
                    font-size: 2.5em;
                    margin-bottom: 20px;
                }

                h2 {
                    color:rgb(43, 84, 89);
                    font-size: 2em;
                    margin-bottom: 30px;
                }

                .input-group {
                    margin-bottom: 20px;
                }

                input {
                    width: 100%;
                    padding: 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(0, 229, 255, 0.3);
                    border-radius: 5px;
                    color: white;
                    font-size: 16px;
                }

                input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .auth-button {
                    width: 100%;
                    padding: 12px;
                    background:rgb(73, 133, 140);
                    border: none;
                    border-radius: 5px;
                    color: #0d1520;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-bottom: 20px;
                }

                .auth-button:hover {
                    background: #00a2ff;
                    box-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
                }

                .social-login {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 20px;
                }

                .social-button {
                    width: 100%;
                    padding: 12px;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                }

                .google {
                    background: white;
                    color: #757575;
                }

                .facebook {
                    background: #1877f2;
                    color: white;
                }

                .switch-auth {
                    margin-top: 20px;
                    text-align: center;
                    color: rgba(255, 255, 255, 0.7);
                }

                .switch-auth a {
                    color: #00e5ff;
                    text-decoration: none;
                    cursor: pointer;
                }

                .home-button {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: transparent;
                    border: 1px solid #0ef;
                    border-radius: 5px;
                    color: #0ef;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 100;
                }

                .home-button:hover {
                    background: #0ef;
                    color: #0d1520;
                    box-shadow: 0 0 20px rgba(0, 238, 255, 0.5);
                }

                .home-button svg {
                    font-size: 18px;
                }

                @media (max-width: 768px) {
                    .auth-box {
                        flex-direction: column;
                        height: auto;
                        width: 90%;
                    }

                    .form-container,
                    .welcome-section {
                        position: relative;
                        width: 100%;
                    }

                    .auth-box.signup .form-container,
                    .auth-box.signup .welcome-section {
                        transform: none;
                    }

                    .welcome-section {
                        clip-path: none;
                    }
                }
            `}</style>
        </div>
    );
}
