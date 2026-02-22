import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const FLAG_EMOJI = {
  Greece: '🇬🇷',
  Finland: '🇫🇮',
  Italy: '🇮🇹',
  Norway: '🇳🇴',
  Ireland: '🇮🇪',
  Spain: '🇪🇸',
  Turkey: '🇹🇷',
  Portugal: '🇵🇹',
  Netherlands: '🇳🇱',
};

function formatUSD(value) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  return `$${value.toLocaleString()}`;
}

function getHealthColor(vessel) {
  const ratio = vessel.bookValue / vessel.originalCost;
  if (ratio > 0.6) return '#2ecc71';
  if (ratio > 0.3) return '#f39c12';
  return '#e74c3c';
}

export default function VesselCard({ vessel, index, onPress }) {
  const healthColor = getHealthColor(vessel);
  const depreciationPct = (
    (vessel.accumulatedDepreciation / vessel.originalCost) * 100
  ).toFixed(1);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.vesselName}>{vessel.name}</Text>
          <Text style={styles.vesselSub}>
            {FLAG_EMOJI[vessel.flag] || '🚢'} {vessel.flag} · {vessel.type}
          </Text>
        </View>
        <View style={[styles.ageBadge, { borderColor: healthColor }]}>
          <Text style={[styles.ageNumber, { color: healthColor }]}>
            {vessel.age}
          </Text>
          <Text style={styles.ageLabel}>yrs</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Book Value</Text>
          <Text style={[styles.statValue, { color: healthColor }]}>
            {formatUSD(vessel.bookValue)}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Annual Dep.</Text>
          <Text style={styles.statValue}>
            {formatUSD(vessel.annualDepreciation)}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Depreciated</Text>
          <Text style={styles.statValue}>{depreciationPct}%</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${Math.min(parseFloat(depreciationPct), 100)}%`,
              backgroundColor: healthColor,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a2332',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#1e90ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  indexBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  indexText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  titleBlock: {
    flex: 1,
  },
  vesselName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  vesselSub: {
    color: '#8899aa',
    fontSize: 12,
    marginTop: 2,
  },
  ageBadge: {
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ageNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  ageLabel: {
    color: '#8899aa',
    fontSize: 10,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#2a3a4a',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#6677aa',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    color: '#dde8f0',
    fontSize: 15,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#2a3a4a',
  },
  progressContainer: {
    height: 5,
    backgroundColor: '#2a3a4a',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
