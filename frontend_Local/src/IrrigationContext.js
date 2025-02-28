// ApplicationContext.js
// ApplicationContext.js
import React, { createContext, useState, useContext } from "react";

const ApplicationContext = createContext(null);

export const useApplication = () => useContext(ApplicationContext);

export const ApplicationProvideri = ({ children }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isApplicationTypeConfirmed, setIsApplicationTypeConfirmed] =
    useState(false);

  return (
    <ApplicationContext.Provider
      value={{
        selectedOption,
        setSelectedOption,
        isApplicationTypeConfirmed,
        setIsApplicationTypeConfirmed,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
