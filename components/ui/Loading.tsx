import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  style?: ViewStyle;
  overlay?: boolean;
}

export function Loading({
  size = 'large',
  color = '#007AFF',
  message,
  style,
  overlay = false,
}: LoadingProps) {
  const containerStyle = [
    styles.container,
    overlay && styles.overlay,
    style,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={[styles.message, { color }]}>{message}</Text>
      )}
    </View>
  );
}

export function LoadingOverlay({
  visible,
  message = 'Loading...',
  color = '#007AFF',
}: {
  visible: boolean;
  message?: string;
  color?: string;
}) {
  if (!visible) return null;

  return (
    <View style={styles.overlayContainer}>
      <View style={styles.overlayContent}>
        <ActivityIndicator size="large" color={color} />
        <Text style={[styles.overlayMessage, { color }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  overlayMessage: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});