import React, { useState } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomSaveModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onSubmit: (text: string) => void;
}

const CustomSaveModal: React.FC<CustomSaveModalProps> = ({ visible, onRequestClose, onSubmit }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (inputText.trim().length > 0) {
      onSubmit(inputText.trim());
      setInputText('');
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
         <Text style = {styles.patternText}>
            Enter pattern name
         </Text >
          <TextInput
            style={styles.input}
            placeholder="Enter pattern name"
            onChangeText={setInputText}
            value={inputText}
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
            <Text style={styles.modalButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={onRequestClose}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  patternText: {
    color: "black"
  }
});

export default CustomSaveModal;
