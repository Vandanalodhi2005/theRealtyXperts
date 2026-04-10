import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginAdmin, clearError } from '../../store/slices/authSlice';
import { HiLockClosed, HiUser, HiShieldCheck } from 'react-icons/hi';

const AdminLogin = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(loginAdmin(credentials));
    if (loginAdmin.fulfilled.match(result)) {
      if (result.payload.token) {
        localStorage.setItem('adminToken', result.payload.token);
      }
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#001529] relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-md w-full relative z-10 animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/20 mb-6 group hover:scale-110 transition-transform duration-500">
             <HiShieldCheck size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Command Center</h2>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] opacity-80">The Realty Xperts • Internal Access Only</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Identity Identifier</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <HiUser className="h-5 w-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="block w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-bold text-sm outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    placeholder="Enter user identity"
                    value={credentials.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Security Keyphrase</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-bold text-sm outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    placeholder="Enter clearance key"
                    value={credentials.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 animate-shake">
                <p className="text-xs font-black text-rose-400 text-center uppercase tracking-widest">Protocol Failure: {error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group/btn"
            >
               <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-xl group-hover/btn:blur-2xl opacity-20 transition-all"></div>
               <div className="relative flex items-center justify-center w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-[0.98] transition-all">
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    'Initiate Access'
                  )}
               </div>
            </button>
          </form>

          {/* System Footer info */}
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">System Entropy: Nominal • Secure Channel Established</p>
          </div>
        </div>

        {/* Demo Credentials Reveal */}
        <div className="mt-10 text-center opacity-40 hover:opacity-100 transition-opacity duration-700">
           <div className="inline-flex items-center gap-6 px-8 py-3 bg-white/3 border border-white/5 rounded-full">
              <span className="text-[10px] font-mono text-blue-400"><strong>U:</strong> admin</span>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span className="text-[10px] font-mono text-blue-400"><strong>P:</strong> admin123</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;