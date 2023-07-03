import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Modal, TextInput, Alert,  Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSaveModal from './components/CustomSaveModal';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScreenWidth } from '@rneui/themed/dist/config';
import { useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
};

type Patterns = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

type DropdownItem = {
  label: string;
  value: string;
};

function Patterns({ navigation }: Patterns) {
    const [pattern, setPattern] = useState<number[]>([...Array(10)].map(() => 0)); // Initialize with 1 row
    const [selectedGridIndex, setSelectedGridIndex] = useState<number>(-1);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputDuration, setInputDuration] = useState('');
    const [numRows, setNumRows] = useState(1);
    const [patternName, setPatternName] = useState('');
    const [customModalVisible, setCustomModalVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<null | number>(null);
    const [selectedPatternName, setSelectedPatternName] = useState<string>('');
    const [createdPatterns, setCreatedPatterns] = useState<{ name: string; pattern: number[] }[]>([]);
    const [savedPatternNames, setSavedPatternNames] = useState<string[]>([]);
    const [items, setItems] = useState<DropdownItem[]>([]);
    const [delay, setDelay] = useState<string>('400');

    const resetState = () => {
      setPattern([...Array(10)].map(() => 0));
      setSelectedGridIndex(-1);
      setModalVisible(false);
      setInputDuration('');
      setNumRows(1);
      setCustomModalVisible(false);
      setDelay('400');
    };
  
    useFocusEffect(
      React.useCallback(() => {
        resetState();
      }, [])
    );


    useEffect(() => {
      loadSavedPatterns();
    }, []);


    const loadSavedPatterns = async () => {
      try {
        const savedPatternsString = await AsyncStorage.getItem('vibrationPatterns');
        if (savedPatternsString) {
          const savedPatterns: { [key: string]: number[] } = JSON.parse(savedPatternsString);
          const patternNames = Object.keys(savedPatterns);
          setSavedPatternNames(patternNames);
          const dropdownItems: DropdownItem[] = patternNames.map((name) => ({
            label: name,
            value: name,
          }));
          setItems(dropdownItems);
        }
      } catch (error) {
        console.error('Error loading saved patterns:', error);
      }
    };
  
  
    const loadPatternFromStorage = async () => {
      try {
        const savedPatternsString = await AsyncStorage.getItem('vibrationPatterns');
        if (savedPatternsString) {
          const savedPatterns: { [key: string]: number[] } = JSON.parse(savedPatternsString);
          console.log("Saved Patterns:", savedPatterns);
  
          // Use the selected pattern name instead of 'Fifth Pattern'
          const loadedPatternName = selectedPatternName;
          const loadedPattern = savedPatterns[loadedPatternName];
  
          // Update the pattern state with the loaded pattern
          if (loadedPattern) {
            // Check for occurrences of 400 and change them to 0
            const modifiedPattern = loadedPattern.map(duration => (duration === 400 ? 0 : duration));
            modifiedPattern.shift();
            setPattern(modifiedPattern);
          }
        }
      } catch (error) {
        console.error('Error loading pattern from storage:', error);
      }
    };

  const savePatternToStorage = async (patternName: string, patternToSave: number[]) => {
    try {
      // Get the existing patterns from storage
      const savedPatternsString = await AsyncStorage.getItem('vibrationPatterns');
      const savedPatterns: { [key: string]: number[] } = savedPatternsString
        ? JSON.parse(savedPatternsString)
        : {};

      // Add the new pattern to the existing patterns
      savedPatterns[patternName] = patternToSave;
      console.log("savedPatterns", savedPatterns);

      // Save the updated patterns back to storage
      await AsyncStorage.setItem('vibrationPatterns', JSON.stringify(savedPatterns));
    } catch (error) {
      console.error('Error saving pattern to storage:', error);
    }
  };

  const deletePatternFromStorage = async (patternNameToDelete: string) => {
    try {
      const savedPatternsString = await AsyncStorage.getItem('vibrationPatterns');
      if (savedPatternsString) {
        const savedPatterns: { [key: string]: number[] } = JSON.parse(savedPatternsString);
  
        // Delete the pattern with the given name
        delete savedPatterns[patternNameToDelete];
        console.log("deleted ", patternNameToDelete);
  
        // Save the updated patterns back to storage
        await AsyncStorage.setItem('vibrationPatterns', JSON.stringify(savedPatterns));
  
        // Reset the pattern to default if the deleted pattern was currently displayed
        if (patternName === patternNameToDelete) {
          setPattern([...Array(10)].map(() => 0));
        }
      }
    } catch (error) {
      console.error('Error deleting pattern from storage:', error);
    }
  };

  
  const handleSaveButtonPress = () => {
    // Check if all grids are empty
    const isPatternEmpty = pattern.every(duration => duration === 0);
  
    if (isPatternEmpty) {
      // Show an alert or a modal to inform the user to set a pattern first
      Alert.alert(
        'Empty Pattern',
        'Please set a vibration pattern before saving.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    } else {
      // Open the custom save modal
      setCustomModalVisible(true);
    }
  };

  const handleDeleteButtonPress = () => {
    const patternNameToDelete = selectedPatternName; // Replace 'Third Pattern' with the desired pattern name to delete
    deletePatternFromStorage(patternNameToDelete);
  };

  const handleLoadButtonPress = () => {
    loadPatternFromStorage();
  }

  const modifyPattern = () => {
    const newPattern = [0, ...pattern];
    const formattedPattern = [];
  
    for (let i = 0; i < newPattern.length; i++) {
      if (i % 2 === 0) {
        if (newPattern[i] === 0) {
          formattedPattern.push(Number(delay)); // Add 400 for even indices with 0 duration
        } else {
          formattedPattern.push(newPattern[i]); // Duration for even indices with non-zero duration
        }
      } else {
        formattedPattern.push(newPattern[i]); // Odd indices (vibration duration)
      }
    }

    return formattedPattern;

  }

  const handleStartButtonPress = () => {
    console.log("pattern", pattern);
    const formattedPattern = modifyPattern();

    Vibration.vibrate(formattedPattern, false);
    console.log("formattedPattern", formattedPattern);
  };

  const handleGridPress = (index: number) => {
    setSelectedGridIndex(index);
    setModalVisible(true);
  };

  const handleCustomModalSubmit = (text: string) => {
    const patternName = text.trim();
    if (patternName.length > 0) {
      const modifiedPattern = modifyPattern();
      savePatternToStorage(patternName, modifiedPattern);
      console.log("saved");
    }
    setCustomModalVisible(false);
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

  const resetGrid = () => {
    // Reset the pattern to all zeros
    setPattern([...Array(10)].map(() => 0));
  };

  const handleResetButtonPress = () => {
    resetGrid();
  };

  const { width } = Dimensions.get('window');
  const setPatternButtonWidth = width * 0.8;
  const setPickerWidth = width * 0.8;



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

            <View style={styles.header}>
        <Text style={styles.title}>Create a Pattern</Text>
      </View>
      
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
              <TouchableOpacity style={styles.addRowButton} onPress={handleAddRow}>
        <Text style={styles.addRowButtonText}>+ Add Row</Text>
      </TouchableOpacity>
      </View>

      <View style = {styles.delayContainer}> 
        <Text style = {styles.delayText}>
          Input your desired delay:
        </Text>
        <TextInput
          style={styles.delayInput}
          keyboardType="numeric"
          placeholder="Delay (ms)"
          value={delay}
          onChangeText={(text) => setDelay(text)}
        />
      </View>

      <View style={styles.buttonContainer}>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveButtonPress}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.startButton} onPress={handleStartButtonPress}>
          <Text style={styles.buttonText}>Test</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.deleteButton} onPress={handleResetButtonPress}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity> 
      
      </View>

      <Modal animationType="fade" visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
    <CustomSaveModal
      visible={customModalVisible}
      onRequestClose={() => setCustomModalVisible(false)}
      onSubmit={handleCustomModalSubmit}
    />
  </View>
);
}


