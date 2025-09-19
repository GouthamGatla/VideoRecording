// components/VideoRecorderScreen.js

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions, Animated } from 'react-native';
import { Camera, useCameraFormat } from 'react-native-vision-camera';
import { useVideoRecorder } from '../hooks/useVideoRecorder';

export const VideoRecorderScreenComponent = () => {
  const {
    cameraRef,
    device,
    hasPermission,
    isRecording,
    video,
    startRecording,
    stopRecording,
  } = useVideoRecorder();

  const [selectedResolution, setSelectedResolution] = useState('1080p');

  // Check if the device has permission
  if (!device || !hasPermission) {
    return <Text>Loading camera...</Text>;
  }


  const getFormatForResolution = (resolution : any) => {
    if (!device) return undefined;

    switch (resolution) {
      case '720p':
        return useCameraFormat(device, [
          { videoResolution: { width: 1280, height: 720 } },
          { fps: 30 }
        ]);
      case '1080p':
        return useCameraFormat(device, [
          { videoResolution: { width: 1920, height: 1080 } },
          { fps: 30 }
        ]);
      case '4K':
        return useCameraFormat(device, [
          { videoResolution: { width: 3840, height: 2160 } },
          { fps: 30 }
        ]);
      default:
        return useCameraFormat(device, [
          { videoResolution: { width: 1920, height: 1080 } },
          { fps: 30 }
        ]);
    }
  };


  const selectedFormat = getFormatForResolution(selectedResolution);

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFillObject}
        device={device}
        isActive={true}
        ref={cameraRef}
        video={true}
        audio={false}
        format={selectedFormat}
        key={`camera-${selectedResolution}`}
      />

      {/* Resolution Selection Buttons */}
      <View style={styles.resolutionControls}>
        <TouchableOpacity
          style={[
            styles.resolutionButton,
            selectedResolution === '720p' && styles.selectedResolutionButton,
          ]}
          onPress={() => setSelectedResolution('720p')}
        >
          <Text style={styles.buttonText}>720p</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.resolutionButton,
            selectedResolution === '1080p' && styles.selectedResolutionButton,
          ]}
          onPress={() => setSelectedResolution('1080p')}
        >
          <Text style={styles.buttonText}>1080p</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.resolutionButton,
            selectedResolution === '4K' && styles.selectedResolutionButton,
          ]}
          onPress={() => setSelectedResolution('4K')}
        >
          <Text style={styles.buttonText}>4K</Text>
        </TouchableOpacity>
      </View>

      {/* Recording Button */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, isRecording && styles.stopButton]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resolutionControls: {
    position: 'absolute',
    top: 40,
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resolutionButton: {
    backgroundColor: '#1D7BE0', // Blue for default button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedResolutionButton: {
    backgroundColor: '#FF4A4A', // Red for selected resolution
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1D7BE0', // Blue background for recording
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  stopButton: {
    backgroundColor: '#FF4A4A', // Red for stop button
  },
});
