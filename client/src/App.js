import React from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import Products_IGA from './pages/IGA';
import Products_ALDI from './pages/ALDI';

function App(){
    return (
      <BrowserRouter>
        <Routes >
          <Route path='/iga' element={<Products_IGA/>} />
          <Route path='/aldi' element={<Products_ALDI/>} />
        </Routes>
      </BrowserRouter>
    )
  }

export default App;