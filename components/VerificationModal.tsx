import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInDown,
  useAnimatedStyle,
  withSpring,
  withSequence,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
      className={`h-16 w-[14%] items-center justify-center rounded-2xl border-2 bg-gray-50 shadow-sm ${
        isFocused ? "border-[#5D3FD3] bg-white shadow-[#5D3FD3]/20" : "border-gray-100"
      }`}
    >
      <Text className={`text-2xl font-bold ${isFocused ? "text-[#5D3FD3]" : "text-gray-800"}`}>
        {digit}
      </Text>
      {isFocused && (
        <Animated.View
          entering={FadeIn}
          className="absolute bottom-3 h-0.5 w-4 rounded-full bg-[#5D3FD3]"
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
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      setCode("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    } else {
      Keyboard.dismiss();
    }
  }, [visible]);

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleTextChange = async (text: string) => {
    if (isLoading) return;
    const numericValue = text.replace(/[^0-9]/g, "");
    setCode(numericValue);

    if (numericValue.length === 6 && onVerify) {
      await onVerify(numericValue);
    }
  };

  const handleVerifyPress = async () => {
    if (isLoading) return;
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
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {visible && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.6)" }]}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={handleClose}
              activeOpacity={1}
              disabled={isLoading}
            />
          </Animated.View>
        )}

        <View style={styles.sheetContainer}>
          <Animated.View
            entering={SlideInDown.springify().damping(20).stiffness(90)}
            className="w-full rounded-t-[48px] bg-white px-8 pb-12 pt-4 shadow-2xl"
            style={{ paddingBottom: Math.max(insets.bottom, 16) + 32 }}
          >
            <View className="mb-6 h-1.5 w-12 self-center rounded-full bg-gray-100" />

            <View className="mb-6 items-center">
              <Animated.View entering={FadeInDown.delay(200).springify()}>
                <Image
                  source={images.mascotAuth}
                  className="mb-4 h-24 w-24"
                  resizeMode="contain"
                />
              </Animated.View>

              <View className="absolute right-0 top-0">
                <TouchableOpacity
                  onPress={handleClose}
                  disabled={isLoading}
                  className="h-10 w-10 items-center justify-center rounded-full bg-gray-50"
                >
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <Text className="text-center text-3xl font-bold text-gray-900">
                Check your inbox!
              </Text>
              <View className="mt-3 px-4">
                <Text className="text-center text-lg leading-6 text-gray-500">
                  We&apos;ve sent a special code to{"\n"}
                  <Text className="font-bold text-[#5D3FD3]">{email}</Text>
                </Text>
              </View>
            </View>

            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleTextChange}
              maxLength={6}
              keyboardType="number-pad"
              style={styles.hiddenInput}
              caretHidden
              editable={!isLoading}
            />

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              className="mb-8 w-full flex-row justify-between"
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <DigitBox
                  key={i}
                  digit={code[i] || ""}
                  isFocused={code.length === i}
                />
              ))}
            </TouchableOpacity>

            <View className="mb-4 h-6">
              {error && (
                <Animated.Text
                  entering={FadeInDown}
                  className="text-center text-sm font-medium text-red-500"
                >
                  <Ionicons name="alert-circle" size={14} color="#ef4444" /> {error}
                </Animated.Text>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              className={`h-16 items-center justify-center rounded-2xl shadow-xl ${
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
                <Text className="text-xl font-bold text-white">Verify & Continue</Text>
              )}
            </TouchableOpacity>

            <View className="mt-8 flex-row items-center justify-center">
              <Text className="text-base text-gray-400">Didn&apos;t receive a code? </Text>
              <TouchableOpacity onPress={handleResend} disabled={isLoading}>
                <Text className="text-base font-bold text-[#5D3FD3]">Resend it</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetContainer: {
    width: "100%",
  },
  hiddenInput: {
    opacity: 0,
    position: "absolute",
    height: 0,
    width: 0,
  },
});
