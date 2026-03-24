import React, { useContext, useEffect } from "react";
import { sidebarDataContext } from "../context/SidebarContext";

export default function ScrollableTable() {
  const { sidebarVal, setsidebarVal, alltraficData, fetchAllTrafficData } =
    useContext(sidebarDataContext);

  useEffect(() => {
    setsidebarVal("All Request");

    if (!alltraficData || alltraficData.length === 0) {
      fetchAllTrafficData();
    }
  }, [setsidebarVal]);

  // ---- Loading State ----
  if (!alltraficData) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 text-lg">Loading traffic data...</p>
      </div>
    );
  }

  // ---- Empty State ----
  if (alltraficData.length === 0) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 text-lg">No traffic data available</p>
      </div>
    );
  }

  return (
    sidebarVal === "All Request" && (
      <div className="flex justify-center items-center bg-gray-100 pr-8 pt-6 pb-6">
        <div className="w-[82%] bg-white shadow-xl rounded-2xl overflow-hidden">
          
          {/* Scroll Container */}
          <div className="max-h-[570px] overflow-y-auto">
            <table className="w-full border-collapse">
              
              {/* Sticky Header */}
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-center">IP</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">Time</th>
                  <th className="p-3 text-center">Path</th>
                  <th className="p-3 text-center">Country</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {alltraficData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="p-3 text-left">{item.ip_address}</td>

                    <td className="p-3 text-left">
                      {item.timestamp
                        ? new Date(item.timestamp).toDateString()
                        : "N/A"}
                    </td>

                    <td className="p-3 text-left">
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleTimeString()
                        : "N/A"}
                    </td>

                    <td className="p-3 text-left">{item.path}</td>
                    <td className="p-3 text-left">{item.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    )
  );
}