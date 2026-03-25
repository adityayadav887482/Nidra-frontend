import React, { Children, createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export let sidebarDataContext = createContext();
const countriesArray = [
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
];


const SidebarContext = ({children}) => {

   const [sidebarVal, setsidebarVal] = useState("All Request");
   const [itmDataPannel, setItmDataPannel] = useState(null)
   const [dataPanel, setdataPanel] = useState(false)
   const [alltraficData, setAlltraficData] = useState([])
   const [eventData, setEventData] = useState([])
   const navigate = useNavigate()

const fetchAllTrafficData = async () => {
    try {
      const response = await axios.get('https://nidra.onrender.com/api/traffic/db');
      const trafficData = response.data;
      console.log(trafficData.data)
    // setAlltraficData(Array.isArray(response.data) ? response.data : []);
    setAlltraficData(prev => [...prev, ...trafficData.data]);

    } catch (error) {
      console.log(error);
    }
  }         




  const fetchEventData = async () => {
    try {
      const response = await axios.get('https://nidra.onrender.com/api/events/db');
      // const response = await axios.get('http://localhost:8000/api/events?start=0&limit=20');
      const eventData = response.data;
      console.log(eventData.data)
    // setAlltraficData(Array.isArray(response.data) ? response.data : []);
    setEventData(prev => [...prev, ...eventData.data]);
    
    } catch (error) {
      console.log(error);
    }
  }


    
   const reqHandler = () => { 
        navigate('/')
        fetchAllTrafficData()
    }

     const eventHandler = () => { 
        fetchEventData()
        navigate('/events')

    }

    const blockedIPHandler = () => { 
        navigate('/blockedip')
    }
  
    const countryHandler = () => { 
        navigate('/countries')
    }

    const ruleHandler = () => { 
        navigate('/rule')
    }

    const highHandler = () => { 
        navigate('/high')
    }

    const handleDataPanel = (item) => {
      setItmDataPannel(item)
       navigate('/datapanel')
    }

   let value = {
  sidebarVal, setsidebarVal, dataPanel, setdataPanel, reqHandler, blockedIPHandler, countryHandler, ruleHandler, highHandler, handleDataPanel, eventHandler, alltraficData, eventData, itmDataPannel, setItmDataPannel, fetchAllTrafficData, fetchEventData, countriesArray
}

  return (
    <sidebarDataContext.Provider value={value}>
        {children}
    </sidebarDataContext.Provider>
  )
}

export default SidebarContext
