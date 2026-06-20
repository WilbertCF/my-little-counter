import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

// ──────────────────────────────────────────────────────
// DASHBOARD CHARTS — lazy-loaded so Recharts lands in its own chunk
// ──────────────────────────────────────────────────────
export function DashPie({dn}) {
  return (<ResponsiveContainer width="100%" height={130}><PieChart><Pie data={dn} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={3} dataKey="v" stroke="none" nameKey="n">
        {dn.map((d, i) => <Cell key={i} fill={d.c} />)}</Pie></PieChart></ResponsiveContainer>);
}

export function DashBar({bars}) {
  return (<ResponsiveContainer width="100%" height={110}><BarChart data={bars}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)" />
        <XAxis dataKey="n" tick={{fill: "#3a4862", fontSize: 9}} axisLine={false} tickLine={false} />
        <YAxis tick={{fill: "#3a4862", fontSize: 9}} axisLine={false} tickLine={false} tickFormatter={v => "€" + v} />
        <Bar dataKey="v" fill="rgba(0,230,168,.1)" stroke="#00e6a8" strokeWidth={1} radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer>);
}

export default DashPie;
