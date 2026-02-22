import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { getVessels } from '../data/vessels';
import VesselCard from '../components/VesselCard';

const ALL_VESSELS = getVessels();

const SORT_OPTIONS = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'bookValue', label: 'Value' },
  { key: 'annualDepreciation', label: 'Dep.' },
];

export default function VesselListScreen({ navigation }) {
  const [sortKey, setSortKey] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  const vessels = [...ALL_VESSELS].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    if (sortKey === 'name') {
      return dir * a.name.localeCompare(b.name);
    }
    return dir * (a[sortKey] - b[sortKey]);
  });

  function handleSort(key) {
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function totalFleetValue() {
    return ALL_VESSELS.reduce((s, v) => s + v.bookValue, 0);
  }

  function totalAnnualDep() {
    return ALL_VESSELS.reduce((s, v) => s + v.annualDepreciation, 0);
  }

  function formatUSD(v) {
    return `$${(v / 1_000_000).toFixed(1)}M`;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1520" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.companyName}>RoPax Shipping Co.</Text>
          <Text style={styles.subtitle}>Fleet Asset Registry · 2026</Text>
        </View>
        <View style={styles.shipIcon}>
          <Text style={{ fontSize: 28 }}>🚢</Text>
        </View>
      </View>

      {/* Fleet Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Total Fleet Value</Text>
          <Text style={styles.summaryValue}>{formatUSD(totalFleetValue())}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Annual Depreciation</Text>
          <Text style={[styles.summaryValue, { color: '#e74c3c' }]}>
            {formatUSD(totalAnnualDep())}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Vessels</Text>
          <Text style={styles.summaryValue}>{ALL_VESSELS.length}</Text>
        </View>
      </View>

      {/* Sort bar */}
      <View style={styles.sortBar}>
        <Text style={styles.sortLabel}>Sort:</Text>
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.sortBtn,
              sortKey === opt.key && styles.sortBtnActive,
            ]}
            onPress={() => handleSort(opt.key)}
          >
            <Text
              style={[
                styles.sortBtnText,
                sortKey === opt.key && styles.sortBtnTextActive,
              ]}
            >
              {opt.label}
              {sortKey === opt.key ? (sortAsc ? ' ↑' : ' ↓') : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Vessel List */}
      <FlatList
        data={vessels}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <VesselCard
            vessel={item}
            index={index}
            onPress={() => navigation.navigate('VesselDetail', { vessel: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0d1520',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  companyName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#1e90ff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  shipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a2332',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: '#1a2332',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#6677aa',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: '800',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#2a3a4a',
    marginVertical: 2,
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
    gap: 6,
  },
  sortLabel: {
    color: '#6677aa',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  sortBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#1a2332',
    borderWidth: 1,
    borderColor: '#2a3a4a',
  },
  sortBtnActive: {
    backgroundColor: '#1e3a5a',
    borderColor: '#1e90ff',
  },
  sortBtnText: {
    color: '#6677aa',
    fontSize: 12,
    fontWeight: '600',
  },
  sortBtnTextActive: {
    color: '#1e90ff',
  },
  listContent: {
    paddingBottom: 24,
  },
});
