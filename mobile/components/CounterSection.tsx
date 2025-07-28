import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DashboardConfig } from '../config/dashboardConfig';
import { DashboardData } from '../types/dashboard';

interface CounterSectionProps {
  config: DashboardConfig;
  data: DashboardData;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const CounterSection: React.FC<CounterSectionProps> = ({
  config,
  data,
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={[styles.contadoresContainer, { backgroundColor: config.colors.primary }]}>
      {config.counters.map((counter, index) => {
        const isActive = activeTab === counter.key;
        const count = data[counter.key]?.length || 0;
        
        return (
          <TouchableOpacity
            key={counter.key}
            style={[
              styles.contador,
              isActive && styles.contadorActivo,
            ]}
            onPress={() => onTabChange(counter.key)}
          >
            <Text style={[
              styles.contadorNumero,
              isActive && styles.contadorNumeroActivo
            ]}>
              {count}
            </Text>
            <Text style={[
              styles.contadorLabel,
              isActive && styles.contadorLabelActivo
            ]}>
              {counter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  contadoresContainer: {
    flexDirection: 'row',
    paddingBottom: 16, // Reducido para móviles
    paddingHorizontal: 16, // Reducido para móviles
    gap: 8, // Reducido para móviles
  },
  contador: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10, // Reducido para móviles
    padding: 16, // Reducido para móviles
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contadorActivo: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  contadorNumero: {
    fontSize: 24, // Reducido para móviles
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contadorNumeroActivo: {
    color: '#DC2626',
  },
  contadorLabel: {
    fontSize: 10, // Reducido para móviles
    color: '#FFFFFF',
    marginTop: 2, // Reducido para móviles
    fontWeight: '600',
    textAlign: 'center',
  },
  contadorLabelActivo: {
    color: '#DC2626',
  },
});
