import { Clock, Eye, Star, X, Gift } from "lucide-react";

export const STATUS_CFG = {
  Pending:     { icon: Clock, color: "text-ink/55",     bg: "bg-ink/5",     border: "border-mist",       left: "border-l-ink/20",   badge: "bg-ink/5 text-ink/60 border-mist" },
  Reviewed:    { icon: Eye,   color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",   left: "border-l-blue-400", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  Shortlisted: { icon: Star,  color: "text-gold",       bg: "bg-gold/10",   border: "border-gold/25",    left: "border-l-gold",     badge: "bg-gold/10 text-gold border-gold/25" },
  Rejected:    { icon: X,     color: "text-red-500",    bg: "bg-red-50",    border: "border-red-200",    left: "border-l-red-400",  badge: "bg-red-50 text-red-600 border-red-200" },
  Hired:       { icon: Gift,  color: "text-pine",       bg: "bg-pine/8",    border: "border-pine/25",    left: "border-l-pine",     badge: "bg-pine/8 text-pine border-pine/25" },
};

export const TABS = ["All", "Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];

export const TAB_COLORS = {
  All:         { active: "bg-pine text-white border-pine shadow-pine/20 shadow-md" },
  Pending:     { active: "bg-ink/5 text-ink/70 border-ink/20" },
  Reviewed:    { active: "bg-blue-50 text-blue-700 border-blue-300" },
  Shortlisted: { active: "bg-gold/10 text-gold border-gold/40" },
  Rejected:    { active: "bg-red-50 text-red-600 border-red-300" },
  Hired:       { active: "bg-pine/8 text-pine border-pine/40" },
};
