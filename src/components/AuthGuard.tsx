import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Check if user is already authenticated
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Use our edge function for auto-confirmed registration
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auto-confirm-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Помилка реєстрації');
        }
        
        setError('✅ Акаунт створено та підтверджено! Тепер можете увійти.');
        setIsSignUp(false); // Переключаємо на форму входу
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      let errorMessage = 'Помилка аутентифікації';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Невірний email або пароль';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = '⚠️ Акаунт не активований. Для активації зверніться до розробника або адміністратора сайту.';
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'Користувач вже зареєстрований. Спробуйте увійти.';
      } else if (error.message.includes('email_address_invalid')) {
        errorMessage = 'Введіть дійсний email адрес (наприклад: yourname@gmail.com)';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return (
      <div>
        <div className="fixed top-20 right-4 z-50">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
          >
            Вийти
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Доступ до адмін панелі
            </h1>
            <p className="text-gray-400">
              Увійдіть для управління контентом
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="admin@domain.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className={`border rounded-lg p-3 ${
                error.startsWith('✅') 
                  ? 'bg-green-600/20 border-green-600/30' 
                  : 'bg-red-600/20 border-red-600/30'
              }`}>
                <p className={`text-sm ${
                  error.startsWith('✅') ? 'text-green-300' : 'text-red-300'
                }`}>{error}</p>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isSignUp ? 'Реєстрація...' : 'Вхід...'}</span>
                </div>
              ) : (
                <span>{isSignUp ? 'Зареєструватися' : 'Увійти'}</span>
              )}
            </motion.button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                {isSignUp ? 'Вже маєте акаунт? Увійти' : 'Немає акаунту? Зареєструватися'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-600/30">
            <div className="space-y-3">
              <div className="bg-amber-600/20 border border-amber-600/30 rounded-lg p-3">
                <p className="text-xs text-amber-300 text-center">
                  <strong>⚠️ Перший вхід:</strong><br/>
                  1. Натисніть "Зареєструватися"<br/>
                  2. Після реєстрації натисніть "Увійти"<br/>
                  3. При помилці "не активований" - зверніться до розробника
                </p>
              </div>
              <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3">
                <p className="text-xs text-blue-300 text-center">
                  <strong>💡 Використовуйте реальний email:</strong><br/>
                  Наприклад: yourname@gmail.com<br/>
                  Пароль: admin123
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}