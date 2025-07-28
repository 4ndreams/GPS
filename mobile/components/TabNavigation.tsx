import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DashboardConfig } from '../config/dashboardConfig';

interface TabNavigationProps {
  config: DashboardConfig;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  config,
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.tabsContainer}>
      {config.tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              isActive && styles.tabActivo
            ]}
            onPress={() => onTabChange(tab.key)}
          >
            <Text style={[
              styles.tabText,
              isActive && styles.tabTextActivo
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16, // Reducido para móviles
    marginTop: 8, // Reducido para móviles
    borderRadius: 8,
    padding: 3, // Reducido para móviles
  },
  tab: {
    flex: 1,
    paddingVertical: 8, // Reducido para móviles
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActivo: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12, // Reducido para móviles
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActivo: {
    color: '#374151',
  },
});
