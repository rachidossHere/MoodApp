import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// very basic calendar grid – just dumps days of the month in a wrap layout
export function CalendarGrid({ year, month, moodsData, onDatePress }) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const mood = moodsData[dateStr];
    const bgColor = mood ? mood.color : 'transparent';
    cells.push(
      <TouchableOpacity
        key={day}
        style={[styles.dayCell, { backgroundColor: bgColor }]}
        onPress={() => onDatePress(dateStr)}
      >
        <Text style={styles.dayText}>{day}</Text>
      </TouchableOpacity>
    );
  }
  return <View style={styles.grid}>{cells}</View>;
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  dayText: {
    fontSize: 12,
  },
});