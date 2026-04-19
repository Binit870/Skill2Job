import {
  FiClock, FiEye, FiStar, FiX, FiGift,
} from "react-icons/fi";

export const STATUS_CFG = {
  Pending:     { icon: FiClock,  color: "text-slate-500",  bg: "bg-slate-50",   border: "border-slate-200",  left: "border-l-slate-300",  badge: "bg-slate-100 text-slate-600 border-slate-200"  },
  Reviewed:    { icon: FiEye,    color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-200",   left: "border-l-blue-400",   badge: "bg-blue-50 text-blue-700 border-blue-200"      },
  Shortlisted: { icon: FiStar,   color: "text-amber-600",  bg: "bg-amber-50",   border: "border-amber-200",  left: "border-l-amber-400",  badge: "bg-amber-50 text-amber-700 border-amber-200"   },
  Rejected:    { icon: FiX,      color: "text-red-500",    bg: "bg-red-50",     border: "border-red-200",    left: "border-l-red-400",    badge: "bg-red-50 text-red-600 border-red-200"         },
  Hired:       { icon: FiGift,   color: "text-green-600",  bg: "bg-green-50",   border: "border-green-200",  left: "border-l-green-500",  badge: "bg-green-50 text-green-700 border-green-200"   },
};

export const TABS = ["All", "Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];

export const TAB_COLORS = {
  All:         { active: "bg-green-600 text-white border-green-600 shadow-green-200 shadow-md" },
  Pending:     { active: "bg-slate-100 text-slate-700 border-slate-300"   },
  Reviewed:    { active: "bg-blue-50 text-blue-700 border-blue-300"       },
  Shortlisted: { active: "bg-amber-50 text-amber-700 border-amber-300"    },
  Rejected:    { active: "bg-red-50 text-red-600 border-red-300"          },
  Hired:       { active: "bg-green-50 text-green-700 border-green-300"    },
};