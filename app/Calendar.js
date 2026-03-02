import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { CalendarGrid } from '../components/CalendarGrid';
import { getMoodsByMonth, getMoodEntry, deleteMoodEntry } from '../utils/moodStorage';
import { getMoodById } from '../constants/moods';
import { getMonthName, formatDateDisplay, parseDate } from '../utils/dateUtils';

export default function CalendarScreen() {
  const router = useRouter();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [moodsData, setMoodsData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMoodDetail, setSelectedMoodDetail] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadMoodsForMonth();
    }, [currentYear, currentMonth])
  );

  const loadMoodsForMonth = async () => {
    const moods = await getMoodsByMonth(currentYear, currentMonth);
    setMoodsData(moods);
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDatePress = async (dateStr) => {
    const moodData = await getMoodEntry(dateStr);
    if (moodData && moodData.entries && moodData.entries.length > 0) {
      setSelectedDate(dateStr);
      setSelectedMoodDetail(moodData);
      setDetailModalVisible(true);
    }
  };

  const handleDeleteEntry = (entryId) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette entrée ?',
      [
        {
          text: 'Annuler',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            if (selectedDate) {
              const success = await deleteMoodEntry(selectedDate, entryId);
              if (success) {
                loadMoodsForMonth();
                setDetailModalVisible(false);
              }
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDeleteMood = () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette entrée ?',
      [
        {
          text: 'Annuler',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            setDetailModalVisible(false);
            loadMoodsForMonth();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const mood =
    selectedMoodDetail &&
    selectedMoodDetail.entries &&
    selectedMoodDetail.entries.length > 0
      ? getMoodById(
          selectedMoodDetail.entries[
            selectedMoodDetail.entries.length - 1
          ].moodId
        )
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Calendrier</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Text style={styles.monthButton}>← Précédent</Text>
          </TouchableOpacity>

          <Text style={styles.monthName}>
            {getMonthName(currentMonth)} {currentYear}
          </Text>

          <TouchableOpacity onPress={goToNextMonth}>
            <Text style={styles.monthButton}>Suivant →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekdayLabels}>
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, idx) => (
            <Text key={idx} style={styles.weekdayLabel}>
              {day}
            </Text>
          ))}
        </View>

        <CalendarGrid
          year={currentYear}
          month={currentMonth}
          moodsData={moodsData}
          onDatePress={handleDatePress}
        />

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Légende des humeurs :</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: '#8B0000' }]} />
              <Text style={styles.legendText}>Très triste</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: '#DC143C' }]} />
              <Text style={styles.legendText}>Triste</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: '#FFA500' }]} />
              <Text style={styles.legendText}>Neutre</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: '#90EE90' }]} />
              <Text style={styles.legendText}>Heureux</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: '#228B22' }]} />
              <Text style={styles.legendText}>Très heureux</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={detailModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedMoodDetail && (
                <View>
                  <Text style={styles.modalDate}>
                    {formatDateDisplay(selectedDate)}
                  </Text>

                  <Text style={styles.entriesCount}>
                    {selectedMoodDetail.entries.length} humeur
                    {selectedMoodDetail.entries.length > 1 ? 's' : ''} enregistrée
                    {selectedMoodDetail.entries.length > 1 ? 's' : ''}
                  </Text>

                  {mood && (
                    <View
                      style={[
                        styles.modalMoodCard,
                        { backgroundColor: mood.lightColor },
                      ]}
                    >
                      <Text style={styles.modalMoodEmoji}>{mood.emoji}</Text>
                      <Text style={styles.modalMoodName}>{mood.name}</Text>
                    </View>
                  )}

                  <FlatList
                    data={selectedMoodDetail.entries}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => {
                      const itemMood = getMoodById(item.moodId);
                      return (
                        <View style={[styles.modalMoodCard, { backgroundColor: itemMood.lightColor }]}> 
                          <View style={styles.moodCardHeader}>
                            <View>
                              <Text style={styles.modalMoodEmoji}>{itemMood.emoji}</Text>
                              <Text style={styles.modalMoodName}>{itemMood.name}</Text>
                            </View>
                            <Text style={styles.moodTime}>
                              {new Date(item.timestamp).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Text>
                          </View>

                          {item.feelings && (
                            <View style={styles.modalDetail}>
                              <Text style={styles.modalDetailLabel}>Ce que je ressens :</Text>
                              <Text style={styles.modalDetailText}>
                                {item.feelings}
                              </Text>
                            </View>
                          )}

                          {item.reason && (
                            <View style={styles.modalDetail}>
                              <Text style={styles.modalDetailLabel}>Raison :</Text>
                              <Text style={styles.modalDetailText}>
                                {item.reason}
                              </Text>
                            </View>
                          )}

                          <TouchableOpacity
                            style={styles.deleteItemButton}
                            onPress={() => handleDeleteEntry(item.id)}
                          >
                            <Text style={styles.deleteItemText}>🗑️ Supprimer</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  backButton: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 52 : 22,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  monthButton: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  monthName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  weekdayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#777',
  },
  legend: {
    padding: 20,
  },
  legendTitle: {
    fontWeight: '600',
    marginBottom: 10,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  colorBox: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  closeButton: {
    fontSize: 24,
    alignSelf: 'flex-end',
  },
  modalDate: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  entriesCount: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  modalMoodCard: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalMoodEmoji: {
    fontSize: 24,
  },
  modalMoodName: {
    fontSize: 16,
    fontWeight: '600',
  },
  moodCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodTime: {
    fontSize: 12,
    color: '#333',
  },
  modalDetail: {
    marginTop: 8,
  },
  modalDetailLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalDetailText: {
    fontSize: 12,
    color: '#333',
  },
  deleteItemButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  deleteItemText: {
    color: '#d00',
    fontWeight: '600',
  },
});
