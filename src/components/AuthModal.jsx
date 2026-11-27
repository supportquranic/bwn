import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, CheckCircle2, KeyRound, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode === 'register' ? 'register' : 'signin'); // 'signin' | 'register'
  const [useOtpScreen, setUseOtpScreen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode === 'register' ? 'register' : 'signin');
      setUseOtpScreen(false);
      setError('');
      setIsSuccess(false);
      setOtp(['', '', '', '']);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    let interval = null;
    if (isCounting && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setIsCounting(false);
    }
    return () => clearInterval(interval);
  }, [isCounting, timer]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-11 digit Pakistani phone number (e.g. 0300 1234567)');
      return;
    }

    if (mode === 'register') {
      if (!firstName.trim()) {
        setError('Please enter your first name');
        return;
      }
      if (!password.trim() || password.length < 4) {
        setError('Please enter a password with at least 4 characters');
        return;
      }
    } else {
      if (!password.trim()) {
        setError('Please enter your password');
        return;
      }
    }

    completeAuth(resolveUserName(cleanPhone));
  };

  const resolveUserName = (cleanPhone) => {
    if (mode === 'register') {
      const full = `${firstName.trim()} ${lastName.trim()}`.trim();
      return full || 'Bahawal Customer';
    }
    return cleanPhone.includes('300') ? 'Muhammad Tariq' : 'Local Shopper';
  };

  const completeAuth = (resolvedName) => {
    setError('');
    setIsSuccess(true);

    const formattedPhone = phone.startsWith('0') 
      ? `+92 ${phone.slice(1, 4)} ${phone.slice(4)}` 
      : phone;

    const userData = {
      id: `user-${Date.now()}`,
      name: resolvedName,
      phone: formattedPhone || '+92 300 1234567',
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onLoginSuccess(userData);
      onClose();
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    completeAuth('Google User');
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 4) {
      setError('Please enter the 4-digit code');
      return;
    }
    completeAuth(resolveUserName(phone.replace(/\D/g, '')));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[370px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Solid Brand Purple Header (Bahawal Market Identity) ── */}
        <div 
          className="relative px-6 pt-6 pb-6 text-white text-center flex-shrink-0"
          style={{ background: '#8586f2' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-white transition-colors"
            title="Close"
          >
            <X size={17} />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold mb-2">
            <Sparkles size={12} />
            Bahawal Market
          </div>

          <h2 className="text-2xl font-black text-white leading-tight">
            {mode === 'register' ? 'Create an Account' : 'Log in to Account'}
          </h2>
          <p className="text-white/80 text-xs mt-1">
            Bahawalnagar, Pakistan
          </p>
        </div>

        {/* ── Form Body ── */}
        <div className="p-6">
          {error && (
            <div className="mb-3.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold leading-snug">
              {error}
            </div>
          )}

          {isSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-base font-black text-black">
                {mode === 'register' ? 'Account Created!' : 'Logged In!'}
              </h3>
              <p className="text-xs text-gray-500">
                Welcome to Bahawal Market.
              </p>
            </div>
          ) : useOtpScreen ? (
            /* OTP Screen */
            <form onSubmit={handleVerifyOtp} className="space-y-3.5 py-1">
              <div className="text-center">
                <p className="text-xs text-gray-500">Enter 4-digit code sent to</p>
                <p className="text-xs font-bold text-black mt-0.5">{phone || 'your phone'}</p>
              </div>

              <div className="flex justify-center gap-2.5 my-2">
                {otp.map((d, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 text-center text-xl font-black rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#8586f2] focus:ring-1 focus:ring-[#8586f2] transition-all"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setOtp(['1', '2', '3', '4'])}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8586f2]/15 text-[#8586f2] text-[11px] font-bold"
                >
                  <KeyRound size={12} />
                  Demo: Auto-fill OTP 1234
                </button>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 bg-[#8586f2] hover:bg-[#7375e8] active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all shadow-xs"
              >
                Verify & Continue
              </button>

              <button
                type="button"
                onClick={() => setUseOtpScreen(false)}
                className="w-full text-center text-xs text-gray-500 hover:text-black mt-1"
              >
                Back to password login
              </button>
            </form>
          ) : (
            /* Main Form */
            <div>
              {/* Sign in with Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-[0.99] flex items-center justify-center gap-2.5 transition-all text-xs font-bold text-gray-700 shadow-2xs"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google</span>
              </button>

              {/* "or" Divider */}
              <div className="text-center text-xs font-semibold text-gray-400 my-3 select-none">
                or
              </div>

              {/* Form inputs */}
              <form onSubmit={handleSubmit} className="space-y-2.5">
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-all"
                    />
                  </div>
                )}

                {/* Phone Number Field */}
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Phone Number (e.g. 0300 1234567)"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-all"
                  />
                </div>

                {/* Password Field with Eye Toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Light Brand Purple Action Button */}
                <button
                  type="submit"
                  className="w-full mt-1.5 py-3.5 bg-[#8586f2] hover:bg-[#7375e8] active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all shadow-xs"
                >
                  {mode === 'register' ? 'Create Account' : 'Log In'}
                </button>
              </form>

              {/* Quick OTP Alternative Link */}
              <div className="text-center mt-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setUseOtpScreen(true);
                    setTimer(30);
                    setIsCounting(true);
                    setError('');
                  }}
                  className="text-[11px] text-[#8586f2] font-bold hover:underline"
                >
                  Or sign in with 4-digit SMS OTP
                </button>
              </div>

              {/* Terms of Service Notice */}
              <p className="text-[10px] text-center text-gray-500 leading-relaxed px-1 mt-3">
                Signing up for a Bahawal Market account means you agree to the{' '}
                <span className="underline font-semibold cursor-pointer text-gray-700">Privacy Policy</span> and{' '}
                <span className="underline font-semibold cursor-pointer text-gray-700">Terms of Service</span>.
              </p>

              {/* Bottom Switch Link */}
              <div className="mt-3 pt-2 border-t border-gray-100 text-center text-xs font-medium text-gray-700">
                {mode === 'register' ? (
                  <>
                    Have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('signin'); setError(''); }}
                      className="font-bold text-[#8586f2] hover:underline"
                    >
                      Log in here
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('register'); setError(''); }}
                      className="font-bold text-[#8586f2] hover:underline"
                    >
                      Sign up here
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
