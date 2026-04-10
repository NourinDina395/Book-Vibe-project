import React, { useEffect, useState } from "react";
import { getAllReadListFromLocalDB } from "../../utils/localDB";

const COLORS = [
  "#3B8BEB",
  "#1BC99E",
  "#F5A623",
  "#E8724A",
  "#E84A4A",
  "#A78BFA",
  "#34D399",
  "#F472B6",
];

const SpikeChart = ({ data }) => {
  const width = 820;
  const height = 420;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 50;
  const paddingBottom = 70;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map((d) => d.pages));
  const roundedMax = Math.ceil(maxVal / 85) * 85;
  const colWidth = chartWidth / data.length;
  const tickCount = 4;
  const tickStep = roundedMax / tickCount;

  const makeSpikePath = (cx, tipY, baseY, barH) => {
    const sharpness = colWidth * 0.045; // very thin at tip
    const baseHalf = colWidth * 0.38;   // wide at base
    const curvePull = barH * 0.72;      // how much the sides curve inward

    return [
      `M ${cx} ${tipY}`,
      // left side: starts thin at tip, curves inward then flares to base
      `C ${cx - sharpness} ${tipY + barH * 0.08},`,
      `  ${cx - colWidth * 0.04} ${tipY + curvePull},`,
      `  ${cx - baseHalf} ${baseY}`,
      // base line
      `L ${cx + baseHalf} ${baseY}`,
      // right side mirror
      `C ${cx + colWidth * 0.04} ${tipY + curvePull},`,
      `  ${cx + sharpness} ${tipY + barH * 0.08},`,
      `  ${cx} ${tipY} Z`,
    ].join(" ");
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: "block" }}>
      {/* Grid lines & Y labels */}
      {Array.from({ length: tickCount + 1 }, (_, i) => {
        const val = i * tickStep;
        const y = paddingTop + chartHeight - (val / roundedMax) * chartHeight;
        return (
          <g key={i}>
            <line
              x1={paddingLeft} x2={paddingLeft + chartWidth}
              y1={y} y2={y}
              stroke="#c5d8ee" strokeDasharray="5 4" strokeWidth={1}
            />
            <text x={paddingLeft - 10} y={y + 4} textAnchor="end" fontSize={12} fill="#999">
              {Math.round(val)}
            </text>
          </g>
        );
      })}

      {/* Spikes */}
      {data.map((d, i) => {
        const color = COLORS[i % COLORS.length];
        const cx = paddingLeft + colWidth * i + colWidth / 2;
        const barH = (d.pages / roundedMax) * chartHeight;
        const tipY = paddingTop + chartHeight - barH;
        const baseY = paddingTop + chartHeight;
        const gradId = `grad${i}`;
        const path = makeSpikePath(cx, tipY, baseY, barH);

        return (
          <g key={i}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor={color} stopOpacity={0.25} />
                <stop offset="35%"  stopColor={color} stopOpacity={0.85} />
                <stop offset="50%"  stopColor={color} stopOpacity={1}    />
                <stop offset="65%"  stopColor={color} stopOpacity={0.85} />
                <stop offset="100%" stopColor={color} stopOpacity={0.25} />
              </linearGradient>
            </defs>

            <path d={path} fill={`url(#${gradId})`} />

            {/* Page count label */}
            <text
              x={cx} y={tipY - 10}
              textAnchor="middle" fontSize={13} fontWeight="700" fill={color}
            >
              {d.pages}
            </text>

            {/* Book name below */}
            <text
              x={cx} y={baseY + 22}
              textAnchor="middle" fontSize={11.5} fill="#444"
            >
              {d.name.length > 18 ? d.name.slice(0, 18) + "…" : d.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const PageToRead = () => {
  const [readBooks, setReadBooks] = useState([]);

  useEffect(() => {
    const books = getAllReadListFromLocalDB();
    setReadBooks(books);
  }, []);

  const chartData = readBooks.map((book) => ({
    name: book.bookName,
    pages: book.totalPages,
  }));

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">Pages to Read</h2>

      {readBooks.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No books in your read list yet. Go add some!
        </p>
      ) : (
        <div style={{
          background: "#f2f6fc",
          borderRadius: "14px",
          border: "2px solid #b8d4f0",
          padding: "20px 10px 10px",
        }}>
          <SpikeChart data={chartData} />
        </div>
      )}
    </div>
  );
};

export default PageToRead;