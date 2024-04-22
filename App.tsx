// App.tsx
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import ShortestDistanceCalculator from './ShortestDistanceCalculator';

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <ShortestDistanceCalculator />
    </SafeAreaView>
  );
};

export default App;
