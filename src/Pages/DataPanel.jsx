import React, { useContext, useEffect, useState } from "react";
import { sidebarDataContext } from "../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DataPanel() {
  const { itmDataPannel, setItmDataPannel } = useContext(sidebarDataContext);
  const navigate = useNavigate();

  const [ipEvents, setIpEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [isBlocked, setIsBlocked] = useState(true);

  // ✅ Fetch events of selected IP
  useEffect(() => {
    if (!itmDataPannel) {
      navigate("/events");
      return;
    }

    const fetchIpEvents = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `https://nidra.onrender.com/api/events/db/ip/${itmDataPannel.ip_address}`
        );

        setIpEvents(res.data.data || []);
      } catch (err) {
        console.error("Error fetching IP events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIpEvents();
  }, [navigate]);

  // 🔥 Block / Unblock API
  const toggleBlock = async () => {
    try {
      setBlocking(true);

      const url = isBlocked
        ? "https://nidra.onrender.com/api/blocked-ips/db"
        : "https://nidra.onrender.com/api/blocked-ips/db/";
      if(isBlocked){
      await axios.post(url, {
        ip: itmDataPannel.ip_address,
      });
    }
    else {     
       await axios.delete(url+ itmDataPannel.ip_address);
    }

      setIsBlocked(!isBlocked);
    } catch (err) {
      console.error("Block error:", err);
      alert("Action failed");
    } finally {
      setBlocking(false);
    }
  };

  return (
    itmDataPannel && (
      <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4 pr-16 pt-10 gap-6">

        {/* 🔥 TOP SUMMARY CARD */}
        <div className="w-[88%] bg-white shadow-xl rounded-xl p-6">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              IP: {itmDataPannel.ip_address}
            </h2>

            {/* BLOCK BUTTON */}
            <button
              onClick={toggleBlock}
              disabled={blocking}
              className={`px-6 py-2 rounded-lg text-white transition ${!isBlocked
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
                }`}
            >
              {blocking
                ? "Processing..."
                : !isBlocked
                  ? "Unblock"
                  : "Block"}
            </button>
          </div>

          {/* GRID INFO */}
          <div className="grid grid-cols-2 gap-4 text-sm">

            <p><strong>Rule:</strong> {itmDataPannel.rule}</p>
            <p><strong>Severity:</strong> {itmDataPannel.severity}</p>
            <p><strong>Path:</strong> {itmDataPannel.path}</p>
            <p><strong>Method:</strong> {itmDataPannel.method}</p>
            <p><strong>Country:</strong> {itmDataPannel.country}</p>
            <p><strong>User Agent:</strong> {itmDataPannel.user_agent}</p>
            <p className="col-span-2">
              <strong>Description:</strong> {itmDataPannel.description}
            </p>

          </div>
        </div>

        {/* 🔥 EVENTS TABLE */}
        {/* 🔥 EVENTS TABLE */}
        <div className="w-[90%] bg-white shadow-xl rounded-xl mr-6 overflow-hidden">

          <div className="bg-gray-800 text-white p-4">
            <h3 className="text-lg">All Events for this IP</h3>
          </div>

          {/* Scroll Container */}
          <div className="max-h-[270px] overflow-y-auto">

            <table className="w-full table-fixed border-collapse">

              {/* ✅ Sticky Header */}
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left w-[15%]">Time</th>
                  <th className="p-3 text-left w-[10%]">Method</th>
                  <th className="p-3 text-left w-[25%]">Path</th>
                  <th className="p-3 text-left w-[20%]">Rule</th>
                  <th className="p-3 text-left w-[10%]">Severity</th>
                  <th className="p-3 text-left w-[20%]">User Agent</th>
                </tr>
              </thead>

              {/* ✅ Scrollable Body */}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center p-6">
                      Loading...
                    </td>
                  </tr>
                ) : ipEvents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-gray-500">
                      No events found
                    </td>
                  </tr>
                ) : (
                  ipEvents.map((event, index) => {
                    const dateObj = new Date(event.timestamp);

                    return (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-100 cursor-pointer"
                    onClick={()=>{setItmDataPannel((prev)=> ({...prev, rule: event.rule, severity: event.severity, path: event.path, method: event.method, country: event.country, user_agent: event.user_agent, description: event.description}))}}  >
                        <td className="p-3">
                          {dateObj.toLocaleTimeString()}
                        </td>

                        <td className="p-3">{event.method}</td>

                        <td className="p-3">
                          <div className="truncate" title={event.path}>
                            {event.path}
                          </div>
                        </td>

                        <td className="p-3">{event.rule}</td>

                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-white text-xs ${event.severity === "high"
                                ? "bg-red-600"
                                : event.severity === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-600"
                              }`}
                          >
                            {event.severity}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="truncate" title={event.user_agent}>
                            {event.user_agent}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    )
  );
}
