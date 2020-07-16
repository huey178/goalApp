import React, { Fragment, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import Register from "./components/layout/auth/Register";
import Login from "./components/layout/auth/Login";
import Alert from "./components/layout/Alert";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/Auth";
import PrivateRoute from "./components/layout/routing/PrivateRoute";
import Home from "./components/layout/HomePage/Home";
import Profile from "./components/layout/ProfilePage/Profile/Profile";
import MyProfile from "./components/layout/ProfilePage/MyProfile/MyProfile";
import SearchPage from "./components/layout/SearchPage/SearchPage";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />

          <section className='container p-0'>
            <Alert />
            <Switch>
              <Route exact path='/' component={Landing} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <PrivateRoute exact path='/home' component={Home} />
              <PrivateRoute exact path='/profile/:id' component={Profile} />
              <PrivateRoute exact path='/profile' component={MyProfile} />
              <PrivateRoute exact path='/search' component={SearchPage} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
