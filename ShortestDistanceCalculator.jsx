import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { floydWarshallWithPath } from './floydWarshall';

const districts = ["Kanniya kumari", "Tirunelveli", "Tenkasi", "Thoothukudi", "Virudhunagar", "Ramanathapuram","Theni","Madurai","Sivagangai","Nagaipattinam","Tiruvarur","Pudukottai","Trichy","Dindigul","Tiruppur","Coimbatore","Karur","Niligiris","Erode","Namakkal","Salem","Perambalur","Ariyalur","Tanjore","Mayiladuthurai","Cuddalore","Villupuram","Kallakurichi","Dharmapuri","Tiruvannamalai","Chengalpattu","Krishnagiri","Tirupathur","Vellore","Ranipet","Kancheepuram","Tiruvarur","Chennai"];

// Replace the following matrix with your actual 38x38 adjacency matrix
const adjacencyMatrix = [
  [0,84,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [84,0,60,46,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,60,0,0,129,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,46, 0, 0, 113, 135, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 129, 113, 0, 119, 0, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 135, 119, 0, 0, 0, 107, 0, 0, 130, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 77, 0, 0, 0, 0, 0, 74, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 58, 0, 77, 0, 45, 0, 0, 0, 125, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 107, 0, 45, 0, 0, 0, 79, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 59, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 130, 0, 0, 79, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 125, 0, 0, 0, 56, 0, 101, 0, 0, 82, 0, 0, 88, 140, 57, 75, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 74, 64, 0, 0, 0, 0, 101, 0, 119, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 119, 0, 51, 88, 0, 53, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 51, 0, 0, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 82, 78, 88, 0, 0, 0, 0, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 0, 0, 165, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 53, 0, 0, 165, 0, 60, 69, 0, 0, 0, 0, 0, 0, 0, 129, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 88, 0, 0, 0, 46, 0, 60, 0, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  //20
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 0, 0, 0, 0, 0, 69, 52, 0, 118, 0, 0, 0, 0, 0, 103, 66, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 118, 0, 30, 0, 0, 133, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 75, 0, 0, 0, 0, 0, 0, 0, 0, 30, 0, 44, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 59, 63, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 44, 0, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 75, 0, 89, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  //25
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 128, 0, 89, 0, 44, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 44, 0, 77, 0, 62, 106, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103, 0, 0, 0, 0, 101, 77, 0, 172, 69, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 129, 0, 66, 0, 0, 0, 0, 0, 0, 172, 0, 0, 0, 51, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 62,69, 0, 0,135, 0,94, 87, 97, 0, 0, 0], //30
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 106, 0, 0, 135, 0, 0, 0, 0, 0, 42, 0, 63],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 51, 0, 0, 0, 44, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 94, 0, 44, 0, 90, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 87, 0, 0, 90, 0, 29, 0, 105, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 0, 0, 0, 29, 0, 50, 83, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 42, 0, 0, 0, 50, 0, 53, 76],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 105, 83, 53, 0, 45],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 0, 0, 0, 0, 76, 45, 0] 
];


const ShortestDistanceCalculator = () => {
  const [startDistrict, setStartDistrict] = useState(districts[0]);
  const [endDistrict, setEndDistrict] = useState(districts[1]);
  const [result, setResult] = useState({ distance: '', path: '' });
  const [shortestPaths, setShortestPaths] = useState([]);
  const [constructPath, setConstructPath] = useState(() => () => []);

  useEffect(() => {
    const { dist, constructPath } = floydWarshallWithPath(adjacencyMatrix);
    setShortestPaths(dist);
    setConstructPath(() => constructPath); // Wrap the function to avoid re-creation on each render
  }, []);

  const calculateShortestDistanceAndPath = () => {
    const startIdx = districts.indexOf(startDistrict);
    const endIdx = districts.indexOf(endDistrict);
    const shortestDistance = shortestPaths[startIdx]?.[endIdx];
    const path = shortestDistance !== Infinity ? constructPath(startIdx, endIdx).map(idx => districts[idx]).join(' -> ') : 'No path';

    setResult({
      distance: `Shortest distance: ${shortestDistance !== Infinity ? shortestDistance + ' km' : 'No path'}`,
      path: `Path: ${path}`,
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./white.jpeg')} style={styles.backgroundImage}>
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.title}>Shortest path between districts</Text>
          <Picker
            selectedValue={startDistrict}
            style={styles.picker}
            onValueChange={(itemValue) => setStartDistrict(itemValue)}
            itemStyle={styles.pickerItem}
          >
            {districts.map(district => (
              <Picker.Item key={district} label={district} value={district} />
            ))}
          </Picker>
          <Picker
            selectedValue={endDistrict}
            style={styles.picker}
            onValueChange={(itemValue) => setEndDistrict(itemValue)}
            itemStyle={styles.pickerItem}
          >
            {districts.map(district => (
              <Picker.Item key={district} label={district} value={district} />
            ))}
          </Picker>
          <Button title="Calculate" onPress={calculateShortestDistanceAndPath} />
          <Text style={styles.result}>{result.distance}</Text>
          <Text style={styles.result}>{result.path}</Text>
          <Text style={styles.footer}>                               </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  content: {
    flex: 1,
    paddingTop: 70,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: '900', // Super bold
    color: 'black',
    marginBottom: 20,
    top: -150,
  },
  picker: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'white', // Set the background color to white
  },
  pickerItem: {
    fontWeight: '900', // Super bold for picker items
  },
  result: {
    marginTop: 20,
    fontSize: 20, // Slightly increased font size
    fontWeight: '900', // Super bold
    textAlign: 'center',
    color: 'black'
  },
  footer: {
    position: 'absolute', // Position the text absolutely
    bottom: 10, // 10 pixels from the bottom
    right: -110, // 10 pixels from the right
    fontWeight: '900', // Super bold
    //textAlign:'justify'
  },
});

export default ShortestDistanceCalculator;
