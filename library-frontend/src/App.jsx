import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MainPageAuthors from "./pages/MainPageAuthors";
import AuthorPage from "./pages/AuthorPage";
import BookPage from './pages/BookPage.jsx';
import ReadBookPage from "./pages/ReadBookPage.jsx";
import Register from "./components/Auth/Register.jsx";
import AuthWrapper from './components/Auth/AuthWrapper.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AuthorRegPage from './components/Auth/AuthorReg.jsx';

function App() {
  return (
    <BrowserRouter basename="/">
      <AuthWrapper>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/authors" element={<MainPageAuthors />}/>
          <Route path="/author/:author_slug/" element={<AuthorPage/>}/>
          <Route path="/book/:book_slug/" element={<BookPage/>}/>
          <Route path="/book/:book_slug/read" element={<ReadBookPage />} />
          <Route path="/reg/" element={<Register />} />
          <Route path="/profile/" element={<ProfilePage />} />
          <Route path="/AuthorReg/" element={<AuthorRegPage />} />
        </Routes>
      </AuthWrapper>
    </BrowserRouter>
  );
}

export default App;