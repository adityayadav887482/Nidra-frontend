import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { sidebarDataContext } from "../context/SidebarContext";
// import rulesData from '../../../data/rules.json';
// const initialRules = rulesData.enabled_rules;

// const initialRules = {
//   "SQL Injection": false,
//   "XSS Attempt": true,
//   "IP Flood": true,
//   "Suspicious User-Agent": true,
//   "Broken Authentication": true,
//   "Broken Access Control / IDOR": true,
//   "Remote Code Execution / Command Injection": true,
//   "File Upload Abuse": true,
//   "Insecure Deserialization": true
// };

const Rule = () => {

  const { sidebarVal, setsidebarVal } = useContext(sidebarDataContext);
  const [rules, setRules] = useState(null);
  const [loadingRule, setLoadingRule] = useState(null);

  useEffect(() => {
    setsidebarVal("Rule");
    async function fetchRules() {
      try {
        const res = await axios.get(
          "https://nidra.onrender.com/api/rules"
        );
        console.log(res.data.data);
        setRules(res.data.data.enabled_rules);
      } catch (err) {
        console.error("Error fetching rules:", err);
      } finally {
        setLoadingRule(null);
      }   }
    fetchRules();
  }, []);

  const toggleRule = async (ruleName) => {

    const newStatus = !rules[ruleName];

    try {

      setLoadingRule(ruleName);

      await axios.post("https://nidra.onrender.com/api/rules/update", {
        rule: ruleName,
        enabled: newStatus
      });

      setRules(prev => ({
        ...prev,
        [ruleName]: newStatus
      }));

    } catch (error) {
      console.error("Error updating rule:", error);
      alert("Failed to update rule");
    } finally {
      setLoadingRule(null);
    }
  };

  if (!rules) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading rule data...</p>
      </div>
    );
  }

  return (

    <div className="ma-h-screen bg-gray-100 flex justify-center items-start pt-10">

      <div className="w-[900px] bg-white shadow-xl rounded-xl">

        {/* Header */}
        <div className="bg-blue-900 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-wide">
            Security Rules
          </h2>
          <span className="text-sm opacity-80">
            Intrusion Detection Settings
          </span>
        </div>

        {/* Table */}
        <div className="p-4">

          <table className="w-full">

            <thead>
              <tr className="text-left border-b text-gray-600 text-sm uppercase tracking-wider">
                <th className="py-3">Rule Name</th>
                <th className="text-center">Status</th>
                <th className="text-center">Toggle</th>
              </tr>
            </thead>
          
            <tbody>

              {Object.entries(rules).map(([rule, enabled]) => (

                <tr
                  key={rule}
                  className="border-b hover:bg-gray-50 transition"
                >

                  {/* Rule Name */}
                  <td className="py-3 font-medium text-gray-800">
                    {rule}
                  </td>

                  {/* Status Badge */}
                  <td className="text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${enabled
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {enabled ? "Enabled" : "Disabled"}
                    </span>

                  </td>

                  {/* Toggle Switch */}
                  <td className="text-center">

                    <button
                      onClick={() => toggleRule(rule)}
                      disabled={loadingRule === rule}
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition
                        ${enabled ? "bg-green-500" : "bg-gray-400"}
                        
                      `}
                    >

                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition
                          ${enabled ? "translate-x-6" : "translate-x-1"}
                        `}
                      />

                    </button>

                    {loadingRule === rule && (
                      <span className="ml-3 text-xs text-gray-500">
                        Updating...
                      </span>
                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
};

export default Rule;