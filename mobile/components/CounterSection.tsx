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
    paddingBottom: 20,
    paddingHorizontal: 20,
    gap: 10,
  },
  contador: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contadorActivo: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  contadorNumero: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contadorNumeroActivo: {
    color: '#DC2626',
  },
  contadorLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  contadorLabelActivo: {
    color: '#DC2626',
  },
});
