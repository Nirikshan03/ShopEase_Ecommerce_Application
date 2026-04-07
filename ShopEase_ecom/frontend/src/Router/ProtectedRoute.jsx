import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

// BUG FIX: was checking 'adminid' key but login now stores role
// Now checks jwtToken + role for proper role-based routing
export const Privateroute = () => {
  const token = localStorage.getItem('jwtToken');
  const userid = localStorage.getItem('userid');
  return (token && userid) ? <Outlet /> : <Navigate to="/login" replace />;
};

export const Privaterouteadmin = () => {
  const token = localStorage.getItem('jwtToken');
  const role = localStorage.getItem('role');
  const adminid = localStorage.getItem('adminid');
  // Accept either role=ROLE_ADMIN OR legacy adminid key
  return (token && (role === 'ROLE_ADMIN' || adminid))
    ? <Outlet />
    : <Navigate to="/admin-login" replace />;
};
