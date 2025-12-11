import axios from "axios"
import React, { Component } from 'react';
import {BrowserRouter, Route, Routes, useRoutes} from "react-router-dom"
import MainPage from "./pages/MainPage";
import MainPageAuthors from "./pages/MainPageAuthors";

function App() {

  return(

    <BrowserRouter basename="/">
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/authors" element={<MainPageAuthors />}/>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App