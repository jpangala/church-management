import type { NavEntry } from "@/app/types";
import {
  ArrowDown,
  ArrowUp,
  ChartLine,
  Sparkles,
  Tag,
} from "@/components/shared/icons";

export const financeNav: NavEntry[] = [
  {
    role: "FINANCE",
    section: "Overview",
    to: "/finance/reports",
    label: "Reports",
    icon: <ChartLine />,
  },
  {
    role: "FINANCE",
    section: "Ledger",
    to: "/finance/income",
    label: "Income",
    icon: <ArrowUp />,
  },
  {
    role: "FINANCE",
    section: "Ledger",
    to: "/finance/expenses",
    label: "Expenses",
    icon: <ArrowDown />,
  },
  {
    role: "FINANCE",
    section: "Ledger",
    to: "/finance/categories",
    label: "Categories",
    icon: <Tag />,
  },
  {
    role: "FINANCE",
    section: "Ledger",
    to: "/finance/budgets",
    label: "Budgets",
    icon: <Sparkles />,
  },
];
