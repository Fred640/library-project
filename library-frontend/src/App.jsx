import axios from "axios"
import React, { Component } from 'react';
import {BrowserRouter, Route, Routes, useRoutes} from "react-router-dom"
import MainPage from "./pages/MainPage";
import GenreFilterPage from "./pages/GenreFilterPage";
import MyShellPage from "./pages/MyShellPage";
import ProfilePage from "./pages/ProfilePage";
function App() {

  return(

    <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/GenresFilter" element={<GenreFilterPage/>}/>
      <Route path="/MyShell" element={<MyShellPage/>}/>
      <Route path="/Profile" element={<ProfilePage />}/>

      

    </Routes>
      
    </BrowserRouter>
    
  )
}

export default App