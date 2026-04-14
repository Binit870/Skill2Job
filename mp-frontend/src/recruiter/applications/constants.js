export const STATUS_CFG = {
  Pending:     { color: "text-slate-600",  bg: "bg-slate-100",  border: "border-slate-200",  ring: "ring-slate-300"  },
  Reviewed:    { color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200",   ring: "ring-blue-300"   },
  Shortlisted: { color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200",  ring: "ring-amber-300"  },
  Rejected:    { color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200",    ring: "ring-red-300"    },
  Hired:       { color: "text-green-700",  bg: "bg-green-50",   border: "border-green-200",  ring: "ring-green-400"  },
};

export const STATUS_ACTIONS = [
  { value: "Pending",     label: "Pending",    icon: "clock",      cls: "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"   },
  { value: "Reviewed",    label: "Reviewed",   icon: "eye",        cls: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"       },
  { value: "Shortlisted", label: "Shortlist",  icon: "star",       cls: "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300"    },
  { value: "Rejected",    label: "Reject",     icon: "x",          cls: "bg-red-50 hover:bg-red-100 text-red-600 border-red-300"           },
  { value: "Hired",       label: "Hire",       icon: "party",      cls: "bg-green-50 hover:bg-green-100 text-green-700 border-green-300"   },
];

export const STAT_TABS = ["All", "Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];