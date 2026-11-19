import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Aperture,
  CalendarCheck,
  ChevronDown,
  Heart,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Moon,
  PlusSquare,
  Sun,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import { getInitials } from '../utils/format';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/studios', label: 'Explore Studios', end: false },
  { to: '/how-it-works', label: 'How It Works', end: true },
  { to: '/about', label: 'About Us', end: true },
];

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { savedIds } = useWishlist();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      toast.success('Signed out of StudioSpace.');
      navigate('/');
    } catch {
      toast.error('Unable to sign out. Please try again.');
    }
  };

  const userInitials = getInitials(user?.name);

  return (
    <header className="sticky top-0 z-40 h-16 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 rounded"
        >
          <span className="w-8 h-8 rounded-lg bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center">
            <Aperture className="w-4 h-4" strokeWidth={2.2} />
          </span>
          <span>StudioSpace</span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'text-zinc-950 dark:text-white font-semibold after:absolute after:left-0 after:right-0 after:-bottom-[21px] after:h-[2px] after:bg-blue-700 dark:after:bg-blue-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {loading ? (
            <div className="w-24 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse hidden sm:block" />
          ) : user ? (
            <div
              ref={dropdownRef}
              className="relative hidden md:block"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                className="h-10 pl-1.5 pr-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 flex items-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-md object-cover bg-zinc-200 dark:bg-zinc-800"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-md bg-blue-700 text-white text-xs font-semibold flex items-center justify-center">
                    {userInitials}
                  </span>
                )}
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 max-w-[120px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-150 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full pt-2 w-60 z-50"
                >
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-2">
                    <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/add-studio"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-white transition-colors"
                      >
                        <PlusSquare className="w-4 h-4 text-zinc-400" />
                        <span>Add New Studio</span>
                      </Link>
                      <Link
                        to="/my-listings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-white transition-colors"
                      >
                        <ListChecks className="w-4 h-4 text-zinc-400" />
                        <span>My Studio Listings</span>
                      </Link>
                      <Link
                        to="/my-bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-white transition-colors"
                      >
                        <CalendarCheck className="w-4 h-4 text-zinc-400" />
                        <span>My Bookings</span>
                      </Link>
                      <Link
                        to="/dashboard?tab=wishlist"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-white transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Heart className="w-4 h-4 text-zinc-400" />
                          <span>Saved Studios</span>
                        </span>
                        <span className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                          {savedIds.size}
                        </span>
                      </Link>
                    </div>

                    <div className="pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-blue-700 dark:text-blue-400 font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
            {user ? (
              <div className="space-y-1">
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{user.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  Dashboard
                </Link>
                <Link
                  to="/add-studio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  Add New Studio
                </Link>
                <Link
                  to="/my-listings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  My Studio Listings
                </Link>
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  My Bookings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-sm font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-sm font-semibold rounded-lg bg-blue-700 text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
