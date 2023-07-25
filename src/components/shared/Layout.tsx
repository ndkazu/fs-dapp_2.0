import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideBar from './SideBar';

export function Layout() {
  return (
    <div className="flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden">
      <SideBar />
      <div className="flex-1">
        <Header />
        <div className="p-4">{<Outlet />}</div>
      </div>
    </div>
  );
}
