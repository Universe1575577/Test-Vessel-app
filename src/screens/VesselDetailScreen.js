import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
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
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function Row({ label, value, valueColor }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export default function VesselDetailScreen({ route, navigation }) {
  const { vessel } = route.params;

  const depreciationPct = (
    (vessel.accumulatedDepreciation / vessel.originalCost) * 100
  ).toFixed(1);

  const remainingLife = Math.max(vessel.usefulLifeYears - vessel.age, 0);

  const healthColor =
    vessel.bookValue / vessel.originalCost > 0.6
      ? '#2ecc71'
      : vessel.bookValue / vessel.originalCost > 0.3
      ? '#f39c12'
      : '#e74c3c';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1520" />

      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Fleet</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Vessel hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🚢</Text>
          <Text style={styles.heroName}>{vessel.name}</Text>
          <Text style={styles.heroSub}>
            {FLAG_EMOJI[vessel.flag] || ''} {vessel.flag} · {vessel.type}
          </Text>
        </View>

        {/* Book value highlight */}
        <View style={[styles.highlightBox, { borderColor: healthColor }]}>
          <Text style={styles.highlightLabel}>Current Book Value</Text>
          <Text style={[styles.highlightValue, { color: healthColor }]}>
            {formatUSD(vessel.bookValue)}
          </Text>
          <Text style={styles.highlightSub}>
            as of 2026 · {(100 - parseFloat(depreciationPct)).toFixed(1)}% of original cost
          </Text>
        </View>

        {/* Depreciation progress bar */}
        <View style={styles.barSection}>
          <View style={styles.barLabels}>
            <Text style={styles.barLabelLeft}>Depreciated {depreciationPct}%</Text>
            <Text style={styles.barLabelRight}>
              {(100 - parseFloat(depreciationPct)).toFixed(1)}% remaining
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(parseFloat(depreciationPct), 100)}%`,
                  backgroundColor: healthColor,
                },
              ]}
            />
          </View>
        </View>

        {/* Vessel Info */}
        <Section title="Vessel Information">
          <Row label="IMO Name" value={vessel.name} />
          <Row label="Type" value={vessel.type} />
          <Row label="Flag State" value={`${FLAG_EMOJI[vessel.flag] || ''} ${vessel.flag}`} />
          <Row label="Gross Tonnage" value={`${vessel.grossTonnage.toLocaleString()} GT`} />
          <Row label="Year Built" value={vessel.yearBuilt.toString()} />
          <Row label="Vessel Age" value={`${vessel.age} years`} />
        </Section>

        {/* Financial Details */}
        <Section title="Asset Valuation">
          <Row label="Original Cost" value={formatUSD(vessel.originalCost)} />
          <Row label="Residual Value" value={formatUSD(vessel.residualValue)} />
          <Row
            label="Annual Depreciation"
            value={formatUSD(vessel.annualDepreciation)}
            valueColor="#e74c3c"
          />
          <Row
            label="Accumulated Depreciation"
            value={formatUSD(vessel.accumulatedDepreciation)}
            valueColor="#e67e22"
          />
          <Row
            label="Current Book Value"
            value={formatUSD(vessel.bookValue)}
            valueColor={healthColor}
          />
        </Section>

        {/* Depreciation Schedule */}
        <Section title="Depreciation Schedule">
          <Row label="Method" value="Straight-Line (SL)" />
          <Row label="Useful Life" value={`${vessel.usefulLifeYears} years`} />
          <Row label="Depreciation Rate" value={`${(100 / vessel.usefulLifeYears).toFixed(1)}% p.a.`} />
          <Row label="Age" value={`${vessel.age} years`} />
          <Row label="Remaining Life" value={`${remainingLife} years`} />
        </Section>

        {/* Year-by-year depreciation table */}
        <Section title="Depreciation Table">
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Year</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Annual Dep.</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Book Value</Text>
          </View>
          {Array.from({ length: vessel.usefulLifeYears }, (_, i) => {
            const year = vessel.yearBuilt + i + 1;
            const depreciableAmount =
              vessel.originalCost - vessel.residualValue;
            const annual = depreciableAmount / vessel.usefulLifeYears;
            const bv = Math.max(
              vessel.originalCost - annual * (i + 1),
              vessel.residualValue
            );
            const isCurrent = year === 2026;
            return (
              <View
                key={year}
                style={[styles.tableRow, isCurrent && styles.tableRowHighlight]}
              >
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellText,
                    isCurrent && styles.tableCellActive,
                  ]}
                >
                  {year}{isCurrent ? ' ◀' : ''}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellText,
                    isCurrent && styles.tableCellActive,
                  ]}
                >
                  {formatUSD(annual)}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellText,
                    isCurrent && styles.tableCellActive,
                    { color: isCurrent ? healthColor : '#dde8f0' },
                  ]}
                >
                  {formatUSD(bv)}
                </Text>
              </View>
            );
          })}
        </Section>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0d1520',
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backText: {
    color: '#1e90ff',
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  heroEmoji: {
    fontSize: 52,
    marginBottom: 10,
  },
  heroName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  heroSub: {
    color: '#8899aa',
    fontSize: 14,
    marginTop: 6,
  },
  highlightBox: {
    backgroundColor: '#1a2332',
    borderRadius: 14,
    marginHorizontal: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 16,
  },
  highlightLabel: {
    color: '#6677aa',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  highlightValue: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 1,
  },
  highlightSub: {
    color: '#8899aa',
    fontSize: 13,
    marginTop: 6,
  },
  barSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barLabelLeft: {
    color: '#8899aa',
    fontSize: 12,
    fontWeight: '600',
  },
  barLabelRight: {
    color: '#8899aa',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#2a3a4a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    color: '#1e90ff',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  sectionBody: {
    backgroundColor: '#1a2332',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a3a4a',
  },
  rowLabel: {
    color: '#8899aa',
    fontSize: 14,
  },
  rowValue: {
    color: '#dde8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#0d1a2a',
  },
  tableHeaderText: {
    color: '#6677aa',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#2a3a4a',
  },
  tableRowHighlight: {
    backgroundColor: '#1e3a5a',
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
  },
  tableCellText: {
    color: '#8899aa',
  },
  tableCellActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
