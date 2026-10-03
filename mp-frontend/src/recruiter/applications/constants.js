export const STATUS_CFG = {
  Pending:     { color: "text-ink/55",  bg: "bg-ink/5",    border: "border-mist",     ring: "ring-ink/20"  },
  Reviewed:    { color: "text-blue-700", bg: "bg-blue-50",  border: "border-blue-200", ring: "ring-blue-300" },
  Shortlisted: { color: "text-gold",     bg: "bg-gold/10",  border: "border-gold/25",  ring: "ring-gold/40" },
  Rejected:    { color: "text-red-600",  bg: "bg-red-50",   border: "border-red-200",  ring: "ring-red-300" },
  Hired:       { color: "text-pine",     bg: "bg-pine/8",   border: "border-pine/25",  ring: "ring-pine/40" },
};

export const STATUS_ACTIONS = [
  { value: "Pending",     label: "Pending",    icon: "clock", cls: "bg-ink/5 hover:bg-ink/10 text-ink/60 border-mist" },
  { value: "Reviewed",    label: "Reviewed",   icon: "eye",   cls: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300" },
  { value: "Shortlisted", label: "Shortlist",  icon: "star",  cls: "bg-gold/10 hover:bg-gold/20 text-gold border-gold/40" },
  { value: "Rejected",    label: "Reject",     icon: "x",     cls: "bg-red-50 hover:bg-red-100 text-red-600 border-red-300" },
  { value: "Hired",       label: "Hire",       icon: "party", cls: "bg-pine/8 hover:bg-pine/15 text-pine border-pine/40" },
];

export const STAT_TABS = ["All", "Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];
