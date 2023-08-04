import React from 'react';
import { NavLink } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <NavLink to="dashboard">Go to Dashboard</NavLink>
    </div>
  );
}

export default HomePage;
