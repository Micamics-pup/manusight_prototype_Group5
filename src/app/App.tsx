import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { NewAuthorDashboard } from './components/dashboards/NewAuthorDashboard';
import { NewEditorDashboard } from './components/dashboards/NewEditorDashboard';
import { EditorInChiefDashboard } from './components/dashboards/EditorInChiefDashboard';
import { ReviewerDashboard } from './components/dashboards/ReviewerDashboard';
import { LayoutArtistDashboard } from './components/dashboards/LayoutArtistDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { TWGCoordinatorDashboard } from './components/dashboards/TWGCoordinatorDashboard';
import { TWGMemberDashboard } from './components/dashboards/TWGMemberDashboard';
import { TWGCopyeditorDashboard } from './components/dashboards/TWGCopyeditorDashboard';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';

function DashboardRouter() {
  const { currentUser, loginWithEmail, signup, logout } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (!currentUser) {
    if (showSignup) {
      return (
        <SignupPage
          onSignup={(name: string, email: string, password: string) => {
            const success = signup(name, email, password);
            if (!success) {
              alert('Email already exists. Please use a different email or login.');
            }
          }}
          onSwitchToLogin={() => setShowSignup(false)}
        />
      );
    }

    return (
      <LoginPage
        onLogin={(email: string, password: string) => {
          const success = loginWithEmail(email, password);
          if (!success) {
            alert('Invalid email or password. Use demo123 as password for existing users.');
          }
        }}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  // Author, Editor, Editor-in-Chief, and TWG Coordinator dashboards have their own layouts
  if (currentUser.role === 'author') {
    return <NewAuthorDashboard />;
  }

  if (currentUser.role === 'editor') {
    return <NewEditorDashboard />;
  }

  if (currentUser.role === 'editor_in_chief') {
    return <EditorInChiefDashboard />;
  }

  if (currentUser.role === 'twg_coordinator') {
    return <TWGCoordinatorDashboard />;
  }

  // TWG Copyeditor has special dashboard
  if (currentUser.role === 'twg_copyeditor') {
    return <TWGCopyeditorDashboard />;
  }

  // Other TWG Member roles
  if (
    currentUser.role === 'twg_layout' ||
    currentUser.role === 'twg_production_coordinator' ||
    currentUser.role === 'twg_print_coordinator' ||
    currentUser.role === 'twg_distribution'
  ) {
    return <TWGMemberDashboard />;
  }

  // Other roles with Layout wrapper
  const dashboardComponents: Record<string, React.ComponentType> = {
    reviewer: ReviewerDashboard,
    layout_artist: LayoutArtistDashboard,
    admin: AdminDashboard,
  };

  const DashboardComponent = dashboardComponents[currentUser.role];

  if (!DashboardComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Not Found</h1>
          <p className="text-gray-600">Role: {currentUser.role}</p>
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <DashboardComponent />
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <DashboardRouter />
      </DataProvider>
    </AuthProvider>
  );
}
