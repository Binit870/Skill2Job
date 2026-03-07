// import { useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const Login = () => {
//   const { login, user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const loggedInUser = await login(
//         form.email,
//         form.password
//       );

//       toast.success("Login successful!");

//       if (loggedInUser.role === "recruiter") {
//         navigate("/recruiter-dashboard");
//       } else {
//         navigate("/student-dashboard");
//       }

//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Invalid credentials"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
//       <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
//           Welcome Back
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">

//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               required
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="Enter your email"
//               onChange={(e) =>
//                 setForm({ ...form, email: e.target.value })
//               }
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               required
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="Enter your password"
//               onChange={(e) =>
//                 setForm({ ...form, password: e.target.value })
//               }
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold disabled:opacity-50"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="text-sm text-center text-gray-500 mt-6">
//           Don’t have an account?{" "}
//           <span
//             onClick={() => navigate("/signup")}
//             className="text-indigo-600 cursor-pointer hover:underline"
//           >
//             Sign up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaBriefcase } from "react-icons/fa";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const loggedInUser = await login(form.email, form.password);

      toast.success("Login successful!");

      if (loggedInUser.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-600 text-white items-center justify-center p-10">
        <div className="max-w-md text-center space-y-6">

          <div className="flex justify-center">
            <FaBriefcase className="text-6xl" />
          </div>

          <h1 className="text-4xl font-bold">
            Welcome Back!
          </h1>

          <p className="text-lg opacity-90">
            Access your dashboard, manage opportunities,
            and connect with recruiters or students easily.
          </p>

        </div>
      </div>

      {/* RIGHT SIDE LOGIN FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 p-6">

        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Login
          </h2>

          <p className="text-center text-gray-500 mb-6">
            Sign in to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email
              </label>

              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>

              <div className="relative mt-1">

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>

              </div>
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex justify-between items-center text-sm">

              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                Remember me
              </label>

              <span
                onClick={() => navigate("/forgot-password")}
                className="text-indigo-600 hover:underline cursor-pointer"
              >
                Forgot password?
              </span>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t"></div>
            <span className="mx-3 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t"></div>
          </div>

          {/* SOCIAL LOGIN UI */}
          <button className="w-full border py-2 rounded-lg hover:bg-gray-50 transition">
            Continue with Google
          </button>

          {/* SIGNUP */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-indigo-600 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;