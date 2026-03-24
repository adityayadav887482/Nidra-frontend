import React, { useContext, useEffect, useState } from "react";
import { sidebarDataContext } from "../context/SidebarContext";

const Events = () => {
  const {
    eventData,
    handleDataPanel,
    setsidebarVal,
    sidebarVal,
    fetchEventData,
  } = useContext(sidebarDataContext);

  const [search, setSearch] = useState("");

  useEffect(() => {
    setsidebarVal("Events");
    if (!eventData || eventData.length === 0) {
      fetchEventData();
    }
  }, [setsidebarVal]);

  // ✅ Filtered Data (IP search)
  const filteredData = eventData?.filter((item) =>
    item.ip_address?.includes(search)
  );

  // ---- Loading ----
  if (!eventData) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 text-lg">Loading event data...</p>
      </div>
    );
  }

  // ---- Empty ----
  if (eventData.length === 0) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 text-lg">No event data available</p>
      </div>
    );
  }

  return (
    sidebarVal === "Events" && (
      <div className="flex justify-center items-center bg-gray-100 pr-12 pt-6 mr-2 pb-6">
        <div className="w-[85%] bg-white shadow-xl rounded-2xl overflow-hidden">

          {/* 🔍 Header with Search */}
          <div className="flex justify-between items-center bg-gray-800 text-white p-4">
            <h2 className="text-lg font-semibold">Events</h2>

            <input
              type="text"
              placeholder="Search by IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1 rounded-md bg-gray-700 text-white focus:outline-none"
            />
          </div>

          {/* Scroll Wrapper */}
          <div className="max-h-[530px] overflow-y-auto">
            <table className="w-full border-collapse table-fixed">

              {/* Header */}
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left w-[60px]">Status</th>
                  <th className="p-3 text-left w-[150px]">IP</th>
                  <th className="p-3 text-left w-[150px]">Time</th>
                  <th className="p-3 text-left w-[300px]">Path</th>
                  <th className="p-3 text-left">Rule</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {filteredData.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => handleDataPanel(item)}
                    className="border-b hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="p-3">
                      <span
                        className={`inline-block w-4 h-4 rounded-full ${
                          item.severity === "high"
                            ? "bg-red-600"
                            : item.severity === "low"
                            ? "bg-green-600"
                            : "bg-yellow-400"
                        }`}
                      ></span>
                    </td>

                    <td className="p-3">{item.ip_address}</td>

                    <td className="p-3">
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleTimeString()
                        : "N/A"}
                    </td>

                    {/* Path with Ellipsis */}
                    <td className="p-3">
                      <div className="truncate" title={item.path}>
                        {item.path}
                      </div>
                    </td>

                    <td className="p-3">{item.rule}</td>
                  </tr>
                ))}

                {/* ❌ No Results */}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-500">
                      No matching IP found 🔍
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </div>
      </div>
    )
  );
};

export default Events;