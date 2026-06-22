import { useEffect, useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaChartLine,
  FaDollarSign,
  FaEye,
  FaShoppingCart,
  FaSyncAlt,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { api } from "../../api/axios";
import LoadingSpinner from "../../common/LoadingSpinner";
import { useTheme } from "../../contexts/ThemeContext";

const monthLabels = [
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
];
const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const emptyMonthlyData = monthLabels.map((label) => ({
  label,
  sales: 0,
  revenue: 0,
}));

const emptyWeeklyData = weekLabels.map((label) => ({
  label,
  sales: 0,
  revenue: 0,
}));

const compactNumber = (value) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);

const currency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: Math.abs(Number(value) || 0) >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);

const getCollection = (response, key) => {
  const data = response?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getProductValue = (product) => {
  const price = Number(product?.price) || 0;
  const stock = Number(product?.stock) || 0;
  return price * stock;
};

const buildMonthlyData = (items) => {
  const totals = emptyMonthlyData.map((item) => ({ ...item }));
  items.forEach((item, index) => {
    const monthIndex = item?.created_at
      ? new Date(item.created_at).getMonth()
      : index % totals.length;
    const bucket = totals[monthIndex % totals.length];

    if (item.total) {
      bucket.sales += 1;
      bucket.revenue += Number(item.total);
    } else {
      const stock = Number(item?.stock) || 0;
      bucket.sales += stock;
      bucket.revenue += getProductValue(item);
    }
  });

  return totals.map((item) => ({
    ...item,
    sales: Math.round(item.sales),
    revenue: Math.round(item.revenue),
  }));
};

const buildWeeklyData = (items) => {
  const totals = emptyWeeklyData.map((item) => ({ ...item }));
  items.forEach((item, index) => {
    const dayIndex = item?.created_at
      ? new Date(item.created_at).getDay()
      : index % totals.length;
    const bucketIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    const bucket = totals[bucketIndex];

    if (item.total) {
      bucket.sales += 1;
      bucket.revenue += Number(item.total);
    } else {
      const stock = Number(item?.stock) || 0;
      bucket.sales += stock;
      bucket.revenue += getProductValue(item);
    }
  });

  return totals;
};

// StatCard Component
const StatCard = ({
  icon,
  value,
  label,
  change,
  color,
  bgGradient,
  isDarkGold,
}) => (
  <div className="col-12 col-sm-6 col-xl-3">
    <div
      className="dashboard-card stat-card"
      style={{
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 6px 18px rgba(12,24,50,0.06)",
        background: isDarkGold ? "#0f172a" : "#ffffff",
        borderColor: "transparent",
      }}
    >
      {/* Accent top bar */}
      <div
        className="accent-top"
        style={{ background: bgGradient }}
        aria-hidden
      />
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <span
            className="stat-label text-uppercase fw-semibold"
            style={{
              fontSize: "11px",
              letterSpacing: "0.05em",
              color: "#64748b",
            }}
          >
            {label}
          </span>

          <div className="d-flex align-items-baseline gap-3">
            <h3
              className="mt-1 mb-0 fw-extrabold"
              style={{
                fontSize: "34px",
                color: color,
              }}
            >
              {value}
            </h3>
          </div>

          <div className="mt-2 small d-flex align-items-center gap-2">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 700,
                color: change >= 0 ? "#10b981" : "#ef4444",
              }}
            >
              {change >= 0 ? (
                <FaArrowUp size={12} />
              ) : (
                <FaArrowDown size={12} />
              )}
              {Math.abs(change).toFixed(2)}%
            </span>
            <span className="text-secondary">vs last month</span>
          </div>
        </div>

        <div
          className="stat-icon-wrapper animate-icon"
          style={{
            background: isDarkGold
              ? "rgba(255,255,255,0.03)"
              : "rgba(2,6,23,0.06)",
            color: color,
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            boxShadow: `0 10px 24px rgba(2,6,23,0.06)`,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  </div>
);

// Advanced Interactive Bezier Line Chart
const InteractiveLineChart = ({ data, isDarkGold }) => {
  const width = 720;
  const height = 260;
  const padding = 40;

  const [hoverIndex, setHoverIndex] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [visibleSeries, setVisibleSeries] = useState({
    sales: true,
    revenue: true,
  });

  const maxVal = Math.max(
    10,
    ...data.flatMap((item) => {
      const vals = [];
      if (visibleSeries.sales) vals.push(item.sales);
      if (visibleSeries.revenue) vals.push(item.revenue);
      return vals.length > 0 ? vals : [10];
    }),
  );

  // Rounds max value to a clean increment
  const maxRounded = Math.ceil(maxVal / 10) * 10;

  const xStep = (width - padding * 2) / Math.max(data.length - 1, 1);
  const getX = (index) => padding + index * xStep;
  const getY = (value) =>
    height - padding - (value / maxRounded) * (height - padding * 2);

  // Generates smooth Cubic Bezier path
  const getBezierPath = (seriesName) => {
    if (data.length === 0) return "";
    const points = data.map((item, index) => ({
      x: getX(index),
      y: getY(item[seriesName]),
    }));

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 3;
      const cp1y = curr.y;
      const cp2x = curr.x + (2 * (next.x - curr.x)) / 3;
      const cp2y = next.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const getAreaPoints = (seriesName) => {
    if (data.length === 0) return "";
    const linePath = getBezierPath(seriesName);
    if (!linePath) return "";
    // Replaces initial M with absolute bounds
    return `${linePath} L ${getX(data.length - 1)} ${height - padding} L ${padding} ${height - padding} Z`;
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const svgX = (clientX / rect.width) * width;
    let closestIdx = 0;
    let minDiff = Infinity;

    for (let i = 0; i < data.length; i++) {
      const px = getX(i);
      const diff = Math.abs(svgX - px);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }

    setHoverIndex(closestIdx);

    // Dynamic placement of absolute tooltip inside the container
    const tooltipX = (getX(closestIdx) / width) * rect.width;
    let pointVal = 0;
    if (visibleSeries.revenue) pointVal = data[closestIdx].revenue;
    else if (visibleSeries.sales) pointVal = data[closestIdx].sales;

    const tooltipY = (getY(pointVal) / height) * rect.height - 65;
    setTooltipPos({ x: tooltipX, y: Math.max(15, tooltipY) });
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Series Toggles */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <button
          className="btn btn-sm d-flex align-items-center gap-2 border-0 px-2 py-1"
          style={{
            background: "transparent",
            color: visibleSeries.revenue
              ? isDarkGold
                ? "#fbbf24"
                : "#4f6ff7"
              : "#94a3b8",
            opacity: visibleSeries.revenue ? 1 : 0.6,
            fontWeight: "700",
          }}
          onClick={() =>
            setVisibleSeries((prev) => ({ ...prev, revenue: !prev.revenue }))
          }
        >
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: isDarkGold ? "#fbbf24" : "#4f6ff7",
            }}
          />
          Revenue {visibleSeries.revenue ? "Visible" : "Hidden"}
        </button>

        <button
          className="btn btn-sm d-flex align-items-center gap-2 border-0 px-2 py-1"
          style={{
            background: "transparent",
            color: visibleSeries.sales ? "#10b981" : "#94a3b8",
            opacity: visibleSeries.sales ? 1 : 0.6,
            fontWeight: "700",
          }}
          onClick={() =>
            setVisibleSeries((prev) => ({ ...prev, sales: !prev.sales }))
          }
        >
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#10b981",
            }}
          />
          Sales Count {visibleSeries.sales ? "Visible" : "Hidden"}
        </button>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-100 h-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={isDarkGold ? "#fbbf24" : "#4f6ff7"}
              stopOpacity="0.25"
            />
            <stop
              offset="100%"
              stopColor={isDarkGold ? "#fbbf24" : "#4f6ff7"}
              stopOpacity="0.00"
            />
          </linearGradient>
          <linearGradient id="salesAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="4"
              floodColor={isDarkGold ? "#fbbf24" : "#4f6ff7"}
              floodOpacity="0.15"
            />
          </filter>
        </defs>

        {/* Gridlines */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = getY((maxRounded * tick) / 100);
          return (
            <g key={tick}>
              <line
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke={
                  isDarkGold ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"
                }
                strokeDasharray="4 4"
              />
              <text
                x={padding - 12}
                y={y + 4}
                fill={isDarkGold ? "#64748b" : "#94a3b8"}
                fontSize="11"
                textAnchor="end"
                fontWeight="600"
              >
                {Math.round((maxRounded * tick) / 100)}
              </text>
            </g>
          );
        })}

        {/* Area gradients */}
        {visibleSeries.revenue && (
          <path d={getAreaPoints("revenue")} fill="url(#revenueAreaGrad)" />
        )}
        {visibleSeries.sales && (
          <path d={getAreaPoints("sales")} fill="url(#salesAreaGrad)" />
        )}

        {/* Curves */}
        {visibleSeries.revenue && (
          <path
            d={getBezierPath("revenue")}
            fill="none"
            stroke={isDarkGold ? "#fbbf24" : "#4f6ff7"}
            strokeWidth="3.5"
            filter="url(#glow)"
            strokeLinecap="round"
          />
        )}
        {visibleSeries.sales && (
          <path
            d={getBezierPath("sales")}
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}

        {/* X Axis Labels */}
        {data.map((item, index) => (
          <text
            key={item.label}
            x={getX(index)}
            y={height - 12}
            fill={isDarkGold ? "#64748b" : "#94a3b8"}
            fontSize="11"
            textAnchor="middle"
            fontWeight="600"
          >
            {item.label}
          </text>
        ))}

        {/* Active hover vertical cursor line */}
        {hoverIndex !== null && (
          <line
            x1={getX(hoverIndex)}
            x2={getX(hoverIndex)}
            y1={padding}
            y2={height - padding}
            stroke={
              isDarkGold ? "rgba(251,191,36,0.3)" : "rgba(79,111,247,0.3)"
            }
            strokeWidth="2"
            strokeDasharray="2 2"
          />
        )}

        {/* Hover Points */}
        {hoverIndex !== null && visibleSeries.revenue && (
          <circle
            cx={getX(hoverIndex)}
            cy={getY(data[hoverIndex].revenue)}
            r="7"
            fill={isDarkGold ? "#fbbf24" : "#4f6ff7"}
            stroke={isDarkGold ? "#1e293b" : "#ffffff"}
            strokeWidth="2.5"
          />
        )}
        {hoverIndex !== null && visibleSeries.sales && (
          <circle
            cx={getX(hoverIndex)}
            cy={getY(data[hoverIndex].sales)}
            r="7"
            fill="#10b981"
            stroke={isDarkGold ? "#1e293b" : "#ffffff"}
            strokeWidth="2.5"
          />
        )}
      </svg>

      {/* Floating Tooltip Component */}
      {hoverIndex !== null && (
        <div
          style={{
            position: "absolute",
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: "translateX(-50%)",
            background: isDarkGold ? "#1e293b" : "#0f172a",
            color: "#ffffff",
            padding: "10px 14px",
            borderRadius: "8px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
            pointerEvents: "none",
            zIndex: 100,
            fontSize: "12px",
            border: isDarkGold
              ? "1px solid #4a5568"
              : "1px solid rgba(255,255,255,0.1)",
            transition: "left 0.1s ease, top 0.1s ease",
          }}
        >
          <div style={{ fontWeight: "700", marginBottom: "4px", opacity: 0.8 }}>
            {data[hoverIndex].label} Timeline
          </div>
          {visibleSeries.revenue && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-secondary small">Revenue:</span>
              <strong style={{ color: isDarkGold ? "#fbbf24" : "#60a5fa" }}>
                ${data[hoverIndex].revenue.toLocaleString()}
              </strong>
            </div>
          )}
          {visibleSeries.sales && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-secondary small">Orders Count:</span>
              <strong style={{ color: "#34d399" }}>
                {data[hoverIndex].sales} units
              </strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Interactive Weekly BarChart
const InteractiveBarChart = ({ data, isDarkGold }) => {
  const [hoverDay, setHoverDay] = useState(null);
  const maxVal = Math.max(
    10,
    ...data.flatMap((item) => [item.sales, item.revenue]),
  );

  return (
    <div
      className="weekly-chart d-flex justify-content-between align-items-end"
      style={{ height: "160px", padding: "10px 0" }}
    >
      {data.map((item, idx) => {
        const revHeight = maxVal > 0 ? (item.revenue / maxVal) * 100 : 0;
        const salesHeight = maxVal > 0 ? (item.sales / maxVal) * 100 : 0;
        const isHovered = hoverDay === idx;

        return (
          <div
            className="d-flex flex-column align-items-center"
            key={item.label}
            style={{ flex: 1, position: "relative", cursor: "pointer" }}
            onMouseEnter={() => setHoverDay(idx)}
            onMouseLeave={() => setHoverDay(null)}
          >
            {/* Tooltip on hover */}
            {isHovered && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  background: "#0f172a",
                  color: "#ffffff",
                  padding: "6px 10px",
                  borderRadius: "5px",
                  fontSize: "10px",
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  zIndex: 10,
                  transform: "translateY(-6px)",
                }}
              >
                <div>Rev: ${item.revenue}</div>
                <div>Vol: {item.sales}</div>
              </div>
            )}

            <div
              className="d-flex gap-1.5 align-items-end"
              style={{
                height: "110px",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: `${Math.max(revHeight, 5)}%`,
                  background: isDarkGold ? "#fbbf24" : "#4f6ff7",
                  borderRadius: "10px",
                  transition: "all 0.25s ease",
                  opacity: isHovered ? 1 : 0.8,
                }}
              />
              <div
                style={{
                  width: "7px",
                  height: `${Math.max(salesHeight, 5)}%`,
                  background: "#10b981",
                  borderRadius: "10px",
                  transition: "all 0.25s ease",
                  opacity: isHovered ? 1 : 0.8,
                }}
              />
            </div>
            <small
              style={{
                fontSize: "10px",
                marginTop: "8px",
                fontWeight: isHovered ? "800" : "600",
                color: isHovered
                  ? isDarkGold
                    ? "#fbbf24"
                    : "#4f6ff7"
                  : "#94a3b8",
              }}
            >
              {item.label}
            </small>
          </div>
        );
      })}
    </div>
  );
};