const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEADD',
  },

  delayContainer: {
    // flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#FFEADD',
    marginBottom: 20,
    marginTop: 50
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 180,
    marginTop: 20
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#884A39'
  },

  delayText: {
    fontSize: 14,
    marginBottom: 20,
    color: '#884A39'
    
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 16, // Add padding around the grid
    position: 'relative', // Needed for positioning the Add Row button
    marginBottom: 50
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
    marginRight: 10,
    width: 100,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
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

  closeButton: {
    alignSelf: 'flex-end', // Align the button to the right
    paddingBottom: 5
  },

  closeButtonText: {
    color: 'red',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    color: 'black',
  },

  delayInput: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 360,
    paddingLeft: 20,
    marginBottom: 12,
    color: 'black',
    width: 300
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
    backgroundColor: '#FF8989',
    padding: 8,
    borderRadius: 8,
    bottom: 13,
    left: 135,
    marginVertical: 13
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
    right: 115,
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
    marginRight: 10,
    width: 100,
    alignItems: 'center'
  },

  deleteButton: {
    backgroundColor: '#FF6666',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    marginRight: 10,
    width: 100,
    alignItems: 'center'
  },

  loadButton: {
    backgroundColor: '#FF6666',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    left: 120,
    marginBottom: 100
  },

  picker: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    paddingLeft: 30,
    borderColor: 'white'
  }
  
});

export default Patterns;
