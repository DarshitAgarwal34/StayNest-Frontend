import { createBrowserRouter, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import SectionPage from './components/SectionPage';
import MainLayout from './layouts/MainLayout';
import AddPropertyPage from './pages/AddPropertyPage';
import AddServicePage from './pages/AddServicePage';

// Pages
import AboutPage from './pages/AboutPage';
import CommunityPage from './pages/CommunityPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPropertiesPage from './pages/MyPropertiesPage';
import MyServicesPage from './pages/MyServicesPage';
import NeedHelpPage from './pages/NeedHelpPage';
import NotificationsPage from './pages/NotificationsPage';
import PropertiesPage from './pages/PropertiesPage';
import ProfilePage from './pages/ProfilePage';
import ServicesPage from './pages/ServicesPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminListingsPage from './pages/admin/AdminListingsPage';
import AdminPostsPage from './pages/admin/AdminPostsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

// 🔥 NEW ROLE AUTH PAGES
import LoginStudent from './pages/auth/LoginStudent';
import LoginRenter from './pages/auth/LoginRenter';
import LoginService from './pages/auth/LoginService';
import LoginAdmin from './pages/auth/LoginAdmin';

import SignupStudent from './pages/auth/SignupStudent';
import SignupRenter from './pages/auth/SignupRenter';
import SignupService from './pages/auth/SignupService';
import SignupAdmin from './pages/auth/SignupAdmin';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // 🌍 PUBLIC
      { index: true, element: <HomePage /> },
      { path: 'properties', element: <PropertiesPage /> },
      {
        path: 'services',
        element: (
          <ProtectedRoute allowedRoles={['student', 'renter', 'service_provider', 'admin']}>
            <ServicesPage />
          </ProtectedRoute>
        ),
      },
      { path: 'community', element: <CommunityPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'need-help', element: <NeedHelpPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },

      // 🔐 ROLE LOGIN
      { path: 'login/student', element: <LoginStudent /> },
      { path: 'login/renter', element: <LoginRenter /> },
      { path: 'login/service-provider', element: <LoginService /> },
      { path: 'login/admin', element: <LoginAdmin /> },

      // 🔐 ROLE SIGNUP
      { path: 'signup/student', element: <SignupStudent /> },
      { path: 'signup/renter', element: <SignupRenter /> },
      { path: 'signup/service-provider', element: <SignupService /> },
      { path: 'signup/admin', element: <SignupAdmin /> },

      // 🔐 PROTECTED
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/:role',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-properties',
        element: (
          <ProtectedRoute>
            <MyPropertiesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-services',
        element: (
          <ProtectedRoute allowedRoles={['service_provider', 'admin']}>
            <MyServicesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      { path: 'admin', element: <Navigate to="/admin/dashboard" replace /> },
      {
        path: 'properties/new',
        element: (
          <ProtectedRoute allowedRoles={['renter', 'admin']}>
            <AddPropertyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'properties/requests',
        element: (
          <ProtectedRoute allowedRoles={['renter', 'admin']}>
            <SectionPage
              title="Property Requests"
              description="Review incoming inquiries and request activity for your listings."
              points={[
                { title: 'Request inbox', text: 'Track who is asking about which property.', label: 'Requests' },
                { title: 'Reply actions', text: 'Keep response workflows simple and visible.', label: 'Ops' },
              ]}
            />
          </ProtectedRoute>
        ),
      },
      {
        path: 'properties/summary',
        element: (
          <ProtectedRoute allowedRoles={['renter', 'admin']}>
            <SectionPage
              title="Total Listings"
              description="A summary view for the number of active and archived listings."
              points={[
                { title: 'Listings overview', text: 'Surface a quick total count and active status.', label: 'Metrics' },
              ]}
            />
          </ProtectedRoute>
        ),
      },
      {
        path: 'properties/tenants',
        element: (
          <ProtectedRoute allowedRoles={['renter', 'admin']}>
            <SectionPage
              title="Active Tenants"
              description="Monitor who is actively staying in or engaged with your properties."
              points={[
                { title: 'Tenant board', text: 'Show active occupants and their current status.', label: 'People' },
              ]}
            />
          </ProtectedRoute>
        ),
      },
      {
        path: 'services/new',
        element: (
          <ProtectedRoute allowedRoles={['service_provider', 'admin']}>
            <AddServicePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'services/holders',
        element: (
          <ProtectedRoute allowedRoles={['service_provider', 'admin']}>
            <SectionPage
              title="Active Service Holders"
              description="Track the people currently using or requesting your services."
              points={[
                { title: 'Live users', text: 'See active service holders in one place.', label: 'Usage' },
              ]}
            />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/listings',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminListingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/posts',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPostsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/reports',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/students',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/services',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminListingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/moderation',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPostsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/fake-posts',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPostsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/complaints',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/renters',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },

      // ❌ FALLBACK
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
