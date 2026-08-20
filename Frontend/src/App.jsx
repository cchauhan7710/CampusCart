import React, { lazy, Suspense } from 'react'
import Navbar from './components/Navbar.jsx'
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Footer from './components/Footer.jsx'
import ProductDetailDrawer from './components/ProductDetailDrawer.jsx'
import PageWrapper, { ScrollToTop } from './components/PageWrapper.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartWishlistProvider } from './context/CartWishlistContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { Toaster } from 'react-hot-toast'
import { SkeletonPage } from './components/SkeletonLoader.jsx'

// Route-level Code Splitting with React.lazy
const Home = lazy(() => import('./pages/Home.jsx'))
const Marketplace = lazy(() => import('./pages/Marketplace.jsx'))
const Addproduct = lazy(() => import('./pages/Addproduct.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Cart = lazy(() => import('./pages/Cart.jsx'))
const Wishlist = lazy(() => import('./pages/Wishlist.jsx'))
const OtpPage = lazy(() => import('./pages/Otp.jsx'))
const AuthSlider = lazy(() => import('./components/AuthSlider.jsx'))

function App() {
  const location = useLocation();
  const hideFooter = ["/login", "/register", "/otp"].includes(location.pathname);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartWishlistProvider>
          <ScrollToTop />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#141417',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                fontSize: '13px',
                fontWeight: '500',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(12px)',
              },
              success: {
                iconTheme: {
                  primary: '#ff4569',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
          
          {/* Global Product Detail Slide-over Sidebar Drawer */}
          <ProductDetailDrawer />

          <div className="min-h-screen w-full bg-black flex flex-col justify-between overflow-x-hidden">
            <Navbar />

            <Suspense fallback={<SkeletonPage />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  {/* Public Pages */}
                  <Route
                    path="/"
                    element={
                      <PageWrapper>
                        <Home />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/marketplace"
                    element={
                      <PageWrapper>
                        <Marketplace />
                      </PageWrapper>
                    }
                  />

                  {/* Protected Routes (Requires Authentication) */}
                  <Route
                    path="/addproduct"
                    element={
                      <ProtectedRoute>
                        <PageWrapper>
                          <Addproduct />
                        </PageWrapper>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <PageWrapper>
                          <Profile />
                        </PageWrapper>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <PageWrapper>
                          <Cart />
                        </PageWrapper>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <PageWrapper>
                          <Wishlist />
                        </PageWrapper>
                      </ProtectedRoute>
                    }
                  />

                  {/* Public-Only Routes (Redirects to / if logged in) */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <PageWrapper>
                          <AuthSlider />
                        </PageWrapper>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <PageWrapper>
                          <AuthSlider />
                        </PageWrapper>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/otp"
                    element={
                      <PublicRoute>
                        <PageWrapper>
                          <OtpPage />
                        </PageWrapper>
                      </PublicRoute>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </Suspense>

            {!hideFooter && <Footer />}
          </div>
        </CartWishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
