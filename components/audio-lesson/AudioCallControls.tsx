import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AudioCallControlsProps {
  micMuted: boolean;
  subtitlesOn: boolean;
  disabled?: boolean;
  onToggleMic: () => void;
  onToggleSubtitles: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
}

export const AudioCallControls: React.FC<AudioCallControlsProps> = ({
  micMuted,
  subtitlesOn,
  disabled = false,
  onToggleMic,
  onToggleSubtitles,
  onToggleCamera,
  onEndCall,
}) => {
  return (
    <View className="mt-5 flex-row items-start justify-around px-4">
      <ControlButton
        icon="videocam-outline"
        label="Camera"
        onPress={onToggleCamera}
        disabled={disabled}
      />
      <ControlButton
        icon={micMuted ? 'mic-off-outline' : 'mic-outline'}
        label="Mic"
        onPress={onToggleMic}
        active={micMuted}
        disabled={disabled}
      />
      <ControlButton
        icon="language-outline"
        label="Subtitles"
        onPress={onToggleSubtitles}
        active={subtitlesOn}
        disabled={disabled}
      />
      <ControlButton
        icon="call"
        label="End Call"
        onPress={onEndCall}
        variant="danger"
      />
    </View>
  );
};

interface ControlButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  variant?: 'default' | 'danger';
  active?: boolean;
  disabled?: boolean;
}

function ControlButton({
  icon,
  label,
  onPress,
  variant = 'default',
  active = false,
  disabled = false,
}: ControlButtonProps) {
  const isDanger = variant === 'danger';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className="items-center"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View
        style={styles.circle}
        className={`mb-2 h-16 w-16 items-center justify-center rounded-full ${
          isDanger
            ? 'bg-red'
            : active
              ? 'border-2 border-purple-brand bg-purple/10'
              : 'border-2 border-neutral-gray200 bg-neutral-white'
        }`}
      >
        <Ionicons
          name={icon}
          size={26}
          color={isDanger ? '#FFFFFF' : '#4B4B4B'}
          style={isDanger ? { transform: [{ rotate: '135deg' }] } : undefined}
        />
      </View>
      <Text className="caption text-neutral-gray400">{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
