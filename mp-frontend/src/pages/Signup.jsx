// import { useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const Signup = () => {
//   const { signup } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "student",
//   });

//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await signup(
//       form.name,
//       form.email,
//       form.password,
//       form.role
//     );

//     toast.success("Account created successfully!");

//     const role = res.user.role;

//     setTimeout(() => {
//       if (role === "student") {
//         navigate("/student/profile");
//       } else {
//         navigate("/recruiter/profile");
//       }
//     }, 1000);

//   } catch (error) {
//     toast.error(
//       error.response?.data?.message || "Something went wrong"
//     );
//   }
// };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200">
//       <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
//           Create Account
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">

//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Full Name
//             </label>
//             <input
//               required
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
//               placeholder="Enter your name"
//               onChange={(e) =>
//                 setForm({ ...form, name: e.target.value })
//               }
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               required
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
//               placeholder="Create a password"
//               onChange={(e) =>
//                 setForm({ ...form, password: e.target.value })
//               }
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Select Role
//             </label>
//             <select
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
//               onChange={(e) =>
//                 setForm({ ...form, role: e.target.value })
//               }
//             >
//               <option value="student">Job Seeker</option>
//               <option value="recruiter">Recruiter</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300 font-semibold"
//           >
//             Sign Up
//           </button>
//         </form>

//         <p className="text-sm text-center text-gray-500 mt-6">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/login")}
//             className="text-purple-600 cursor-pointer hover:underline"
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBriefcase
} from "react-icons/fa";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signup(
        form.name,
        form.email,
        form.password,
        form.role
      );

      toast.success("Account created successfully!");

      const role = res.user.role;

      setTimeout(() => {
        if (role === "student") {
          navigate("/student/profile");
        } else {
          navigate("/recruiter/profile");
        }
      }, 1000);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 text-white items-center justify-center p-10">

        <div className="max-w-md text-center space-y-6">

          <FaBriefcase className="text-6xl mx-auto" />

          <h1 className="text-4xl font-bold leading-tight">
            Skill2Job 🚀
          </h1>

          <p className="text-lg opacity-90">
            Build your future by connecting your skills with the right
            opportunities and recruiters.
          </p>

        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 p-6">

        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Create Account ✨
          </h2>

          <p className="text-center text-gray-500 mb-6">
            Start your journey with Skill2Job
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>

              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>

              <div className="relative mt-1">

                <FaUser className="absolute left-3 top-3 text-gray-400"/>

                <input
                  required
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  onChange={(e)=>
                    setForm({...form,name:e.target.value})
                  }
                />

              </div>
            </div>

            {/* EMAIL */}
            <div>

              <label className="text-sm font-medium text-gray-600">
                Email
              </label>

              <div className="relative mt-1">

                <FaEnvelope className="absolute left-3 top-3 text-gray-400"/>

                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  onChange={(e)=>
                    setForm({...form,email:e.target.value})
                  }
                />

              </div>
            </div>

            {/* PASSWORD */}
            <div>

              <label className="text-sm font-medium text-gray-600">
                Password
              </label>

              <div className="relative mt-1">

                <FaLock className="absolute left-3 top-3 text-gray-400"/>

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a password"
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  onChange={(e)=>
                    setForm({...form,password:e.target.value})
                  }
                />

                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={()=>setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash/> : <FaEye/>}
                </span>

              </div>
            </div>

            {/* ROLE SELECT */}
            <div>

              <label className="text-sm font-medium text-gray-600">
                I am a
              </label>

              <select
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                onChange={(e)=>
                  setForm({...form,role:e.target.value})
                }
              >
                <option value="student">🎓 Job Seeker</option>
                <option value="recruiter">💼 Recruiter</option>
              </select>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-700 hover:scale-[1.02] transition duration-200"
            >
              Create Account →
            </button>

          </form>

          {/* LOGIN LINK */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <span
              onClick={()=>navigate("/login")}
              className="text-purple-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

        </div>

      </div>
    </div>
  );
};

export default Signup;