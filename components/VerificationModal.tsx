import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { 
  FadeIn, 
  FadeInDown, 
  SlideInDown,
  useAnimatedStyle,
  withSpring,
  withSequence,
  useSharedValue
} from "react-native-reanimated";
import { images } from "@/constants/images";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
  onVerify?: (code: string) => Promise<void>;
  onResend?: () => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const DigitBox = ({ digit, isFocused }: { digit: string; isFocused: boolean }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (digit) {
      scale.value = withSequence(
        withSpring(1.1, { damping: 10, stiffness: 100 }),
        withSpring(1)
      );
    }
  }, [digit, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className={`w-[14%] h-16 border-2 rounded-2xl items-center justify-center bg-gray-50 shadow-sm ${
        isFocused ? "border-[#5D3FD3] bg-white shadow-[#5D3FD3]/20" : "border-gray-100"
      }`}
    >
      <Text className={`text-2xl font-bold ${isFocused ? "text-[#5D3FD3]" : "text-gray-800"}`}>
        {digit}
      </Text>
      {isFocused && (
        <Animated.View 
          entering={FadeIn}
          className="absolute bottom-3 w-4 h-0.5 bg-[#5D3FD3] rounded-full" 
        />
      )}
    </Animated.View>
  );
};

export const VerificationModal: React.FC<VerificationModalProps> = ({
  visible,
  onClose,
  email,
  onVerify,
  onResend,
  isLoading = false,
  error,
}) => {
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setCode("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [visible]);

  const handleTextChange = async (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setCode(numericValue);

    if (numericValue.length === 6 && onVerify) {
      await onVerify(numericValue);
    }
  };

  const handleVerifyPress = async () => {
    if (code.length === 6 && onVerify) {
      await onVerify(code);
    }
  };

  const handleResend = async () => {
    if (onResend) {
      await onResend();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {visible && (
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.6)" }]} 
          >
            <TouchableOpacity 
              style={{ flex: 1 }} 
              onPress={onClose} 
              activeOpacity={1} 
              disabled={isLoading}
            />
          </Animated.View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <Animated.View 
            entering={SlideInDown.springify().damping(20).stiffness(90)}
            className="bg-white rounded-t-[48px] px-8 pt-4 pb-12 w-full shadow-2xl"
          >
            {/* Handle Bar */}
            <View className="w-12 h-1.5 bg-gray-100 rounded-full self-center mb-6" />

            {/* Header Area with Mascot */}
            <View className="items-center mb-6">
              <Animated.View entering={FadeInDown.delay(200).springify()}>
                <Image 
                  source={images.mascotAuth} 
                  className="w-24 h-24 mb-4" 
                  resizeMode="contain" 
                />
              </Animated.View>
              
              <View className="absolute right-0 top-0">
                <TouchableOpacity 
                  onPress={onClose} 
                  disabled={isLoading}
                  className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
                >
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <Text className="text-3xl font-bold text-gray-900 text-center">
                Check your inbox!
              </Text>
              <View className="mt-3 px-4">
                <Text className="text-gray-500 text-center text-lg leading-6">
                  We&apos;ve sent a special code to{"\n"}
                  <Text className="font-bold text-[#5D3FD3]">{email}</Text>
                </Text>
              </View>
            </View>

            {/* Hidden Input */}
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleTextChange}
              maxLength={6}
              keyboardType="number-pad"
              style={{ opacity: 0, position: "absolute" }}
              caretHidden
              editable={!isLoading}
            />

            {/* Digits Display */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              className="flex-row justify-between w-full mb-8"
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <DigitBox 
                  key={i} 
                  digit={code[i] || ""} 
                  isFocused={code.length === i} 
                />
              ))}
            </TouchableOpacity>

            {/* Error Message */}
            <View className="h-6 mb-4">
              {error && (
                <Animated.Text 
                  entering={FadeInDown}
                  className="text-red-500 text-sm font-medium text-center"
                >
                  <Ionicons name="alert-circle" size={14} color="#ef4444" /> {error}
                </Animated.Text>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              className={`h-16 rounded-2xl items-center justify-center shadow-xl ${
                isLoading || code.length < 6
                  ? "bg-gray-200"
                  : "bg-[#5D3FD3] shadow-purple-500/40"
              }`}
              onPress={handleVerifyPress}
              disabled={isLoading || code.length < 6}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-xl">Verify & Continue</Text>
              )}
            </TouchableOpacity>

            <View className="mt-8 flex-row justify-center items-center">
              <Text className="text-gray-400 text-base">Didn&apos;t receive a code? </Text>
              <TouchableOpacity
                onPress={handleResend}
                disabled={isLoading}
              >
                <Text className="text-[#5D3FD3] font-bold text-base">
                  Resend it
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  keyboardView: {
    width: "100%",
  },
});

