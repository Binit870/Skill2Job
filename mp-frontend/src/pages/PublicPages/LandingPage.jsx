// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   FileText,
//   Target,
//   TrendingUp,
//   BookOpen,
//   ArrowRight,
//   CheckCircle,
//   Upload,
//   Cpu,
//   Sparkles,
// } from "lucide-react";
// import { useEffect, useState } from "react";


// /* -------------------- SIMPLE TAILWIND BUTTON -------------------- */
// function Button({ children, className = "", variant = "primary", ...props }) {
//   const base =
//     "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus:outline-none";

//   const variants = {
//     primary: "bg-black text-white hover:bg-black/90 px-8 h-12",
//     outline:
//       "border border-gray-300 text-black hover:bg-gray-100 px-8 h-12",
//     secondary:
//       "bg-white text-black hover:bg-white/90 px-8 h-12",
//   };

//   return (
//     <button className={`${base} ${variants[variant]} ${className}`} {...props}>
//       {children}
//     </button>
//   );
// }



// /* -------------------- DATA -------------------- */
// const features = [
//   {
//     icon: FileText,
//     title: "Smart Resume Parsing",
//     description:
//       "AI extracts skills, experience, and education from any resume format instantly.",
//   },
//   {
//     icon: Target,
//     title: "Job Matching",
//     description:
//       "Get matched with relevant opportunities based on your profile and preferences.",
//   },
//   {
//     icon: TrendingUp,
//     title: "Placement Prediction",
//     description:
//       "ML-powered predictions for your placement probability and expected salary.",
//   },
//   {
//     icon: BookOpen,
//     title: "Skill Gap Analysis",
//     description:
//       "Identify missing skills and get personalized learning recommendations.",
//   },
// ];

// const steps = [
//   { step: 1, icon: Upload, title: "Upload Resume", description: "Drop your PDF or DOC file" },
//   { step: 2, icon: Cpu, title: "AI Analysis", description: "Our AI extracts and analyzes" },
//   { step: 3, icon: Sparkles, title: "Get Insights", description: "View predictions & matches" },
// ];

// /* -------------------- COUNTER -------------------- */
// function AnimatedCounter({ target, suffix = "" }) {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     const duration = 2000;
//     const steps = 60;
//     const increment = target / steps;
//     let current = 0;

//     const timer = setInterval(() => {
//       current += increment;
//       if (current >= target) {
//         setCount(target);
//         clearInterval(timer);
//       } else {
//         setCount(Math.floor(current));
//       }
//     }, duration / steps);

//     return () => clearInterval(timer);
//   }, [target]);

//   return (
//     <span>
//       {count.toLocaleString()}
//       {suffix}
//     </span>
//   );
// }

// /* -------------------- PAGE -------------------- */
// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-white text-black">
     

//       {/* HERO */}

      
//       <section className="pt-32 pb-20">
//         <div className="max-w-4xl mx-auto px-4 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm font-medium mb-6">
//               <Sparkles className="w-4 h-4" />
//               AI-Powered Career Intelligence
//             </div>

//             <h1 className="text-4xl md:text-6xl font-bold mb-6">
//               Upload Resume & <span className="underline">Get AI Insights</span>
//             </h1>

//             <p className="text-lg text-gray-600 mb-8">
//               Intelligent resume analysis, placement predictions, and skill
//               recommendations — all in one place.
//             </p>

//             <div className="flex flex-col sm:flex-row justify-center gap-4">
//               <Link to="/login">
//                 <Button>
//                   Get Started Free <ArrowRight className="w-5 h-5" />
//                 </Button>
//               </Link>
//               <Link to="/recruiter-dashboard">
//                 <Button variant="outline">For Recruiters</Button>
//               </Link>
//             </div>

//             <div className="flex justify-center gap-6 mt-12 text-sm text-gray-500">
//               {["10K+ Students", "500+ Companies", "95% Accuracy"].map((t) => (
//                 <div key={t} className="flex items-center gap-2">
//                   <CheckCircle className="w-4 h-4" />
//                   {t}
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </section> 

