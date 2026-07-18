import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages (to be created)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Temples from './pages/Temples';
import TempleDetail from './pages/TempleDetail';
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import UserManager from './pages/admin/UserManager';
import TempleManager from './pages/admin/TempleManager';
import OrganizerManager from './pages/admin/OrganizerManager';
import Analytics from './pages/admin/Analytics';
import AdminBookings from './pages/admin/AdminBookings';
import AdminDonations from './pages/admin/AdminDonations';
import AdminSettings from './pages/admin/AdminSettings';

// Organizer Pages
import OrganizerLayout from './pages/organizer/OrganizerLayout';
import OrganizerOverview from './pages/organizer/OrganizerOverview';
import MyTemples from './pages/organizer/MyTemples';
import SlotManager from './pages/organizer/SlotManager';
import BookingManager from './pages/organizer/BookingManager';
import OrganizerAnalytics from './pages/organizer/OrganizerAnalytics';
import DonationManager from './pages/organizer/DonationManager';
import OrganizerSettings from './pages/organizer/OrganizerSettings';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center font-poppins text-primary">ॐ Loading Temple...</div>;
    return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { loading, isAdmin } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center font-poppins text-primary">ॐ Preparing Records...</div>;
    return isAdmin ? children : <Navigate to="/" />;
};

const OrganizerRoute = ({ children }) => {
    const { loading, isOrganizer, isAuthorized } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center font-poppins text-primary">ॐ Preparing Temple...</div>;
    return isAuthorized ? children : <Navigate to="/" />;
};

function App() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/organizer');

    return (
        <div className="flex flex-col min-h-screen">
            {!isAdminPage && <Navbar />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/temples" element={<Temples />} />
                    <Route path="/temples/:id" element={<TempleDetail />} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/donations" element={
                        <ProtectedRoute>
                            <Donations />
                        </ProtectedRoute>
                    } />

                    {/* Dedicated Admin Routes */}
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminOverview />
                            </AdminLayout>
                        </AdminRoute>
                    } />
                    <Route path="/admin/users" element={
                        <AdminRoute>
                            <AdminLayout>
                                <UserManager />
                            </AdminLayout>
                        </AdminRoute>
                    } />
                    <Route path="/admin/temples" element={
                        <AdminRoute>
                            <AdminLayout>
                                <TempleManager />
                            </AdminLayout>
                        </AdminRoute>
                    } />
                    <Route path="/admin/organizers" element={
                        <AdminRoute>
                            <AdminLayout>
                                <OrganizerManager />
                            </AdminLayout>
                        </AdminRoute>
                    } />
                    <Route path="/admin/analytics" element={
                        <AdminRoute>
                            <AdminLayout>
                                <Analytics />
                            </AdminLayout>
                        </AdminRoute>
                    } />
                    <Route path="/admin/bookings" element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminBookings />
                            </AdminLayout>
                        </AdminRoute>
                    } />
                    <Route path="/admin/donations" element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminDonations />
                            </AdminLayout>
                        </AdminRoute>
                    } />
                    <Route path="/admin/settings" element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminSettings />
                            </AdminLayout>
                        </AdminRoute>
                    } />

                    {/* Dedicated Organizer Routes */}
                    <Route path="/organizer" element={
                        <OrganizerRoute>
                            <OrganizerLayout>
                                <OrganizerOverview />
                            </OrganizerLayout>
                        </OrganizerRoute>
                    } />
                    <Route path="/organizer/temples" element={
                        <OrganizerRoute>
                            <OrganizerLayout>
                                <MyTemples />
                            </OrganizerLayout>
                        </OrganizerRoute>
                    } />
                    <Route path="/organizer/slots" element={
                        <OrganizerRoute>
                            <OrganizerLayout>
                                <SlotManager />
                            </OrganizerLayout>
                        </OrganizerRoute>
                    } />
                    <Route path="/organizer/bookings" element={
                        <OrganizerRoute>
                            <OrganizerLayout>
                                <BookingManager />
                            </OrganizerLayout>
                        </OrganizerRoute>
                    } />
                    <Route path="/organizer/analytics" element={
                        <OrganizerRoute>
                            <OrganizerLayout>
                                <OrganizerAnalytics />
                            </OrganizerLayout>
                        </OrganizerRoute>
                    } />
                    <Route path="/organizer/donations" element={
                        <OrganizerRoute>
                            <OrganizerLayout>
                                <DonationManager />
                            </OrganizerLayout>
                        </OrganizerRoute>
                    } />
                    <Route path="/organizer/settings" element={
                        <OrganizerRoute>
                            <OrganizerLayout>
                                <OrganizerSettings />
                            </OrganizerLayout>
                        </OrganizerRoute>
                    } />
                </Routes>
            </main>
            {!isAdminPage && <Footer />}
        </div>
    );
}

export default App;
