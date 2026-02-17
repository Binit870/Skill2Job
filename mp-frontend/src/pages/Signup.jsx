import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your name"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Create a password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Select Role
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="student">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300 font-semibold"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
