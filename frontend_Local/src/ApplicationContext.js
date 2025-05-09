// ApplicationContext.js
// ApplicationContext.js
import React, { createContext, useState, useContext } from "react";

const ApplicationContext = createContext(null);

export const useApplication = () => useContext(ApplicationContext);

export const ApplicationProvider = ({ children }) => {
  const [applicationType, setApplicationType] = useState(null);
  console.log("Application Type in context:", applicationType);
  const [isApplicationTypeConfirmed, setIsApplicationTypeConfirmed] =
    useState(0);


  return (
    <ApplicationContext.Provider
      value={{
        applicationType,
        setApplicationType,
        isApplicationTypeConfirmed,
        setIsApplicationTypeConfirmed,

      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
