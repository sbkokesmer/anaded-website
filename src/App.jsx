import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ContactProvider } from "./context/ContactContext";
import { NotificationProvider } from "./context/NotificationContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/ui/ScrollToTop";
import ScrollToTopOnNavigate from "./components/ui/ScrollToTopOnNavigate";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";
import Activities from "./pages/Activities";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import DuesPage from "./pages/DuesPage";

function App() {
  return (
    <AuthProvider>
      <ContactProvider>
        <NotificationProvider>
        <BrowserRouter>
          <ScrollToTopOnNavigate />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/giris" element={<Login />} />
            <Route path="/panel" element={<Dashboard />} />
            <Route path="/duyurular" element={<Announcements />} />
            <Route path="/faaliyetler" element={<Activities />} />
            <Route path="/hakkimizda" element={<AboutPage />} />
            <Route path="/hizmetler" element={<ServicesPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/aidat-takibi" element={<DuesPage />} />
          </Routes>
          <Footer />
          <ScrollToTop />
        </BrowserRouter>
        </NotificationProvider>
      </ContactProvider>
    </AuthProvider>
  );
}

export default App;
