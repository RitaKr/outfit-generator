import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import reportWebVitals from './reportWebVitals';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Homepage from './pages/Homepage';
import Contacts from './pages/Contacts';
import Closet from './pages/Closet';
import Login from './pages/Login';
import Collections from './pages/Collections';
const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Login isSignUp={false}/>
    ),
  },
  {
    path: "/signup",
    element: (
      <Login isSignUp={true}/>
    ),
  },
  {
    path: "/",
    element: (
      <Homepage/>
    ),
  },
  {
    path: "/contacts",
    element: <Contacts/>,
  },
  {
    path: "/closet",
    element: <Closet/>,
  },
  {
    path: "/winter-collection",
    element: <Collections name="Winter"/>,
  },
  {
    path: "/spring-collection",
    element: <Collections name="Spring"/>,
  },
  {
    path: "/summer-collection",
    element: <Collections name="Summer"/>,
  },
  {
    path: "/autumn-collection",
    element: <Collections name="Autumn"/>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