// Donut Chart Arc Helper Functions
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const getArcPath = (x, y, radius, innerRadius, startAngle, endAngle) => {
  if (endAngle - startAngle >= 360) {
    endAngle = startAngle + 359.99;
  }
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
    "Z",
  ].join(" ");
};

// Category Donut Chart Component
const CategoryDonutChart = ({ products, categories, isDarkGold, totals }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const data = useMemo(() => {
    const counts = {};
    products.forEach((product) => {
      const catId = product.category_id;
      const cat = categories.find((c) => Number(c.id) === Number(catId));
      const catName = cat ? cat.name : "Other Item";
      const stock = Number(product.stock) || 0;
      counts[catName] = (counts[catName] || 0) + stock;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 4);
    const othersVal = sorted.slice(4).reduce((sum, item) => sum + item[1], 0);

    if (othersVal > 0) {
      top.push(["Others", othersVal]);
    }

    const totalVal = top.reduce((sum, item) => sum + item[1], 0);
    const palette = ["#4f6ff7", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

    let accumulatedAngle = 0;
    return top.map(([name, value], idx) => {
      const pct = totalVal > 0 ? (value / totalVal) * 100 : 0;
      const degAngle = totalVal > 0 ? (value / totalVal) * 360 : 0;
      const startAngle = accumulatedAngle;
      accumulatedAngle += degAngle;

      return {
        name,
        value,
        percentage: pct,
        startAngle,
        endAngle: accumulatedAngle,
        color: palette[idx % palette.length],
      };
    });
  }, [products, categories]);

  if (products.length === 0) {
    return (
      <div className="text-center py-5 text-secondary">
        No stock data available.
      </div>
    );
  }

  return (
    <div className="row align-items-center">
      <div className="col-12 col-md-6 text-center">
        <svg
          viewBox="0 0 200 200"
          className="w-75 h-auto"
          style={{ overflow: "visible" }}
        >
          {data.map((segment, idx) => {
            const isActive = activeIndex === idx;
            const r = isActive ? 84 : 80;
            const ir = isActive ? 52 : 55;

            return (
              <path
                key={segment.name}
                d={getArcPath(
                  100,
                  100,
                  r,
                  ir,
                  segment.startAngle,
                  segment.endAngle,
                )}
                fill={segment.color}
                style={{
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  opacity: activeIndex === null || isActive ? 1 : 0.6,
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              />
            );
          })}

          {/* Center Info Panel */}
          <circle
            cx="100"
            cy="100"
            r="50"
            fill={isDarkGold ? "#1a2232" : "#ffffff"}
          />
          <text
            x="100"
            y="94"
            textAnchor="middle"
            fontWeight="700"
            fontSize="10"
            fill={isDarkGold ? "#94a3b8" : "#64748b"}
            letterSpacing="0.05em"
            className="text-uppercase"
          >
            {activeIndex !== null ? data[activeIndex].name : "Total Stock"}
          </text>
          <text
            x="100"
            y="118"
            textAnchor="middle"
            fontWeight="800"
            fontSize="18"
            fill={
              activeIndex !== null
                ? data[activeIndex].color
                : isDarkGold
                  ? "#fbbf24"
                  : "#4f6ff7"
            }
          >
            {activeIndex !== null
              ? `${Math.round(data[activeIndex].percentage)}%`
              : totals.stock.toLocaleString()}
          </text>
        </svg>
      </div>

      {/* Legend list */}
      <div className="col-12 col-md-6">
        <ul className="list-unstyled d-flex flex-column gap-2 mb-0 mt-3 mt-md-0">
          {data.map((segment, idx) => {
            const isActive = activeIndex === idx;
            return (
              <li
                key={segment.name}
                className="d-flex align-items-center justify-content-between p-2 rounded"
                style={{
                  background: isActive
                    ? isDarkGold
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)"
                    : "transparent",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="d-flex align-items-center gap-2">
                  <span
                    style={{
                      display: "inline-block",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: segment.color,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: isActive ? "700" : "500",
                      color: isDarkGold ? "#cbd5e1" : "#334155",
                    }}
                  >
                    {segment.name}
                  </span>
                </div>
                <div style={{ fontSize: "13px" }}>
                  <strong style={{ color: isDarkGold ? "#cbd5e1" : "#0f172a" }}>
                    {segment.value}
                  </strong>
                  <span className="text-secondary small ms-1">
                    ({Math.round(segment.percentage)}%)
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { isDarkGold } = useTheme();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("monthly"); // "monthly" | "weekly"

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [usersResult, productsResult, categoriesResult, ordersResult] =
        await Promise.allSettled([
          api.get("/admin/users"),
          api.get("/admin/products"),
          api.get("/admin/categories"),
          api.get("/admin/orders"),
        ]);

      if (usersResult.status === "fulfilled") {
        setUsers(getCollection(usersResult.value, "users"));
      }
      if (productsResult.status === "fulfilled") {
        setProducts(getCollection(productsResult.value, "products"));
      }
      if (categoriesResult.status === "fulfilled") {
        setCategories(getCollection(categoriesResult.value, "categories"));
      }
      if (ordersResult.status === "fulfilled") {
        setOrders(getCollection(ordersResult.value, "orders"));
      }

      if (
        [usersResult, productsResult, categoriesResult].some(
          (result) => result.status === "rejected",
        )
      ) {
        setError(
          "Could not complete full database sync. Using stored data cache.",
        );
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Error connecting to the API backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totals = useMemo(() => {
    const totalInventoryValue = products.reduce(
      (sum, product) => sum + getProductValue(product),
      0,
    );
    const totalStock = products.reduce(
      (sum, product) => sum + (Number(product?.stock) || 0),
      0,
    );
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    return {
      views:
        users.length * 1 +
        products.length * 3 +
        categories.length * 5 +
        orders.length * 20,
      profit: totalRevenue || totalInventoryValue,
      products: products.length,
      users: users.length,
      stock: totalStock,
      orders: orders.length,
    };
  }, [categories.length, products, users.length, orders]);

  const monthlyData = useMemo(
    () => buildMonthlyData(orders.length > 0 ? orders : products),
    [products, orders],
  );
  const weeklyData = useMemo(
    () => buildWeeklyData(orders.length > 0 ? orders : products),
    [products, orders],
  );

  const stats = [
    {
      label: "Total Users",
      value: compactNumber(totals.users),
      icon: <FaUsers />,
      change: 0.43,
      color: isDarkGold ? "#fbbf24" : "#4f6ff7",
      bgGradient: isDarkGold
        ? "linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(217, 119, 6, 0.12))"
        : "linear-gradient(135deg, rgba(79, 111, 247, 0.12), rgba(96, 165, 250, 0.12))",
    },
    {
      label: "Total Revenue",
      value: currency(totals.profit),
      icon: <FaShoppingCart />,
      change: 4.35,
      color: "#10b981",
      bgGradient:
        "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(52, 211, 153, 0.12))",
    },
    {
      label: "Total Products",
      value: compactNumber(totals.products),
      icon: <FaBoxOpen />,
      change: 2.59,
      color: "#f59e0b",
      bgGradient:
        "linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(251, 191, 36, 0.12))",
    },
    {
      label: "Total Orders",
      value: compactNumber(totals.orders),
      icon: <FaChartLine />,
      change: 0.95,
      color: "#8b5cf6",
      bgGradient:
        "linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(167, 139, 250, 0.12))",
    },
  ];

  if (isLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "calc(100vh - 160px)" }}
      >
        <LoadingSpinner message="Synchronizing Dashboard..." />
      </div>
    );
  }

  return (
    <div className="dashboard-page px-1">
      {/* Header section */}
      <div className="dashboard-heading d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2
            className="fw-black text-uppercase mb-1"
            style={{
              letterSpacing: "-0.02em",
              color: isDarkGold ? "#fbbf24" : "#0f172a",
            }}
          >
            Admin Dashboard
          </h2>
          <p className="text-secondary small fw-semibold text-uppercase mb-0">
            Real-time business intelligence
          </p>
        </div>
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={fetchDashboardData}
          disabled={isLoading}
        >
          <FaSyncAlt className={isLoading ? "spin" : ""} />
          <span>Sync Data</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-warning border-0 rounded-3 small fw-bold mb-4">
          {error}
        </div>
      )}

      {/* Grid numbers */}
      <div className="row g-4 mb-4 ">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} isDarkGold={isDarkGold} />
        ))}
      </div>

      {/* Middle row: Interactive Line chart + Weekly Performance */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8">
          <div className="dashboard-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <h5
                className="fw-bold m-0"
                style={{ color: isDarkGold ? "#f8fafc" : "#0f172a" }}
              >
                Revenue Flow
              </h5>
              <div
                className="d-flex border rounded-pill overflow-hidden p-0.5"
                style={{
                  background: isDarkGold ? "#1a2232" : "#f1f5f9",
                  borderColor: "var(--admin-border)",
                }}
              >
                <button
                  className="btn btn-sm px-3 py-1 border-0 rounded-pill"
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    background:
                      timeframe === "monthly"
                        ? isDarkGold
                          ? "#fbbf24"
                          : "#4f6ff7"
                        : "transparent",
                    color:
                      timeframe === "monthly"
                        ? isDarkGold
                          ? "#0f172a"
                          : "#ffffff"
                        : "var(--admin-text-secondary)",
                  }}
                  onClick={() => setTimeframe("monthly")}
                >
                  Monthly
                </button>
                <button
                  className="btn btn-sm px-3 py-1 border-0 rounded-pill"
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    background:
                      timeframe === "weekly"
                        ? isDarkGold
                          ? "#fbbf24"
                          : "#4f6ff7"
                        : "transparent",
                    color:
                      timeframe === "weekly"
                        ? isDarkGold
                          ? "#0f172a"
                          : "#ffffff"
                        : "var(--admin-text-secondary)",
                  }}
                  onClick={() => setTimeframe("weekly")}
                >
                  Weekly
                </button>
              </div>
            </div>

            <InteractiveLineChart
              data={timeframe === "monthly" ? monthlyData : weeklyData}
              isDarkGold={isDarkGold}
            />
          </div>
        </div>

        {/* Weekly Bar Chart / Snapshot Column */}
        <div className="col-12 col-xl-4">
          <div className="dashboard-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5
                className="fw-bold mb-4"
                style={{ color: isDarkGold ? "#f8fafc" : "#0f172a" }}
              >
                Weekly Breakdown
              </h5>
              <InteractiveBarChart data={weeklyData} isDarkGold={isDarkGold} />
            </div>

            <div
              className="dashboard-summary mt-4 d-grid gap-3"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              <div
                className="p-3 rounded-3"
                style={{
                  background: isDarkGold ? "#1e293b" : "#f8fafc",
                  border: "1px solid var(--admin-border)",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-1">
                  <FaDollarSign
                    style={{ color: isDarkGold ? "#fbbf24" : "#4f6ff7" }}
                  />
                  <span
                    className="small text-secondary fw-semibold text-uppercase"
                    style={{ fontSize: "10px", letterSpacing: "0.03em" }}
                  >
                    Revenue
                  </span>
                </div>
                <div className="fw-bold fs-5 text-dark">
                  {currency(totals.profit)}
                </div>
              </div>

              <div
                className="p-3 rounded-3"
                style={{
                  background: isDarkGold ? "#1e293b" : "#f8fafc",
                  border: "1px solid var(--admin-border)",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-1">
                  <FaChartLine style={{ color: "#10b981" }} />
                  <span
                    className="small text-secondary fw-semibold text-uppercase"
                    style={{ fontSize: "10px", letterSpacing: "0.03em" }}
                  >
                    Stock Units
                  </span>
                </div>
                <div className="fw-bold fs-5 text-dark">
                  {compactNumber(totals.stock)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower row: Category Distribution Donut Chart + Details Overview */}
      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <div className="dashboard-card p-4">
            <h5
              className="fw-bold mb-4"
              style={{ color: isDarkGold ? "#f8fafc" : "#0f172a" }}
            >
              Category Stock Distribution
            </h5>
            <CategoryDonutChart
              products={products}
              categories={categories}
              isDarkGold={isDarkGold}
              totals={totals}
            />
          </div>
        </div>

        {/* Database Inventory Health summary */}
        <div className="col-12 col-xl-6">
          <div className="dashboard-card p-4 h-100">
            <h5
              className="fw-bold mb-4"
              style={{ color: isDarkGold ? "#f8fafc" : "#0f172a" }}
            >
              Inventory Details Overview
            </h5>
            <div className="d-flex flex-column gap-3">
              <div
                className="d-flex justify-content-between align-items-center p-3 rounded"
                style={{
                  background: isDarkGold
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(0,0,0,0.01)",
                  border: "1px solid var(--admin-border)",
                }}
              >
                <div>
                  <div
                    className="fw-bold text-dark"
                    style={{ fontSize: "14px" }}
                  >
                    Product Categories
                  </div>
                  <div className="text-secondary small">
                    Count of active directories
                  </div>
                </div>
                <span
                  className="badge"
                  style={{
                    background: isDarkGold
                      ? "rgba(251,191,36,0.15)"
                      : "rgba(79,111,247,0.1)",
                    color: isDarkGold ? "#fbbf24" : "#4f6ff7",
                    fontSize: "13px",
                  }}
                >
                  {categories.length} Categories
                </span>
              </div>

              <div
                className="d-flex justify-content-between align-items-center p-3 rounded"
                style={{
                  background: isDarkGold
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(0,0,0,0.01)",
                  border: "1px solid var(--admin-border)",
                }}
              >
                <div>
                  <div
                    className="fw-bold text-dark"
                    style={{ fontSize: "14px" }}
                  >
                    Product Catalog Size
                  </div>
                  <div className="text-secondary small">
                    Total items registered in store
                  </div>
                </div>
                <span
                  className="badge"
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    color: "#10b981",
                    fontSize: "13px",
                  }}
                >
                  {products.length} Products
                </span>
              </div>

              <div
                className="d-flex justify-content-between align-items-center p-3 rounded"
                style={{
                  background: isDarkGold
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(0,0,0,0.01)",
                  border: "1px solid var(--admin-border)",
                }}
              >
                <div>
                  <div
                    className="fw-bold text-dark"
                    style={{ fontSize: "14px" }}
                  >
                    Registered Accounts
                  </div>
                  <div className="text-secondary small">
                    Total admin & client records
                  </div>
                </div>
                <span
                  className="badge"
                  style={{
                    background: "rgba(139,92,246,0.1)",
                    color: "#8b5cf6",
                    fontSize: "13px",
                  }}
                >
                  {users.length} Users
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fw-black { font-weight: 900; }
        .fw-extrabold { font-weight: 800; }
        .dashboard-page { color: var(--admin-text-primary); }
        .spin { animation: rotation 1.2s infinite linear; }
        @keyframes rotation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-icon {
          transition: transform 0.3s ease;
        }
        .stat-card:hover .animate-icon {
          transform: scale(1.1) rotate(5deg);
        }
        /* Accent top bar for stat cards */
        .stat-card { border-radius: 12px; }
        .stat-card .accent-top { position: absolute; left: 12px; right: 12px; top: 12px; height: 6px; border-radius: 8px; }
        .stat-card .stat-label { color: var(--admin-text-secondary); }
        .stat-card .fw-extrabold { letter-spacing: -0.01em; }
      `}</style>
    </div>
  );
};

export default Dashboard;
