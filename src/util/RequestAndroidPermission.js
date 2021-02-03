import React from 'react';
import { Text, View, PermissionsAndroid } from 'react-native';

export const CameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
         
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
          return 'granted';
        } else {
          console.log('Camera permission denied');
          return 'denied';
        }
      } catch (err) {
        console.warn(err);
      }
}

export const ReadExternalStorage = async () => {
    try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
         
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
          return 'granted';
        } else {
          console.log('Camera permission denied');
          return 'denied';
        }
      } catch (err) {
        console.warn(err);
      }
}


