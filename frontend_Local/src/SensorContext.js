import React, { createContext, useState, useContext } from "react";

const ApplicationContext = createContext(null);

export const useApplication1 = () => useContext(ApplicationContext);

export const ApplicationProviders = ({ children }) => {
  const [soilMoistureSensor, setSoilMoistureSensor] = useState(null);
  const [isApplicationTypeConfirmed1, setIsApplicationTypeConfirmed1] =
    useState(false);

  return (
    <ApplicationContext.Provider
      value={{
        soilMoistureSensor,
        setSoilMoistureSensor,
        isApplicationTypeConfirmed1,
        setIsApplicationTypeConfirmed1,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