//       {/* FEATURES */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             Everything You Need to Succeed
//           </h2>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {features.map((f, i) => (
//               <motion.div
//                 key={f.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.1 }}
//                 className="bg-white p-6 rounded-2xl border hover:shadow-lg"
//               >
//                 <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-xl mb-4">
//                   <f.icon />
//                 </div>
//                 <h3 className="font-semibold mb-2">{f.title}</h3>
//                 <p className="text-sm text-gray-600">{f.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* STATS */}
//       <section className="py-20">
//         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//           {[
//             { value: 10000, suffix: "+", label: "Resumes Analyzed" },
//             { value: 95, suffix: "%", label: "Prediction Accuracy" },
//             { value: 500, suffix: "+", label: "Partner Companies" },
//             { value: 85, suffix: "%", label: "Placement Rate" },
//           ].map((s) => (
//             <div key={s.label}>
//               <div className="text-4xl font-bold mb-2">
//                 <AnimatedCounter target={s.value} suffix={s.suffix} />
//               </div>
//               <p className="text-gray-500 text-sm">{s.label}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-6xl mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold mb-12">How It Works</h2>

//           <div className="flex flex-col md:flex-row justify-center gap-10">
//             {steps.map((s) => (
//               <div key={s.step} className="relative">
//                 <div className="w-20 h-20 mx-auto mb-4 bg-black text-white rounded-2xl flex items-center justify-center">
//                   <s.icon className="w-8 h-8" />
//                 </div>
//                 <h3 className="font-semibold">{s.title}</h3>
//                 <p className="text-sm text-gray-600">{s.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

     
//     </div>
//   );
// }
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  Target,
  TrendingUp,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Upload,
  Cpu,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

/* -------------------- BUTTON -------------------- */
function Button({ children, className = "", variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus:outline-none";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 px-8 h-12 shadow-md",
    outline:
      "border border-gray-300 text-black hover:bg-gray-100 px-8 h-12",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/* -------------------- DATA -------------------- */
const features = [
  {
    icon: FileText,
    title: "Smart Resume Parsing",
    description:
      "AI extracts skills, experience, and education from any resume format instantly.",
  },
  {
    icon: Target,
    title: "Job Matching",
    description:
      "Get matched with relevant opportunities based on your profile and preferences.",
  },
  {
    icon: TrendingUp,
    title: "Placement Prediction",
    description:
      "ML-powered predictions for your placement probability and expected salary.",
  },
  {
    icon: BookOpen,
    title: "Skill Gap Analysis",
    description:
      "Identify missing skills and get personalized learning recommendations.",
  },
];

const steps = [
  {
    step: 1,
    icon: Upload,
    title: "Upload Resume",
    description: "Drop your PDF or DOC file",
  },
  {
    step: 2,
    icon: Cpu,
    title: "AI Analysis",
    description: "Our AI extracts and analyzes",
  },
  {
    step: 3,
    icon: Sparkles,
    title: "Get Insights",
    description: "View predictions & matches",
  },
];

/* -------------------- COUNTER -------------------- */
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* -------------------- PAGE -------------------- */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">

      {/* HERO */}
      <section className="pt-36 pb-24 relative">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-200 blur-[140px] opacity-40"></div>

        <div className="max-w-5xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Career Intelligence
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Turn Your Resume Into
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                Career Intelligence
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Intelligent resume analysis, placement predictions, and skill
              recommendations — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login">
                <Button>
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link to="/recruiter-dashboard">
                <Button variant="outline">For Recruiters</Button>
              </Link>
            </div>

            <div className="flex justify-center gap-6 mt-12 text-sm text-gray-500 flex-wrap">
              {["10K+ Students", "500+ Companies", "95% Accuracy"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-14">
            Everything You Need to Succeed
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border hover:shadow-xl hover:-translate-y-1 transition"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl mb-4">
                  <f.icon />
                </div>

                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: 10000, suffix: "+", label: "Resumes Analyzed" },
            { value: 95, suffix: "%", label: "Prediction Accuracy" },
            { value: 500, suffix: "+", label: "Partner Companies" },
            { value: 85, suffix: "%", label: "Placement Rate" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-14">How It Works</h2>

          <div className="flex flex-col md:flex-row justify-center gap-12">
            {steps.map((s) => (
              <div key={s.step}>
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <s.icon className="w-8 h-8" />
                </div>

                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Skill2Job • AI Career Intelligence Platform
      </footer>
    </div>
  );
}