import React, { lazy, useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer'
import AuthService from './services/auth.service'

const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const Splash = lazy(() => import('./pages/Splash'))
const CreateAccount = lazy(() => import('./pages/CreateAccount'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))

// client
const Home = lazy(() => import('./apps/client/pages/Home'))
const Tugas = lazy(() => import('./apps/client/pages/Tugas'))
const Profil = lazy(() => import('./apps/client/pages/Profil'))
const Game1 = lazy(() => import('./apps/client/pages/Game1'))
const Game2 = lazy(() => import('./apps/client/pages/Game2'))
const Game3 = lazy(() => import('./apps/client/pages/Game3'))

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      console.log(user);
      setCurrentUser(user);
    }
  }, []);

  const routesClient = [
    {
      path: '/home',
      component: Home
    },
    {
      path: '/tugas',
      component: Tugas
    },
    {
      path: '/profil',
      component: Profil
    },
    {
      path: '/game1',
      component: Game1
    },
    {
      path: '/game2',
      component: Game2
    },
    {
      path: '/game3',
      component: Game3
    }
  ];

  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <Route path="/splash" component={Splash} />
          <Route path="/login_admin" component={Login} />
          <Route path="/login_user" component={Login} />
          <Route path="/create-account" component={CreateAccount} />
          <Route path="/forgot-password" component={ForgotPassword} />

          {/* Routes for admin */}
          { currentUser && (<Route path="/app" component={Layout} />) }

          {/* Routes for Client */}
          { currentUser && 
          routesClient.map((route, i) => {
            return (
              <Route
                key={i}
                path={route.path}
                component={route.component}
              />
            )
          })}

          {/* If you have an index page, you can remothis Redirect */}
          <Redirect exact from="/" to="/splash" />
          <Route path="*" component={Login} />
        </Switch>
      </Router>
    </>
  )
}

export default App
