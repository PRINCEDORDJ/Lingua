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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
  /** Called with the 6-digit code. Perform real Clerk verification here. */
  onVerify?: (code: string) => Promise<void>;
  /** Called to resend the verification code. */
  onResend?: () => Promise<void>;
  /** Loading state driven by the parent (e.g. while Clerk fetches) */
  isLoading?: boolean;
  /** Error message to display under the OTP digits */
  error?: string;
}

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
              <TouchableOpacity onPress={onClose} disabled={isLoading}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-500 text-lg mb-8">
              We&apos;ve sent a 6-digit code to{"\n"}
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
              editable={!isLoading}
            />

            {/* Digits Display */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              className="flex-row justify-between w-full mb-2"
            >
              {[0, 1, 2, 3, 4, 5].map(renderDigit)}
            </TouchableOpacity>

            {/* Error message */}
            {error ? (
              <Text className="text-red-500 text-sm text-center mt-2 mb-4">
                {error}
              </Text>
            ) : (
              <View className="mb-4" />
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              className={`h-14 rounded-2xl items-center justify-center shadow-lg shadow-purple-500/30 ${
                isLoading || code.length < 6
                  ? "bg-gray-300 shadow-none"
                  : "bg-[#5D3FD3]"
              }`}
              onPress={handleVerifyPress}
              disabled={isLoading || code.length < 6}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-lg">Verify</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-6 self-center"
              onPress={handleResend}
              disabled={isLoading}
            >
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
