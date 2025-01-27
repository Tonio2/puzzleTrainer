import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import API from "services/api";
import { showToast } from "services/toast";


const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await API.delete("/auth/logout");
            logout();
            showToast("Logout successful", "success");
        } catch (error) {
            showToast("Logout failed", "error");
        }
    }

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between">
            <Link to="/" className="font-bold text-lg">My App</Link>
            <div>
                {user ? (
                    <>
                        <Link to="/catalogue" className="mr-4">Catalogue</Link>
                        <Link to="/library" className="mr-4">Library</Link>
                        <Link to="/puzzleForm" className="mr-4">Create Puzzle</Link>
                        <Link to="/profile" className="mr-4">Profile</Link>
                        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="mr-4">Login</Link>
                        <Link to="/register" className="bg-blue-500 px-4 py-2 rounded">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
