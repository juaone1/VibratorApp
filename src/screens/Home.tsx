import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Vibration,
  Dimensions
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Neomorph } from 'react-native-neomorph-shadows';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
  Patterns: undefined;
};

type PatternsProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Patterns'>;
};

function Home({ navigation }: PatternsProps) {
  const [pattern, setPattern] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState('');
  const [neomorphInner, setNeomorphInner] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<null | number>(null);
  const [isVibrating, setIsVibrating] = useState(false);
  const [items, setItems] = useState([
    { label: 'Slow Pattern 1', value: 0 },
    { label: 'Slow Pattern 2', value: 1 },
    { label: 'Slow Pattern 3', value: 2 },
    { label: 'Medium Pattern 1', value: 3 },
    { label: 'Medium Pattern 2', value: 4 },
    { label: 'Medium Pattern 3', value: 5 },
    { label: 'Fast Pattern 1', value: 6 },
    { label: 'Fast Pattern 2', value: 7 },
    { label: 'Fast Pattern 2', value: 8 },
    // Add more patterns here...
  ]);
  const resetState = () => {
    setPattern([]);
    setActiveButton('');
    setNeomorphInner(false);
    setOpen(false);
    setValue(null);
    setIsVibrating(false);
    Vibration.cancel();
   
    // Add any other state variables that need to be reset here
  };

  useFocusEffect(
    React.useCallback(() => {
      resetState();
    }, [])
  );


  const patternLookup: Record<string, number[][]> = {
    slow: [
      [0, 500, 3000, 500, 3000, 500],             // Pattern 1 - Slow
      [0, 1000, 3000, 1000, 3000, 1000],                   // Pattern 2 - Slow
      [0, 1000, 6000, 1000, 6000, 1000],              // Pattern 3 - Slow
      // Add more slow patterns here...
    ],
    medium: [
      [0, 500, 2000, 500, 2000, 500, 2000, 500],  // Pattern 1 - Medium
      [0, 500, 1000, 500, 1000, 500, 1000, 500],    // Pattern 2 - Medium
      [0, 1000, 800, 1000, 800, 1000, 800, 1000],   // Pattern 3 - Medium
      // Add more medium patterns here...
    ],
    fast: [
      [0, 1000, 100, 1000, 100, 1000, 100, 1000, 100, 1000], // Pattern 1 - Fast
      [300, 200, 300, 200, 300, 200, 300, 200, 300, 200],    // Pattern 2 - Fast
      [200, 400, 200, 600, 200, 800, 200, 1000, 200, 1200],  // Pattern 3 - Fast
      // Add more fast patterns here...
    ],
  };
  const handleStartButtonPress = () => {
    if (value !== null) {
      const selectedItem = items.find(item => item.value === value);
      if (selectedItem) {
        const speed = selectedItem.label.split(' ')[0].toLowerCase();
        const patternIndex = selectedItem.value % 2; // Assuming each speed has only two patterns
        const selectedPattern = patternLookup[speed][patternIndex];
  
        if (isVibrating) {
          Vibration.cancel();
        } else {
          Vibration.vibrate(selectedPattern, true);
        }
  
        setIsVibrating((prev) => !prev);
        setNeomorphInner((prev) => !prev);
      }
    }
  };

  const handlePatternButtonPress = (speed: string, patterns: number[][]) => {
    const patternItems = patterns.map((_, index) => ({
      label: `${speed} Pattern ${index + 1}`,
      value: index,
    }));
    setItems(patternItems);
    setActiveButton(speed);
  };
  const handleSetNewPatternButtonPress = () => {
    navigation.navigate('Patterns');
  };

  const isButtonActive = (button: string) => {
    return activeButton === button;
  };

  const { width } = Dimensions.get('window');
  const setPatternButtonWidth = width * 0.8;
  const setPickerWidth = width * 0.8;

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.patternsContainer}>
        <Text style={styles.sectionTitle}>Patterns</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              isButtonActive('Slow') && styles.buttonActive,
            ]}
            onPress={() =>
              handlePatternButtonPress('Slow', patternLookup.slow)
            }
          >
            <Text
              style={[
                styles.buttonText,
                isButtonActive('Slow') && styles.buttonTextActive,
              ]}
            >
              Slow
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              isButtonActive('Medium') && styles.buttonActive,
            ]}
            onPress={() =>
              handlePatternButtonPress('Medium', patternLookup.medium)
            }
          >
            <Text
              style={[
                styles.buttonText,
                isButtonActive('Medium') && styles.buttonTextActive,
              ]}
            >
              Medium
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              isButtonActive('Fast') && styles.buttonActive,
            ]}
            onPress={() =>
              handlePatternButtonPress('Fast', patternLookup.fast)
            }
          >
            <Text
              style={[
                styles.buttonText,
                isButtonActive('Fast') && styles.buttonTextActive,
              ]}
            >
              Fast
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.neumorphicButtonContainer}>
          <DropDownPicker
            style={[styles.picker, { width: setPatternButtonWidth }]}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            dropDownContainerStyle={{
              // width: setPatternButtonWidth,
            }}
          />
          <Neomorph
            inner={neomorphInner}
            style={styles.neumorphicButton}
            swapShadows={neomorphInner}
          >
            <TouchableOpacity
              style={styles.bigButton}
              onPress={handleStartButtonPress}
            >
              <MaterialCommunityIcons
                name="power"
                size={64}
                color="#FF6666"
              />
            </TouchableOpacity>
          </Neomorph>
          <TouchableOpacity
            style={[styles.setPatternButton, { width: setPatternButtonWidth }]}
            onPress={handleSetNewPatternButtonPress}
          >
            <Text style={styles.setPatternButtonText}>Set New Pattern</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEADD',
  },
  patternsContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
    backgroundColor: '#FF6666',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FCAEAE',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#FF6666',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  startButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonTextActive: {
    color: 'white',
  },
  bigButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  neumorphicButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  neumorphicButton: {
    shadowRadius: 10,
    borderRadius: 75,
    backgroundColor: '#FFEADD',
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 70
  },
  setPatternButton: {
    backgroundColor: '#FF6666',
    padding: 10,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 70, // Adjust the margin top value here
  },
  setPatternButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center'
  },
  picker: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    paddingLeft: 30,
    borderColor: 'white'
  }
});

export default Home;
