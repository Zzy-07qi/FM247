import React from 'react';
import Sidebar from './components/Sidebar';
import BookList from './components/BookList';
import Pagination from './components/BookBorrowUI';
import './App.css';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import { useState } from 'react';
import BookBorrowUI from './components/BookBorrowUI';
import ErrorBoundary from './ErrorBoundary';

const App = () => {
  const [activeModule, setActiveModule] = useState('regis');
  const location = useLocation()

  return (
    <>
      <div className="container">
        <aside className="sidebar">
          <ul className="menu">
            <Link to="/">   <li className={location.pathname === '/' ? 'active' : ''}>

              <span onClick={() => setActiveModule('regis')}>登录</span>

            </li></Link>
            {/* 读者借阅模块 */}
            <Link to="/bookborrowui"><li className={location.pathname === '/bookborrowui' ? 'active' : ''}>

              <span onClick={() => setActiveModule('borrow')}>读者借阅</span>

            </li></Link>

            {/* 管理员图书管理模块 */}
            <Link to="/booklist"><li className={location.pathname === '/booklist' ? 'active' : ''}>    <span onClick={() => setActiveModule('book')}>图书管理</span>

            </li></Link>



          </ul>
        </aside>
        <Routes>   <Route path="/" element={<AuthForm />}>
        </Route>
          <Route path="/booklist" element={<ErrorBoundary><BookList /></ErrorBoundary>}>
          </Route>
          <Route path="/bookborrowui" element={<BookBorrowUI />}>
          </Route>

        </Routes>
        {/* <Sidebar /> */}
        <main className="main-content">
          {/* <SearchBar /> */}

        </main>
      </div>
    </>
  );
};

export default App;