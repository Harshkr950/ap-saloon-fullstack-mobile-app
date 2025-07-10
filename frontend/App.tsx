/**
 * AP Saloon Mobile App
 * Luxury Hair & Beauty Salon App
 * 
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="#d4af37"
      />
      <AppNavigator />
    </>
  );
}

export default App;
