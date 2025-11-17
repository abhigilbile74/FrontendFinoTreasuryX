import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../store/slices/authSlice';
import Main_content from '../components/Main_content';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await dispatch(loginUser(formData)).unwrap();
      navigate('/');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid credentials. Please try again.');
    }
  };


  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      
      <Main_content/>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-900 lg:w-1/2 p-4 md:p-8 shadow-inner">
        <div className="w-full max-w-md bg-gray-50 dark:bg-gray-800 rounded-2xl shadow p-4 md:p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-6">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
           {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                UserName
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-emerald-500 hover:underline">
            Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


export default Login;




