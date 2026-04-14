import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/ui/ScrollToTop";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/giris" element={<Login />} />
          <Route path="/panel" element={<Dashboard />} />
          <Route path="/duyurular" element={<Announcements />} />
        </Routes>
        <Footer />
        <ScrollToTop />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
