import React, { lazy, Suspense } from "react";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage.jsx";
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const ResumeBuilder = lazy(() => import('./pages/Pdf.jsx'))
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoute/Protected.jsx";
// import Footer from "./components/Footer.jsx";

function App() {

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />
          <Route element={<ProtectedRoute> <Suspense fallback={<div style={{ textAlign: 'center', fontWeight: '900' }}>Loading.... ResumeBuilder</div>}><ResumeBuilder /></Suspense></ProtectedRoute>} path="/resumebuilder" />
          <Route element={<ProtectedRoute>
            <Suspense fallback={<div style={{ textAlign: 'center', fontWeight: '900' }}>Loading.... Cvs</div>} >
              <Dashboard />
            </Suspense>
          </ProtectedRoute>} path="/" index />

        </Routes>
        {/* <Footer/> */}
      </BrowserRouter>
    </>
  )
}

export default App
