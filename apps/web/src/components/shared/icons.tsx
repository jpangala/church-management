import type { SVGProps } from "react";

// Ultra-light line icons, stroke-width 1.25, drawn in 24×24 viewBox.
// Banned: thick Lucide / Material defaults — these are deliberately fine.

const base: SVGProps<SVGSVGElement> = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

type IconProps = SVGProps<SVGSVGElement>;
const make = (path: React.ReactNode): React.FC<IconProps> =>
  function Icon(props) {
    return (
      <svg {...base} {...props}>
        {path}
      </svg>
    );
  };

export const Grid = make(
  <>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </>,
);

export const Users = make(
  <>
    <circle cx="9" cy="8" r="3.25" />
    <path d="M3 19.5c.8-3.4 3.3-5.5 6-5.5s5.2 2.1 6 5.5" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M16 14.2c2.6.4 4.4 2.2 5 5" />
  </>,
);

export const Layers = make(
  <>
    <path d="M12 3.5 3 8l9 4.5L21 8 12 3.5Z" />
    <path d="m3 12 9 4.5 9-4.5" />
    <path d="m3 16 9 4.5 9-4.5" />
  </>,
);

export const User = make(
  <>
    <circle cx="12" cy="8.5" r="3.75" />
    <path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" />
  </>,
);

export const Document = make(
  <>
    <path d="M6.5 3.5h7l4 4v13H6.5z" />
    <path d="M13 3.5v4h4.5" />
    <path d="M9 12h6M9 15h6M9 18h4" />
  </>,
);

export const Clipboard = make(
  <>
    <rect x="6.5" y="4.5" width="11" height="16" rx="1.5" />
    <path d="M9.5 4.5V3.5h5v1" />
    <path d="M9.5 10.5h5M9.5 13.5h5M9.5 16.5h3" />
  </>,
);

export const Gear = make(
  <>
    <circle cx="12" cy="12" r="2.75" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
  </>,
);

export const ArrowUpRight = make(
  <>
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
  </>,
);

export const ArrowUp = make(<path d="M12 19V5M6 11l6-6 6 6" />);
export const ArrowDown = make(<path d="M12 5v14M6 13l6 6 6-6" />);

export const Search = make(
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.3-4.3" />
  </>,
);

export const Bell = make(
  <>
    <path d="M6 16.5h12l-1.5-2v-4a4.5 4.5 0 0 0-9 0v4Z" />
    <path d="M10 19.5a2 2 0 0 0 4 0" />
  </>,
);

export const Logout = make(
  <>
    <path d="M14 3.5H5.5v17H14" />
    <path d="M10 12h11M17 8l4 4-4 4" />
  </>,
);

export const Calendar = make(
  <>
    <rect x="3.5" y="5.5" width="17" height="15" rx="1.5" />
    <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
  </>,
);

export const Folder = make(
  <>
    <path d="M3.5 7.5V18a1.5 1.5 0 0 0 1.5 1.5h14A1.5 1.5 0 0 0 20.5 18V9a1.5 1.5 0 0 0-1.5-1.5h-7L10 5.5H5A1.5 1.5 0 0 0 3.5 7Z" />
  </>,
);

export const Tag = make(
  <>
    <path d="M3.5 12V4.5h7.5l9.5 9.5-7.5 7.5L3.5 12Z" />
    <circle cx="7.75" cy="8.25" r="1.25" />
  </>,
);

export const ChartLine = make(
  <>
    <path d="M3.5 19.5h17" />
    <path d="m4 16 5-6 4 3 7-9" />
  </>,
);

export const Sparkles = make(
  <>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
  </>,
);

export const Plus = make(<path d="M12 5v14M5 12h14" />);
export const ChevronRight = make(<path d="m9 5 7 7-7 7" />);
export const Dots = make(
  <>
    <circle cx="5" cy="12" r="1.1" />
    <circle cx="12" cy="12" r="1.1" />
    <circle cx="19" cy="12" r="1.1" />
  </>,
);
export const Globe = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.5 4 5.5 4 8.5s-1.5 6-4 8.5c-2.5-2.5-4-5.5-4-8.5s1.5-6 4-8.5Z" />
  </>,
);

export const ArrowLeft = make(<path d="M19 12H5M11 18l-6-6 6-6" />);
export const Check = make(<path d="m5 12 5 5L20 7" />);
export const X = make(<path d="m6 6 12 12M18 6 6 18" />);
export const Filter = make(
  <path d="M3.5 5.5h17l-6.5 8v6l-4 1.5v-7.5l-6.5-8Z" />,
);
export const SortAsc = make(
  <>
    <path d="M5 18V6" />
    <path d="m9 10-4-4-4 4" />
    <path d="M11 6h10M11 12h7M11 18h4" />
  </>,
);
export const Pencil = make(
  <>
    <path d="M14.5 5.5 4.5 15.5l-1 5 5-1L18.5 9.5" />
    <path d="m13 7 4 4M15 5l2-2 4 4-2 2" />
  </>,
);
export const Trash = make(
  <>
    <path d="M4.5 7.5h15" />
    <path d="M8 7.5V5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 16 5v2.5" />
    <path d="M6.5 7.5 7.5 20a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5l1-12.5" />
    <path d="M10 11v6M14 11v6" />
  </>,
);
export const Eye = make(
  <>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </>,
);
export const Upload = make(
  <>
    <path d="M12 16V4M6 10l6-6 6 6" />
    <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  </>,
);
export const ChevronDown = make(<path d="m6 9 6 6 6-6" />);
export const ChevronLeft = make(<path d="m15 5-7 7 7 7" />);
export const Lock = make(
  <>
    <rect x="4.5" y="11" width="15" height="10" rx="1.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    <circle cx="12" cy="16" r="0.75" />
  </>,
);
export const Mail = make(
  <>
    <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
    <path d="m4 7 8 6 8-6" />
  </>,
);
export const Phone = make(
  <path d="M5 4.5h3l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.5 1.5C9.5 20.5 3.5 14.5 3.5 6A1.5 1.5 0 0 1 5 4.5Z" />,
);
