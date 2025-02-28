// ApplicationContext.js
// ApplicationContext.js
import React, { createContext, useState, useContext } from "react";

const ApplicationContext = createContext(null);

export const useApplication = () => useContext(ApplicationContext);

export const ApplicationProvider = ({ children }) => {
  const [applicationType, setApplicationType] = useState(null);
  const [isApplicationTypeConfirmed, setIsApplicationTypeConfirmed] =
    useState(false);

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
