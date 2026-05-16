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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  visible,
  onClose,
  email,
}) => {
  const [code, setCode] = useState("");
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      // Small delay to ensure modal is rendered before focusing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [visible]);

  const handleTextChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, "");
    setCode(numericValue);

    if (numericValue.length === 6) {
      // Simulate verification and navigate
      setTimeout(() => {
        onClose();
        router.replace("/");
      }, 500);
    }
  };

  const renderDigit = (index: number) => {
    const digit = code[index] || "";
    const isFocused = code.length === index;

    return (
      <View
        key={index}
        className={`w-12 h-14 border-2 rounded-xl items-center justify-center bg-gray-50 ${
          isFocused ? "border-[#5D3FD3]" : "border-gray-200"
        }`}
      >
        <Text className="text-2xl font-bold text-gray-800">{digit}</Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View className="bg-white rounded-t-[40px] px-8 pt-6 pb-12 w-full">
            {/* Handle Bar */}
            <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6" />

            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-gray-800">
                Check your email
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-500 text-lg mb-8">
              We've sent a 6-digit code to{"\n"}
              <Text className="font-bold text-gray-800">{email}</Text>
            </Text>

            {/* Hidden Input */}
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleTextChange}
              maxLength={6}
              keyboardType="number-pad"
              style={{ opacity: 0, position: "absolute" }}
              caretHidden
            />

            {/* Digits Display */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              className="flex-row justify-between w-full mb-8"
            >
              {[0, 1, 2, 3, 4, 5].map(renderDigit)}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-[#5D3FD3] h-14 rounded-2xl items-center justify-center shadow-lg shadow-purple-500/30"
              onPress={() => {
                if (code.length === 6) {
                  onClose();
                  router.replace("/");
                }
              }}
            >
              <Text className="text-white font-bold text-lg">Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-6 self-center">
              <Text className="text-[#5D3FD3] font-bold text-base">
                Resend Code
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  keyboardView: {
    width: "100%",
  },
});
