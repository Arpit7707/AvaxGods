import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OnboardModal } from './components';
import {Home, CreateBattle, JoinBattle, Battle, Battleground} from './page';
import { GlobalContextProvider } from './context';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  {/* wrapping entire application in GlobalContextProvider */}
  {/* <Home /> and <CreateBattle /> will get passed as children in GlobalContextProvider function in context/index.jsx*/}
  <GlobalContextProvider>
  <OnboardModal />
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-battle" element={<CreateBattle />} />
        <Route path="/join-battle" element={<JoinBattle />} />
        {/* battleName parameter is going to be dynamic coz it is URL parameter*/}
        {/* battleName is passed in CreateEventisteners.js*/}
        <Route path="/battle/:battleName" element={<Battle />} />
        <Route path="/battleground" element={<Battleground />} />
      </Routes>
  </GlobalContextProvider>
   
  </BrowserRouter>,
);
