import React, { useEffect, useState, useContext } from "react";
import { sidebarDataContext } from "../context/SidebarContext";
import axios from "axios";

const BlockedIp = () => {
  const [blockedIps, setBlockedIps] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingIp, setLoadingIp] = useState(null);
  const { setsidebarVal } = useContext(sidebarDataContext);

  // ✅ Fetch Data
  const fetchBlockedIps = async () => {
    try {
      const res = await axios.get(
        "https://nidra.onrender.com/api/blocked-ips/db"
      );
      setBlockedIps(res.data.data || []);
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch data ❌", "error");
    }
  };

  useEffect(() => {
    setsidebarVal("Blocked IPs");
    fetchBlockedIps();
  }, []);

  // ✅ Toast System
  const showToast = (msg, type = "success") => {
    const toast = document.createElement("div");
    toast.innerText = msg;
    toast.className = `fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white z-50 ${
      type === "success" ? "bg-green-600" : "bg-red-600"
    }`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  // ✅ Unblock IP
  const unblockIp = async (ip) => {
    try {
      setLoadingIp(ip);

      await axios.delete(
        "https://nidra.onrender.com/api/blocked-ips/db/" + ip
      );

      showToast(`${ip} unblocked ✅`);

      // remove instantly
      setBlockedIps((prev) =>
        prev.filter((item) => item.ip_address !== ip)
      );
    } catch (error) {
      console.error(error);
      showToast("Failed to unblock ❌", "error");
    } finally {
      setLoadingIp(null);
    }
  };

  // ✅ Filtered Data
  const filtered = blockedIps.filter((item) =>
    item.ip_address.includes(search)
  );

  return (
    <div className="flex justify-center bg-gray-100 pr-12 pt-6 pb-10 min-h-screen">
      <div className="w-[85%] bg-white rounded-xl shadow-md">

        {/* HEADER */}
        <div className="flex justify-between items-center bg-red-900 text-white p-4 rounded-t-xl">
          <h2 className="text-lg font-semibold">Blocked IPs</h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1 rounded-md text-white bg-slate-700 focus:outline-none"
            />

            <button
              onClick={fetchBlockedIps}
              className="bg-blue-600 px-3 py-1 rounded-md"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full border-collapse table-fixed">

            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left w-[25%]">IP Address</th>
                <th className="p-3 text-center w-[15%]">Status</th>
                <th className="p-3 text-center w-[20%]">Date</th>
                <th className="p-3 text-center w-[20%]">Time</th>
                <th className="p-3 text-center w-[20%]">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, index) => {
                const dateObj = new Date(item.blocked_at);

                return (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100"
                  >
                    <td className="p-3">{item.ip_address}</td>

                    {/* 🔴 Status */}
                    <td className="p-3 text-center">
                      <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">
                        Blocked
                      </span>
                    </td>

                    {/* 📅 Date */}
                    <td className="p-3 text-center">
                      {dateObj.toLocaleDateString()}
                    </td>

                    {/* ⏰ Time */}
                    <td className="p-3 text-center">
                      {dateObj.toLocaleTimeString()}
                    </td>

                    {/* 🔓 Action */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => unblockIp(item.ip_address)}
                        disabled={loadingIp === item.ip_address}
                        className="px-4 py-1 rounded-full bg-green-600 hover:bg-green-700 text-white transition flex items-center justify-center gap-2"
                      >
                        {loadingIp === item.ip_address ? (
                          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        ) : (
                          "Unblock"
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No blocked IPs 🎉
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
};

export default BlockedIp;