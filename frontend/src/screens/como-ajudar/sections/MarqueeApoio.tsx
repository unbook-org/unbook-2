import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function MarqueeApoio() {
  const items = [
    'E O PIX?',
    'APOIE O PROJETO',
    'OPEN SOURCE',
    'ESTUDANTES PARA ESTUDANTES',
    'DOE COM UM CAFÉ',
    'CÓDIGO ABERTO NA UNB',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>{item}</Text>
            </View>
            <Text style={styles.separator}>•</Text>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#009A5E',
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
    paddingVertical: 14,
    overflow: 'hidden',
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
  },
  badgePill: {
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  separator: {
    color: '#FCFAEC',
    fontSize: 14,
    fontWeight: '900',
  },
});

