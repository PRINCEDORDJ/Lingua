import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/expo";
import { useUserStore } from "@/store/useUserStore";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";

// Today's plan items — hardcoded for now, can be driven by data later
const todaysPlan = [
  {
    id: "1",
    type: "lesson",
    title: "Lesson",
    subtitle: "At the café",
    iconName: "book",
    iconBg: "#5C5CE4",
    completed: true,
  },
  {
    id: "2",
    type: "ai-conversation",
    title: "AI Conversation",
    subtitle: "Talk about your day",
    iconName: "headset",
    iconBg: "#5C5CE4",
    completed: false,
  },
  {
    id: "3",
    type: "new-words",
    title: "New words",
    subtitle: "10 words",
    iconName: "chatbubble",
    iconBg: "#FF4B4B",
    completed: false,
  },
];

const DAILY_GOAL_XP = 20;

export default function HomeScreen() {
  const { user } = useUser();
  const { selectedLanguageId, xp } = useUserStore();

  const selectedLanguage = languages.find((l) => l.id === selectedLanguageId);
  const languageUnits = selectedLanguageId ? units[selectedLanguageId] ?? [] : [];
  const currentUnit = languageUnits[0];

  const firstName = user?.firstName ?? user?.username ?? "Friend";
  const streak = 12; // Hardcoded streak for now; will come from store later

  const dailyXP = Math.min(xp, DAILY_GOAL_XP);
  const progressPercent = (dailyXP / DAILY_GOAL_XP) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View className="flex-row items-center justify-between mb-6">
          {/* Left: flag + greeting */}
          <View className="flex-row items-center gap-3">
            {selectedLanguage?.flag ? (
              <Image
                source={{ uri: selectedLanguage.flag }}
                style={styles.flag}
              />
            ) : (
              <View style={styles.flagPlaceholder} />
            )}
            <Text className="text-xl font-bold text-neutral-gray500">
              Hola, {firstName}! 👋
            </Text>
          </View>

          {/* Right: streak + bell */}
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Image source={images.streakFire} style={styles.streakIcon} />
              <Text className="text-base font-bold text-neutral-gray500">
                {streak}
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={26} color="#4B4B4B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Daily Goal Card ── */}
        <View style={styles.dailyGoalCard} className="rounded-2xl p-4 mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text className="caption mb-1">Daily goal</Text>
              <Text style={styles.xpText}>
                <Text style={styles.xpBig}>{dailyXP}</Text>
                <Text style={styles.xpSmall}> / {DAILY_GOAL_XP} XP</Text>
              </Text>
              {/* Progress bar */}
              <View style={styles.progressBg} className="mt-3">
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercent}%` as `${number}%` },
                  ]}
                />
              </View>
            </View>
            <Image source={images.treasure} style={styles.treasureImg} />
          </View>
        </View>

        {/* ── Continue Learning Card ── */}
        <View style={styles.continueCard} className="rounded-2xl mb-6 overflow-hidden">
          <View style={styles.continueInner} className="p-5">
            {/* Text side */}
            <View style={{ flex: 1 }}>
              <Text style={styles.continueLabelText}>Continue learning</Text>
              <Text style={styles.continueLanguageName}>
                {selectedLanguage?.name ?? "Spanish"}
              </Text>
              <Text style={styles.continueUnit}>
                A1 • {currentUnit ? currentUnit.title.replace("Unit 1: ", "Unit ") : "Unit 1"}
              </Text>
              <TouchableOpacity style={styles.continueBtn}>
                <Text style={styles.continueBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
            {/* Palace image */}
            <Image source={images.palace} style={styles.palaceImg} />
          </View>
        </View>

        {/* ── Today's Plan ── */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-neutral-gray500">
              Today&apos;s plan
            </Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          {todaysPlan.map((item, index) => (
            <View key={item.id}>
              <View className="flex-row items-center py-3">
                {/* Icon */}
                <View
                  style={[styles.planIcon, { backgroundColor: item.iconBg }]}
                  className="rounded-xl mr-4"
                >
                  <Ionicons
                    name={item.iconName as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color="#fff"
                  />
                </View>
                {/* Title + subtitle */}
                <View className="flex-1">
                  <Text className="text-base font-bold text-neutral-gray500">
                    {item.title}
                  </Text>
                  <Text className="text-sm text-neutral-gray400">
                    {item.subtitle}
                  </Text>
                </View>
                {/* Check */}
                {item.completed ? (
                  <View style={styles.checkCompleted}>
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  </View>
                ) : (
                  <View style={styles.checkEmpty} />
                )}
              </View>
              {index < todaysPlan.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },

  // Header
  flag: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
  },
  flagPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E5E5",
  },
  streakIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  // Daily Goal
  dailyGoalCard: {
    backgroundColor: "#FFF3E0",
  },
  xpText: {
    marginTop: 4,
  },
  xpBig: {
    fontSize: 32,
    fontWeight: "800",
    color: "#4B4B4B",
  },
  xpSmall: {
    fontSize: 16,
    fontWeight: "600",
    color: "#777777",
  },
  progressBg: {
    height: 10,
    backgroundColor: "#E5E5E5",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    backgroundColor: "#FF9600",
    borderRadius: 999,
  },
  treasureImg: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  // Continue Learning
  continueCard: {
    backgroundColor: "#5C5CE4",
  },
  continueInner: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  continueLabelText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  continueLanguageName: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 36,
  },
  continueUnit: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 16,
  },
  continueBtn: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  continueBtnText: {
    color: "#5C5CE4",
    fontWeight: "700",
    fontSize: 15,
  },
  palaceImg: {
    width: 120,
    height: 140,
    resizeMode: "contain",
    marginLeft: 8,
    marginBottom: -20,
  },

  // Today's Plan
  viewAllText: {
    color: "#5C5CE4",
    fontWeight: "700",
    fontSize: 14,
  },
  planIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCompleted: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#5C5CE4",
    alignItems: "center",
    justifyContent: "center",
  },
  checkEmpty: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    backgroundColor: "transparent",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
});
