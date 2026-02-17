import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Analytics = () => {
  const location = useLocation();
  const [data, setData] = useState(location.state || null);

  useEffect(() => {
    if (!data) fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/resume/latest",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) return <p style={{ padding: "40px" }}>Loading analysis...</p>;

  const probabilityData = [
    { name: "Placement", value: data.placementProbability },
  ];

  const missingSkillsData = (data.missingSkills || []).map((skill) => ({
    skill,
    value: 1,
  }));

  return (
    <div style={{ padding: "40px", background: "#f5f7fa", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "30px" }}>Resume Analytics Dashboard</h2>

      {/* Top Cards */}
      <div style={{ display: "flex", gap: "30px", marginBottom: "40px" }}>
        {/* ATS Score Card */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h3>ATS Score</h3>
          <h1 style={{ fontSize: "42px", margin: "10px 0" }}>
            {data.atsScore}/100
          </h1>

          <div
            style={{
              height: "12px",
              background: "#eee",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${data.atsScore}%`,
                background:
                  data.atsScore > 70 ? "#4CAF50" : "#FF9800",
                height: "100%",
              }}
            />
          </div>
        </div>

        {/* Placement Probability Radial Chart */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h3>Placement Probability</h3>

          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={probabilityData}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={10}
                fill="#3f51b5"
              />
            </RadialBarChart>
          </ResponsiveContainer>

          <h2 style={{ textAlign: "center" }}>
            {data.placementProbability}%
          </h2>
        </div>
      </div>

      {/* Missing Skills Chart */}
      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h3>Missing Skills</h3>

        {missingSkillsData.length === 0 ? (
          <p>No major skill gaps detected 🎯</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={missingSkillsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" fill="#f44336" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Analytics;
