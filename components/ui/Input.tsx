import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  variant?: 'default' | 'filled' | 'outline';
}

export function Input({
  label,
  error,
  helperText,
  required = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  variant = 'outline',
  secureTextEntry,
  ...textInputProps
}: InputProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const handleSecureToggle = () => {
    setIsSecure(!isSecure);
  };

  const showSecureToggle = secureTextEntry && !rightIcon;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        styles[variant],
        isFocused && styles.focused,
        error && styles.error,
      ]}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon as any} 
            size={20} 
            color={error ? '#FF3B30' : isFocused ? '#007AFF' : '#8E8E93'} 
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithLeftIcon]}
          placeholderTextColor="#8E8E93"
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        
        {(rightIcon || showSecureToggle) && (
          <TouchableOpacity
            onPress={showSecureToggle ? handleSecureToggle : onRightIconPress}
            style={styles.rightIcon}
          >
            <Ionicons
              name={
                showSecureToggle
                  ? (isSecure ? 'eye-off' : 'eye')
                  : (rightIcon as any)
              }
              size={20}
              color={error ? '#FF3B30' : isFocused ? '#007AFF' : '#8E8E93'}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 50,
  },
  default: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
  },
  filled: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    paddingHorizontal: 12,
  },
  focused: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  error: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
  },
  inputWithLeftIcon: {
    marginLeft: 8,
  },
  leftIcon: {
    marginLeft: 4,
  },
  rightIcon: {
    padding: 4,
    marginRight: 4,
  },
  helperText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  errorText: {
    color: '#FF3B30',
  },
});