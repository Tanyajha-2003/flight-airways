import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    return (
        <nav className="navbar">
            <Link to="/" className="brand">
                ✈️ FlyHigh
            </Link>

            <div className="navbar-links">
                {/* 🔐 NOT LOGGED IN */}
                {!user && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                {/* ✅ LOGGED IN */}
                {user && (
                    <>
                    
                        <span className="text-purple-700/90">
                            Hi, <strong>{user.name}</strong>
                        </span>

                        <Link to="/wallet">Wallet</Link>
                        <Link to="/history">Bookings</Link>

                        <button
                            onClick={onLogout}
                            className="btn-logout"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
