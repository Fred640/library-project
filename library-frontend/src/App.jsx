import axios from "axios"
import React, { Component } from 'react';
import {BrowserRouter, Route, Routes, useRoutes} from "react-router-dom"
import MainPage from "./pages/MainPage";
import MainPageAuthors from "./pages/MainPageAuthors";
import AuthorPage from "./pages/AuthorPage";

function App() {

  return(

    <BrowserRouter basename="/">
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/authors" element={<MainPageAuthors />}/>
      <Route path="/author/:author_slug/" element={<AuthorPage/>}/>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App