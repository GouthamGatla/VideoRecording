// hooks/useVideoRecorder.ts

import { useEffect, useRef, useState } from 'react';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { PermissionsAndroid, Platform } from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll"

export const useVideoRecorder = () => {
  const cameraRef = useRef<Camera>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<any | null>(null);
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()

  useEffect(() => {
    permissionFunc()
  }, []);


  const permissionFunc = async () => {
    if (!hasPermission) {
      requestPermission()
    }
  }

  async function hasAndroidPermission() {
  const getCheckPermissionPromise = () => {
    if (Platform.Version >= 33) {
      return Promise.all([
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
      ]).then(
        ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
          hasReadMediaImagesPermission && hasReadMediaVideoPermission,
      );
    } else {
      return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }
  const getRequestPermissionPromise = () => {
    if (Platform.Version >= 33) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]).then(
        (statuses) =>
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  return await getRequestPermissionPromise();
}

async function savePicture(path : any) {
  if (Platform.OS === "android" && !(await hasAndroidPermission())) {
    return;
  }

  CameraRoll.save(path, { type: 'video' })
  console.log("Video saved successfully");
};

  const startRecording = async () => {
    if (!cameraRef.current) return;
    try {
      setIsRecording(true);
      await cameraRef.current.startRecording({
        onRecordingFinished: async (videoFile: any) => {
          const videoData: any = {
            path: videoFile.path,
            duration: videoFile.duration,
            size: videoFile.size,
          };

          savePicture(videoFile.path)

          setVideo(videoData);
          setIsRecording(false);
        },
        onRecordingError: (error) => {
          console.error('Recording error:', error);
          setIsRecording(false);
        },
      });
    } catch (err) {
      console.error('Start recording failed:', err);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current) return;
    await cameraRef.current.stopRecording();
  };

  return {
    cameraRef,
    device,
    hasPermission,
    isRecording,
    video,
    startRecording,
    stopRecording,
  };
};
