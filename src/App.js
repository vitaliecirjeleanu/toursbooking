import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import { useAuth } from './shared/hooks/auth-hook';
import { AuthContext } from './shared/context/auth-context';
import MainHeader from './shared/components/Navigation/MainHeader';
import Footer from './shared/components/UIElements/Footer';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const ToursPage = React.lazy(() => import('./tours/pages/ToursPage'));
const TourPage = React.lazy(() => import('./tours/pages/TourPge'));
const NewTourPage = React.lazy(() => import('./tours/pages/NewTourPage'));
const UpdateTourPage = React.lazy(() => import('./tours/pages/UpdateTourPage'));
const SignupPage = React.lazy(() => import('./users/pages/SignupPage'));
const LoginPage = React.lazy(() => import('./users/pages/LoginPage'));
const UserPage = React.lazy(() => import('./users/pages/UserPage'));

function App() {
  const { jwt, userData, login, logout } = useAuth();

  const routes = (
    <Switch>
      <Route path="/" exact>
        <ToursPage />
      </Route>
      <Route path="/tour/:slug" exact>
        <TourPage />
      </Route>
      {jwt && (userData.role === 'admin' || userData.role === 'lead-guide') && (
        <Route path="/new-tour" exact>
          <NewTourPage />
        </Route>
      )}
      {jwt && (userData.role === 'admin' || userData.role === 'lead-guide') && (
        <Route path="/tour/update/:slug" exact>
          <UpdateTourPage />
        </Route>
      )}

      {jwt && (
        <Route path="/me" exact>
          <UserPage />
        </Route>
      )}
      <Route path="/signup" exact>
        <SignupPage />
      </Route>
      <Route path="/login" exact>
        <LoginPage />
      </Route>
      {(!localStorage.getItem('userData') ||
        (localStorage.getItem('userData') && jwt)) && <Redirect to="/" />}
    </Switch>
  );

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!jwt, jwt, userData, login, logout }}
    >
      <Router>
        <MainHeader />
        <Suspense fallback={<LoadingSpinner />}>{routes}</Suspense>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
