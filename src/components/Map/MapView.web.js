import React from 'react';
import { View, Text } from 'react-native';

const MapView = ({ style, children }) => {
  return (
    <View style={[style, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0' }]}>
      <Text style={{ fontFamily: 'Inter-Medium', color: '#666', textAlign: 'center', padding: 20 }}>
        Mapa não suportado no Web Browser.{'\n'}Use o Android Simulator ou iOS.
      </Text>
      {children}
    </View>
  );
};

export default MapView;
