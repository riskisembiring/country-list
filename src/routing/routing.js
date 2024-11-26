import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListCountry from '../pages/ListCountry';
import ListDetail from '../pages/ListDetail';

const Routing = () => (
  <Router>
    <Routes>
      <Route path="/" element={<ListCountry />} />
      <Route path="/detail" element={<ListDetail />} />
    </Routes>
  </Router>
);

export default Routing;
