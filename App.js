import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import SpamDetector from './socialmediaDetector';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(true);
  const detectorRef = useRef(null);

  // Load the model when the component mounts
  useEffect(() => {
    const initModel = async () => {
      detectorRef.current = new SpamDetector();
      await detectorRef.current.loadModel();
      setLoading(false);
    };

    initModel().catch((err) => {
      Alert.alert('Error', 'Failed to load model');
      console.error(err);
    });
  }, []);

  // Predict the class
  const handlePredict = () => {
    Keyboard.dismiss();

    if (!inputText.trim()) {
      Alert.alert('Validation Error', 'Please enter some text to analyze.');
      return;
    }

    try {
      const result = detectorRef.current.predict(inputText);
      setPrediction(result);
    } catch (error) {
      console.error('Prediction error:', error);
      Alert.alert('Error', 'An error occurred during prediction.');
    }
  };

  // Clear input and result
  const handleClear = () => {
    setInputText('');
    setPrediction('');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading model...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <Image
                      source={require('./assets/media.png')}
                      style={{
                        width: 200,
                        height: 200,
                        marginTop: 10,
                        marginLeft: 80,
                        marginBottom: 10,
                        alignItems: 'stretch',
                        borderColor: '#eef',
                      }}
                      resizeMode="center"
                    />
      <Text style={styles.title}>Social Media Platform Detector</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a social media post..."
        value={inputText}
        onChangeText={setInputText}
        multiline
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePredict}>
          <Text style={styles.buttonText}>Predict</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClear}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {prediction !== '' && (
        <Text style={styles.result}>Predicted Platform: {prediction}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    fontSize: 16,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  result: {
    marginTop: 30,
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  clearButton: {
    backgroundColor: '#999999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
