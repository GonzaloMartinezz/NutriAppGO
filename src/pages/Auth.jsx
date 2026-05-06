import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Utensils, Mail, Lock, User, FileText, BookOpen, AlertCircle, Eye, EyeOff } from 'lucide-react';
import '../styles/auth.css';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Login form
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Register form
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'Estudiante',
    matricula: '',
    especializacion: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!loginData.email || !loginData.password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    const result = login(loginData.email, loginData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!registerData.email || !registerData.password || !registerData.fullName) {
      setError('Por favor completa todos los campos obligatorios');
      setLoading(false);
      return;
    }

    if (registerData.role === 'Nutricionista' && (!registerData.matricula || !registerData.especializacion)) {
      setError('Como nutricionista debes adjuntar matrícula y especialización');
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const result = register(
      registerData.email,
      registerData.password,
      registerData.fullName,
      registerData.role,
      registerData.matricula,
      registerData.especializacion
    );

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-logo-icon">
            <Utensils size={32} strokeWidth={2.5} />
          </div>
          <h1>NutriApp</h1>
          <p>Plataforma Profesional de Nutrición</p>
        </div>

        {/* Form Container */}
        <div className="auth-form-container">
          {isLogin ? (
            <>
              <h2 className="auth-title">Inicia sesión</h2>
              <p className="auth-subtitle">Accede a tu cuenta profesional</p>

              {error && (
                <div className="auth-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email-login">Email</label>
                  <div className="input-icon">
                    <Mail size={18} />
                    <input
                      id="email-login"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password-login">Contraseña</label>
                  <div className="input-icon">
                    <Lock size={18} />
                    <input
                      id="password-login"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Inicia sesión'}
                </button>
              </form>

              <div className="auth-divider">
                <span>¿No tienes cuenta?</span>
              </div>

              <button
                type="button"
                className="auth-toggle-button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                  setLoginData({ email: '', password: '' });
                  setShowPassword(false);
                }}
              >
                Crear nueva cuenta
              </button>
            </>
          ) : (
            <>
              <h2 className="auth-title">Crea tu cuenta</h2>
              <p className="auth-subtitle">Regístrate como profesional</p>

              {error && (
                <div className="auth-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="auth-form">
                <div className="form-group">
                  <label htmlFor="fullname">Nombre Completo</label>
                  <div className="input-icon">
                    <User size={18} />
                    <input
                      id="fullname"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="role">Tipo de cuenta</label>
                  <select
                    id="role"
                    className="form-select"
                    value={registerData.role}
                    onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                  >
                    <option value="Estudiante">Estudiante</option>
                    <option value="Nutricionista">Nutricionista</option>
                  </select>
                </div>

                {registerData.role === 'Nutricionista' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="matricula">Matrícula Profesional *</label>
                      <div className="input-icon">
                        <FileText size={18} />
                        <input
                          id="matricula"
                          type="text"
                          placeholder="NUT-12345"
                          value={registerData.matricula}
                          onChange={(e) => setRegisterData({ ...registerData, matricula: e.target.value })}
                          required
                        />
                      </div>
                      <small className="help-text">
                        Ej: NUT-12345 (con NUT al inicio para acceso de admin)
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="especializacion">Especialización *</label>
                      <div className="input-icon">
                        <BookOpen size={18} />
                        <input
                          id="especializacion"
                          type="text"
                          placeholder="Nutrición Deportiva"
                          value={registerData.especializacion}
                          onChange={(e) => setRegisterData({ ...registerData, especializacion: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label htmlFor="email-register">Email</label>
                  <div className="input-icon">
                    <Mail size={18} />
                    <input
                      id="email-register"
                      type="email"
                      placeholder="tu@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password-register">Contraseña</label>
                  <div className="input-icon">
                    <Lock size={18} />
                    <input
                      id="password-register"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">Confirmar contraseña</label>
                  <div className="input-icon">
                    <Lock size={18} />
                    <input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>

              <div className="auth-divider">
                <span>¿Ya tienes cuenta?</span>
              </div>

              <button
                type="button"
                className="auth-toggle-button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                  setRegisterData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    fullName: '',
                    role: 'Estudiante',
                    matricula: '',
                    especializacion: ''
                  });
                }}
              >
                Inicia sesión
              </button>
            </>
          )}
        </div>

        <div className="auth-footer">
          <p>NutriApp © 2026 - Plataforma Profesional</p>
        </div>
      </div>
    </div>
  );
}
