import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import setAuthToken from './util/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import Profiles from './components/profiles/Profiles';
import AddEducation from './components/profile-forms/AddEducation';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';
// Rdux
import { Provider } from 'react-redux';
import store from './store';

import { loadUser } from './actions/auth';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => { 
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  
  return(
  <Provider store={store}>
    <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Landing />} />
        </Routes>
        <section className='container'>
          <Alert />
            <Routes>
              <Route path='register' element={<Register />} />
              <Route path='login' element={<Login />} />
              <Route path='profiles' element={<Profiles />} />
              <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route path="/create-profile" element={<CreateProfile />} />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route path="/edit-profile" element={<EditProfile />} />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route path="/add-experience" element={<AddExperience />} />
              </Route>
              <Route element={<PrivateRoute />}>
                  <Route path="/add-education" element={<AddEducation />} />
              </Route>
              {/* <Route path='dashboard' element={<PrivateRoute> <Dashboard /> </PrivateRoute>} /> */}
            </Routes>
        </section>
    </Router>
  </Provider>
)};

export default App;
