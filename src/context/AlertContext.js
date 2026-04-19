import React, { createContext, useContext, useState } from 'react';
import CustomAlert from '../components/common/CustomAlert';

const AlertContext = createContext();

export const useCustomAlert = () => useContext(AlertContext);

export function AlertProvider({ children }) {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = (title, message, buttons = [{ text: 'OK', style: 'default' }]) => {
    setAlertConfig({ visible: true, title, message, buttons });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
}
