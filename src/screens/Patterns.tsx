import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Modal, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
};

type Patterns = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

function Patterns({ navigation }: Patterns) {
    const [pattern, setPattern] = useState<number[]>([...Array(10)].map(() => 0)); // Initialize with 1 row
    const [selectedGridIndex, setSelectedGridIndex] = useState<number>(-1);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputDuration, setInputDuration] = useState('');
    const [numRows, setNumRows] = useState(1);

  const loadPatternFromStorage = async () => {
    try {
      const savedPattern = await AsyncStorage.getItem('vibrationPattern');
      if (savedPattern) {
        setPattern(JSON.parse(savedPattern));
      }
    } catch (error) {
      console.error('Error loading pattern from storage:', error);
    }
  };

  const savePatternToStorage = async (patternToSave: number[]) => {
    try {
      await AsyncStorage.setItem('vibrationPattern', JSON.stringify(patternToSave));
    } catch (error) {
      console.error('Error saving pattern to storage:', error);
    }
  };

  const deletePatternFromStorage = async () => {
    try {
      await AsyncStorage.removeItem('vibrationPattern');
      setPattern([...Array(10)].map(() => 0)); // Reset pattern to default when deleting
    } catch (error) {
      console.error('Error deleting pattern from storage:', error);
    }
  };

  
  const handleSaveButtonPress = () => {
    savePatternToStorage(pattern);
  };

  const handleDeleteButtonPress = () => {
    deletePatternFromStorage();
  };

  const handleStartButtonPress = () => {
    console.log("pattern", pattern);
    const newPattern = [0, ...pattern];
    const formattedPattern = [];
  
    for (let i = 0; i < newPattern.length; i++) {
      if (i % 2 === 0) {
        if (newPattern[i] === 0) {
          formattedPattern.push(400); // Add 400 for even indices with 0 duration
        } else {
          formattedPattern.push(newPattern[i]); // Duration for even indices with non-zero duration
        }
      } else {
        formattedPattern.push(newPattern[i]); // Odd indices (vibration duration)
      }
    }

    Vibration.vibrate(formattedPattern, false);
    console.log("formattedPattern", formattedPattern);
  };

  const handleGridPress = (index: number) => {
    setSelectedGridIndex(index);
    setModalVisible(true);
  };

  const handleModalSubmit = () => {
    const duration = parseInt(inputDuration);
    if (!isNaN(duration) && duration >= 0) {
      const updatedPattern = [...pattern];
      updatedPattern[selectedGridIndex] = duration;
      setPattern(updatedPattern);
    }
    setInputDuration('');
    setModalVisible(false);
  };

  const handleRemoveRow = (rowIndex: number) => {
    if (numRows > 1) {
      setNumRows(numRows - 1);
      setPattern((prevPattern) => {
        const startIdx = rowIndex * 10;
        const endIdx = startIdx + 10;
        return [...prevPattern.slice(0, startIdx), ...prevPattern.slice(endIdx)];
      });
    }
  };

  const handleAddRow = () => {
    if (numRows < 5) {
      setNumRows(numRows + 1);
      setPattern((prevPattern) => [...prevPattern, ...Array(10).fill(0)]); // Add a new row to the pattern
    }
  };


  const renderGridCell = (rowIndex: number, colIndex: number) => {
    const index = rowIndex * 10 + colIndex;
    const duration = pattern[index];
    const isEmpty = duration === undefined || duration === 0;

    return (
      <TouchableOpacity
        key={index}
        style={[styles.gridCell, isEmpty ? styles.emptyCell : styles.filledCell]}
        onPress={() => handleGridPress(index)}
      >
        <Text style={styles.gridCellText}>{isEmpty ? 'Empty' : `${duration}ms`}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patterns</Text>
      <View style={styles.gridContainer}>
        {Array.from({ length: numRows }, (_, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {Array.from({ length: 10 }, (_, colIndex) => renderGridCell(rowIndex, colIndex))}
            {numRows > 1 && rowIndex === numRows - 1 && ( // Display "Remove Row" button for the last row only
              <TouchableOpacity
                style={styles.removeRowButton}
                onPress={() => handleRemoveRow(rowIndex)}
              >
                <Text style={styles.removeRowButtonText}>Remove Row -</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addRowButton} onPress={handleAddRow}>
        <Text style={styles.addRowButtonText}>+ Add Row</Text>
      </TouchableOpacity>
 
                <TouchableOpacity style={styles.startButton} onPress={handleStartButtonPress}>
          <Text style={styles.buttonText}>Test</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveButtonPress}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteButtonPress}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity> 

      <Modal animationType="fade" visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Duration (ms)"
              value={inputDuration}
              onChangeText={setInputDuration}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleModalSubmit}>
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEADD',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  gridContainer: {
    flexDirection: 'column',
    padding: 16, // Add padding around the grid
    position: 'relative', // Needed for positioning the Add Row button
  },
  emptyCell: {
    backgroundColor: '#FFF',
  },
  filledCell: {
    backgroundColor: '#FF6666',
  },
  gridCellText: {
    fontSize: 12,
  },
  startButton: {
    backgroundColor: '#FF6666',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    color: 'black',
  },
  modalButton: {
    backgroundColor: '#FF6666',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addRowButton: {
    backgroundColor: '#66FF66',
    padding: 8,
    borderRadius: 8,
    bottom: 13,
    left: 135
  },
  gridAndButtonContainer: {
    flex: 1,
    position: 'relative',
  },
  addRowButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the grid cells horizontally
  },
  gridCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#000',
    minWidth: 35, // Set a minimum width for the grid cells
    minHeight: 35, // Set a minimum height for the grid cells
  },
  addRowButtonContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 16, // Adjust this value to control the spacing of the button from the bottom and right edges of the grid
  },
  removeRowButton: {
    backgroundColor: '#FF6666',
    padding: 8,
    borderRadius: 8,
    top: 38,
    right: 85,
    position: 'absolute',
  },
  removeRowButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  saveButton: {
    backgroundColor: '#66CCFF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },

  deleteButton: {
    backgroundColor: '#FF6666',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  
});

export default Patterns;
