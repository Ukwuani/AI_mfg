import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

// import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, Activity, Send } from "lucide-react";

export default function App() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("NORMAL");

  const [messages, setMessages] = useState([
    { role: "assistant", content: "Ask me anything about your factory..." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSimulation = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/simulate");
      const json = await res.json();

      const newPoint = {
        time: new Date().toLocaleTimeString(),
        temperature: json.simulated_data.temperature,
        vibration: json.simulated_data.vibration
      };

      setData(prev => [...prev.slice(-20), newPoint]);
      setStatus(json.prediction.status);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.content,
          context: data.slice(-5) // recent sensor context
        })
      });

      const json = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: json.answer }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI service." }
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(fetchSimulation, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Grid className="p-6 grid gap-6">
      <h1 className="text-2xl font-bold">Industrial AI Dashboard</h1>

      {/* Top Metrics */}
      <Grid size={{ sm: 1, md: 3 }}
      //  className="grid grid-cols-1 md:grid-cols-3 gap-4"
       >
        <Card>
          <CardContent 
          // className="p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm">System Status</p>
              <h2 className="text-xl font-semibold">{status}</h2>
            </div>
            {status === "HIGH RISK" ? (
              <AlertTriangle className="text-red-500" />
            ) : (
              <Activity className="text-green-500" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm">Latest Temperature</p>
            <h2 className="text-xl font-semibold">
              {data.length ? data[data.length - 1].temperature.toFixed(2) : "--"}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm">Latest Vibration</p>
            <h2 className="text-xl font-semibold">
              {data.length ? data[data.length - 1].vibration.toFixed(2) : "--"}
            </h2>
          </CardContent>
        </Card>
      </Grid>

      {/* Chart */}
      <Card>
        <CardContent className="p-4">
          <h2 className="mb-4 font-semibold">Sensor Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" />
              <Line type="monotone" dataKey="vibration" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* LLM Chat Interface */}
      <Card>
        <CardContent className="p-4 flex flex-col gap-4 h-[400px]">
          <h2 className="font-semibold">Ask Your Factory (AI Copilot)</h2>

          <div className="flex-1 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl max-w-[80%] ${
                  msg.role === "user"
                    ? "ml-auto bg-black text-white"
                    : "bg-gray-100"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <p className="text-sm">AI thinking...</p>}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-xl px-3 py-2"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Why did vibration spike?"
            />
            <Button onClick={sendMessage}>
              <Send size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={fetchSimulation}>Manual Refresh</Button>
    </Grid>
  );
}


// export default App;
