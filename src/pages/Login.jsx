import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate("/panel");
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-navy via-navy-dark to-[#0a1535] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="/assets/logo.jpeg"
              alt="ANADED"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-xl"
            />
          </Link>
          <h1 className="text-2xl font-bold text-white">Üye Girişi</h1>
          <p className="text-white/60 text-sm mt-2">
            ANADED üye panelinize giriş yapın
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-50 border border-red-200 text-brand-red text-sm px-4 py-3 rounded-lg mb-5 flex items-center gap-2">
              <FaInfoCircle className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-navy font-medium text-sm mb-1.5"
              >
                E-posta
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-lg text-sm focus:border-sky focus:outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-navy font-medium text-sm mb-1.5"
              >
                Şifre
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifreniz"
                  required
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-100 rounded-lg text-sm focus:border-sky focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition cursor-pointer"
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="accent-navy w-4 h-4" />
                Beni hatırla
              </label>
              <a href="#" className="text-brand-red hover:underline font-medium">
                Şifremi unuttum
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-red text-white rounded-lg font-semibold text-sm hover:bg-brand-red-dark transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Giriş yapılıyor...
                </span>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">veya</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Register CTA */}
          <div className="text-center text-sm text-gray-500">
            Henüz üye değil misiniz?{" "}
            <Link
              to="/#iletisim"
              className="text-navy font-semibold hover:text-brand-red transition"
            >
              Başvuru Yapın
            </Link>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-5 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
          <p className="text-white/70 text-xs text-center mb-2 font-medium">
            Demo Giriş Bilgileri
          </p>
          <div className="text-sky text-xs text-center space-y-0.5 font-mono">
            <p>E-posta: uye@anaded.com</p>
            <p>Şifre: anaded2021</p>
          </div>
        </div>
      </div>
    </div>
  );
}
