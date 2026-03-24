import React, { useContext, useEffect, useState } from "react";
import { sidebarDataContext } from "../context/SidebarContext";
import axios from "axios";

const Country = () => {
  const { sidebarVal, setsidebarVal } = useContext(sidebarDataContext);

  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  // ✅ Fetch Data
  useEffect(() => {
    setsidebarVal("Countries");

    async function fetchCountries() {
      try {
        const res = await axios.get(
          "https://nidra.onrender.com/api/countries"
        );

        const dataArray = Object.entries(res.data.data).map(
          ([code, value]) => ({
            code,
            ...value,
          })
        );

        setCountries(dataArray);
        setFilteredCountries(dataArray);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    }

    fetchCountries();
  }, [setsidebarVal]);

  // ✅ Filter
  useEffect(() => {
    if (selectedCountry) {
      setFilteredCountries(
        countries.filter((c) => c.name === selectedCountry)
      );
    } else {
      setFilteredCountries(countries);
    }
  }, [selectedCountry, countries]);

  // 🔥 ✅ Smart Toggle (Block / Unblock)
  const toggleAllowed = async (code, currentStatus) => {
    try {
      const url = currentStatus
        ? "https://nidra.onrender.com/api/countries/block"
        : "https://nidra.onrender.com/api/countries/unblock";

      const res = await axios.post(url, { iso: code });

      console.log(res.data.message);

      // ✅ Update UI after success
      const updated = countries.map((c) =>
        c.code === code ? { ...c, allowed: !currentStatus } : c
      );

      setCountries(updated);
      setFilteredCountries(updated);

    } catch (error) {
      console.error("Error updating country:", error);
      alert("Failed to update country status");
    }
  };

  // ---- Loading ----
  if (!countries.length) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 text-lg">Loading country data...</p>
      </div>
    );
  }

  return (
    sidebarVal === "Countries" && (
      <div className="flex justify-center bg-gray-100 pr-7 pt-6 pb-10 min-h-screen">
        <div className="w-[80%] bg-white rounded-xl shadow-md">

          {/* HEADER */}
          <div className="flex justify-between items-center bg-blue-900 text-white p-4 rounded-t-xl">
            <h2 className="text-lg font-semibold">Country List</h2>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="text-white bg-slate-700 px-3 py-1 rounded-md"
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* TABLE */}
          <div className="max-h-[70vh] overflow-y-auto">
            <table className="w-full border-collapse table-fixed">

              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left w-[40%]">Country</th>
                  <th className="p-3 text-center w-[30%]">Continent</th>
                  <th className="p-3 text-center w-[30%]">Allowed</th>
                </tr>
              </thead>

              <tbody>
                {filteredCountries.map((item) => (
                  <tr
                    key={item.code}
                    className="border-b hover:bg-gray-100"
                  >
                    <td className="p-3">{item.name}</td>

                    <td className="p-3 text-center">
                      {item.continent}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          toggleAllowed(item.code, item.allowed)
                        }
                        className={`px-4 py-1 rounded-full text-white transition ${
                          item.allowed
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {item.allowed ? "Allowed" : "Blocked"}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredCountries.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center p-6 text-gray-500">
                      No data found
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

export default Country;