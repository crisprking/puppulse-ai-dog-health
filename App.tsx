import React, { useState, useEffect, useCallback, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Dimensions, Animated, Vibration, Platform, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

// Payment integration imports
import { PaymentScreen } from "./components/PaymentScreen";
import { PaymentService } from "./services/PaymentService";
import { Profile } from "./lib/supabase";

const { width, height } = Dimensions.get("window");

interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  pulseScore: number;
  lastCheck: Date;
  healthStatus: "excellent" | "good" | "fair" | "poor" | "critical";
  energyLevel: number;
  mood: "happy" | "calm" | "anxious" | "excited" | "tired";
  lastMeal: Date;
  lastWalk: Date;
  vaccinationStatus: "up_to_date" | "due_soon" | "overdue";
  nextVetAppointment?: Date;
  medicalConditions: string[];
  medications: string[];
  allergies: string[];
  // BREAKTHROUGH FEATURES
  biometricData: {
    heartRate: number;
    temperature: number;
    respiratoryRate: number;
    bloodPressure: { systolic: number; diastolic: number };
    hydrationLevel: number;
    stressLevel: number;
  };
  behaviorPatterns: {
    sleepQuality: number;
    appetiteScore: number;
    socialInteraction: number;
    anxietyTriggers: string[];
    favoriteActivities: string[];
  };
  healthPredictions: {
    riskScore: number;
    nextHealthIssue: string;
    preventiveActions: string[];
    lifeExpectancy: number;
  };
  emergencyContacts: {
    vet: { name: string; phone: string; address: string };
    emergency: { name: string; phone: string; address: string };
    petInsurance: { provider: string; policy: string; phone: string };
  };
}

interface HealthEvent {
  id: string;
  type: "walk" | "meal" | "medication" | "symptom" | "vet_visit" | "vaccination" | "grooming" | "play" | "training" | "socialization" | "sleep" | "bathroom";
  title: string;
  description: string;
  timestamp: Date;
  severity?: "low" | "medium" | "high" | "critical";
  duration?: number;
  location?: string;
  notes?: string;
  photos?: string[];
}

interface AIInsight {
  id: string;
  type: "health" | "behavior" | "nutrition" | "exercise" | "warning" | "achievement" | "prediction" | "emergency" | "social" | "genetic";
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent" | "critical";
  timestamp: Date;
  actionable: boolean;
  actionText?: string;
  // BREAKTHROUGH AI FEATURES
  confidence: number; // AI confidence level 0-100
  source: "biometric" | "behavioral" | "environmental" | "genetic" | "social";
  urgency: "immediate" | "within_hour" | "within_day" | "within_week";
  costSavings?: number; // Potential vet cost savings
  lifeImpact?: "minor" | "moderate" | "major" | "life_saving";
  relatedDogs?: string[]; // Similar cases from community
  scientificBacking?: string; // Research paper references
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  xpReward: number;
  category: "health" | "care" | "exercise" | "social" | "learning";
}

export default function App() {
  const [currentDog, setCurrentDog] = useState<Dog | null>(null);
  const [healthEvents, setHealthEvents] = useState<HealthEvent[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  const [showVetChat, setShowVetChat] = useState(false);
  const [showHealthReport, setShowHealthReport] = useState(false);
  const [pulseScore, setPulseScore] = useState(87);
  const [healthStreak, setHealthStreak] = useState(5);
  const [level, setLevel] = useState(3);
  const [xp, setXp] = useState(1250);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [streakAnimation] = useState(new Animated.Value(1));
  const [heartbeatAnimation] = useState(new Animated.Value(1));
  const [notificationCount, setNotificationCount] = useState(3);
  const [isPremium, setIsPremium] = useState(false);
  const [dailyGoal, setDailyGoal] = useState({ walks: 2, meals: 3, play: 30, completed: 0 });
  
  // Payment integration state
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  // Health features state
  const [showHealthTracking, setShowHealthTracking] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showEmergencyMode, setShowEmergencyMode] = useState(false);
  const [showBreedInfo, setShowBreedInfo] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const startHeartbeatAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartbeatAnimation, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(heartbeatAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [heartbeatAnimation]);

  useEffect(() => {
    loadAppData();
    startHeartbeatAnimation();
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // Mock user ID - in production, this would come from authentication
      const profile = await PaymentService.getUserProfile("user123");
      if (profile) {
        setUserProfile(profile);
        setIsPremium(profile.subscription_status !== "free");
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const loadAppData = () => {
    const sampleDog: Dog = {
      id: "1",
      name: "Buddy",
      breed: "Golden Retriever",
      age: 3,
      weight: 28.5,
      pulseScore: 87,
      lastCheck: new Date(),
      healthStatus: "excellent",
      energyLevel: 8,
      mood: "happy",
      lastMeal: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastWalk: new Date(Date.now() - 4 * 60 * 60 * 1000),
      vaccinationStatus: "up_to_date",
      nextVetAppointment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      medicalConditions: [],
      medications: [],
      allergies: ["Chicken"],
      // Basic health tracking data
      biometricData: {
        heartRate: 85,
        temperature: 101.2,
        respiratoryRate: 18,
        bloodPressure: { systolic: 120, diastolic: 80 },
        hydrationLevel: 92,
        stressLevel: 15
      },
      behaviorPatterns: {
        sleepQuality: 8.5,
        appetiteScore: 9.2,
        socialInteraction: 7.8,
        anxietyTriggers: ["Thunder", "Loud noises"],
        favoriteActivities: ["Fetch", "Swimming", "Social play"]
      },
      healthPredictions: {
        riskScore: 12, // Low risk (0-100 scale)
        nextHealthIssue: "Regular check-up recommended",
        preventiveActions: ["Continue current exercise routine", "Monitor weight", "Regular dental care"],
        lifeExpectancy: 12.5
      },
      emergencyContacts: {
        vet: { name: "Dr. Sarah Johnson", phone: "(555) 123-4567", address: "123 Pet Care Ave" },
        emergency: { name: "24/7 Emergency Vet", phone: "(555) 911-PETS", address: "456 Emergency St" },
        petInsurance: { provider: "Healthy Paws", policy: "HP-789456", phone: "(555) 800-PETS" }
      }
    };

    const sampleEvents: HealthEvent[] = [
      {
        id: "1",
        type: "walk",
        title: "Morning Walk",
        description: "30-minute walk in the park",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        duration: 30,
        location: "Central Park",
        severity: "low"
      },
      {
        id: "2",
        type: "meal",
        title: "Breakfast",
        description: "Premium dog food with chicken",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        severity: "low"
      },
      {
        id: "3",
        type: "play",
        title: "Play Session",
        description: "Fetch and tug-of-war",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        duration: 20,
        severity: "low"
      }
    ];

    const sampleInsights: AIInsight[] = [
      {
        id: "1",
        type: "health",
        title: "Health Status: Excellent",
        description: "Buddy is in great health! His recent activity levels and eating patterns show he's thriving. Keep up the good work with regular exercise and balanced nutrition.",
        priority: "low",
        timestamp: new Date(),
        actionable: true,
        actionText: "Continue current routine",
        confidence: 85,
        source: "behavioral",
        urgency: "within_week",
        costSavings: 0,
        lifeImpact: "minor",
        relatedDogs: [],
        scientificBacking: "General veterinary guidelines"
      },
      {
        id: "2",
        type: "exercise",
        title: "Exercise Recommendation",
        description: "Consider adding 10 more minutes to your daily walks to maintain optimal fitness. Golden Retrievers benefit from 60-90 minutes of exercise daily.",
        priority: "medium",
        timestamp: new Date(),
        actionable: true,
        actionText: "Schedule longer walk",
        confidence: 75,
        source: "behavioral",
        urgency: "within_day",
        costSavings: 0,
        lifeImpact: "moderate",
        relatedDogs: [],
        scientificBacking: "Breed-specific exercise guidelines"
      },
      {
        id: "3",
        type: "nutrition",
        title: "Feeding Schedule Suggestion",
        description: "Your current feeding schedule looks good. Consider splitting meals into 2-3 smaller portions to help with digestion and prevent bloat.",
        priority: "low",
        timestamp: new Date(),
        actionable: true,
        actionText: "Consider meal timing",
        confidence: 70,
        source: "behavioral",
        urgency: "within_week",
        costSavings: 0,
        lifeImpact: "minor",
        relatedDogs: [],
        scientificBacking: "Canine nutrition best practices"
      },
      {
        id: "4",
        type: "behavior",
        title: "Behavioral Observation",
        description: "Buddy seems happy and well-adjusted. His social interactions and play behavior indicate good mental health. Continue providing enrichment activities.",
        priority: "low",
        timestamp: new Date(),
        actionable: true,
        actionText: "Keep up enrichment",
        confidence: 80,
        source: "behavioral",
        urgency: "within_week",
        costSavings: 0,
        lifeImpact: "minor",
        relatedDogs: [],
        scientificBacking: "Canine behavior studies"
      },
      {
        id: "5",
        type: "health",
        title: "Regular Check-up Reminder",
        description: "Buddy's next vet appointment is in 30 days. This is a good time to discuss any concerns and ensure vaccinations are up to date.",
        priority: "medium",
        timestamp: new Date(),
        actionable: true,
        actionText: "Schedule vet visit",
        confidence: 90,
        source: "behavioral",
        urgency: "within_week",
        costSavings: 0,
        lifeImpact: "moderate",
        relatedDogs: [],
        scientificBacking: "Preventive care guidelines"
      }
    ];

    const sampleAchievements: Achievement[] = [
      {
        id: "1",
        title: "Health Streak Master",
        description: "Maintained health tracking for 5 consecutive days",
        icon: "local-fire-department",
        unlocked: true,
        unlockedAt: new Date(),
        xpReward: 100,
        category: "health"
      },
      {
        id: "2",
        title: "Exercise Enthusiast",
        description: "Completed 10 exercise sessions",
        icon: "fitness-center",
        unlocked: false,
        xpReward: 50,
        category: "exercise"
      }
    ];

    setCurrentDog(sampleDog);
    setHealthEvents(sampleEvents);
    setAiInsights(sampleInsights);
    setAchievements(sampleAchievements);
  };

  const addXP = (amount: number) => {
    setXp(prev => {
      const newXP = prev + amount;
      if (newXP >= level * 1000) {
        setLevel(prevLevel => prevLevel + 1);
        setShowAchievement(`Level Up! You are now level ${level + 1}!`);
        setTimeout(() => setShowAchievement(null), 3000);
        if (Platform.OS === "ios") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          Vibration.vibrate([0, 500, 200, 500]);
        }
      }
      return newXP;
    });
  };

  const addHealthStreak = () => {
    setHealthStreak(prev => {
      const newStreak = prev + 1;
      if (newStreak % 5 === 0) {
        setShowAchievement(`Amazing! ${newStreak} day health streak!`);
        setTimeout(() => setShowAchievement(null), 3000);
        if (Platform.OS === "ios") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          Vibration.vibrate([0, 500, 200, 500]);
        }
      }
      return newStreak;
    });
  };

  const pulseAnimationEffect = () => {
    Animated.sequence([
      Animated.timing(pulseAnimation, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return "favorite";
      case "good": return "thumb-up";
      case "fair": return "warning";
      case "poor": return "error";
      case "critical": return "emergency";
      default: return "help";
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "#4CAF50";
      case "good": return "#8BC34A";
      case "fair": return "#FFC107";
      case "poor": return "#FF9800";
      case "critical": return "#F44336";
      default: return "#9E9E9E";
    }
  };

  const getPulseScoreColor = (score: number) => {
    if (score >= 90) return "#4CAF50";
    if (score >= 80) return "#8BC34A";
    if (score >= 70) return "#FFC107";
    if (score >= 60) return "#FF9800";
    return "#F44336";
  };

  const handleEmergencyMode = () => {
    setIsEmergencyMode(true);
    if (Platform.OS === "ios") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Vibration.vibrate([0, 500, 200, 500]);
    }
    Alert.alert(
      " Emergency Mode Activated",
      "Your dog needs immediate veterinary attention. We are here to help you through this.",
      [
        {
          text: "Call Nearest Vet",
          onPress: () => {
            Linking.openURL("tel:+1234567890");
            addXP(50);
          }
        },
        {
          text: "Export Health Report",
          onPress: () => {
            console.log("Exporting health report...");
            addXP(25);
          }
        },
        {
          text: "Find Emergency Clinic",
          onPress: () => {
            Linking.openURL("https://maps.google.com/?q=emergency+vet+clinic");
            addXP(25);
          }
        }
      ]
    );
  };

  const handleSymptomChecker = () => {
    setShowSymptomChecker(true);
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      " AI Symptom Checker",
      "Describe your dog symptoms and we will provide immediate triage guidance.",
      [
        {
          text: "Start Symptom Check",
          onPress: () => {
            console.log("Starting AI symptom check...");
            addXP(20);
            pulseAnimationEffect();
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleLogEvent = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert(
      " Log Health Event",
      "What would you like to log?",
      [
        {
          text: " Walk",
          onPress: () => {
            addXP(10);
            addHealthStreak();
            pulseAnimationEffect();
            setDailyGoal(prev => ({ ...prev, completed: prev.completed + 1 }));
          }
        },
        {
          text: " Meal",
          onPress: () => {
            addXP(5);
            pulseAnimationEffect();
            setDailyGoal(prev => ({ ...prev, completed: prev.completed + 1 }));
          }
        },
        {
          text: " Play",
          onPress: () => {
            addXP(15);
            pulseAnimationEffect();
            setDailyGoal(prev => ({ ...prev, completed: prev.completed + 1 }));
          }
        },
        {
          text: " Grooming",
          onPress: () => {
            addXP(8);
            pulseAnimationEffect();
            setDailyGoal(prev => ({ ...prev, completed: prev.completed + 1 }));
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleSchedule = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert(
      " Schedule Management",
      "Manage your dog health schedule",
      [
        { 
          text: " Set Reminders", 
          onPress: () => {
            addXP(8);
            pulseAnimationEffect();
            console.log("Setting up health reminders...");
          }
        },
        {
          text: " View Calendar",
          onPress: () => {
            addXP(5);
            pulseAnimationEffect();
            console.log("Opening health calendar...");
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleVetChat = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      " Vet Consultation",
      "Connect with veterinary professionals",
      [
        {
          text: " Start Video Call",
          onPress: () => {
            addXP(15);
            pulseAnimationEffect();
            setShowVetChat(true);
            console.log("Starting video consultation...");
          }
        },
        {
          text: " Send Message",
          onPress: () => {
            addXP(10);
            pulseAnimationEffect();
            console.log("Opening chat with vet...");
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleHealthReport = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowHealthReport(true);
    addXP(20);
    pulseAnimationEffect();
  };

  const handlePremiumFeatures = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    setShowPaymentScreen(true);
    addXP(5);
    pulseAnimationEffect();
  };

  const handleHealthTracking = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowHealthTracking(true);
    addXP(10);
    pulseAnimationEffect();
  };

  const handleBreedInfo = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowBreedInfo(true);
    addXP(8);
    pulseAnimationEffect();
  };

  if (!currentDog) {
    return (
      <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="pets" size={80} color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading PupPulse...</Text>
        </View>
        <StatusBar style="light" />
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.dogInfo}>
            <Animated.View style={{ transform: [{ scale: heartbeatAnimation }] }}>
              <MaterialIcons name="pets" size={32} color="#FFFFFF" />
            </Animated.View>
            <View style={styles.dogDetails}>
              <View style={styles.dogNameRow}>
                <Text style={styles.dogName}>{currentDog.name}</Text>
                {isPremium && (
                  <View style={styles.premiumBadge}>
                    <MaterialIcons name="star" size={16} color="#FFD700" />
                    <Text style={styles.premiumText}>PRO</Text>
                  </View>
                )}
              </View>
              <Text style={styles.dogBreed}>{currentDog.breed}  {currentDog.age} years</Text>

              <View style={styles.moodContainer}>
                <MaterialIcons
                  name={currentDog.mood === "happy" ? "sentiment-very-satisfied" :
                        currentDog.mood === "calm" ? "sentiment-satisfied" :
                        currentDog.mood === "anxious" ? "sentiment-dissatisfied" :
                        currentDog.mood === "excited" ? "sentiment-very-satisfied" : "sentiment-neutral"}
                  size={16}
                  color="#FFFFFF"
                />
                <Text style={styles.moodText}>{currentDog.mood.toUpperCase()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.pulseScoreContainer}>
            <Text style={styles.pulseScoreLabel}>Pulse Score</Text>
            <Animated.Text
              style={[
                styles.pulseScore,
                {
                  color: getPulseScoreColor(pulseScore),
                  transform: [{ scale: pulseAnimation }]
                }
              ]}
            >
              {pulseScore}
            </Animated.Text>
            <View style={styles.healthStatus}>
              <MaterialIcons
                name={getHealthStatusIcon(currentDog.healthStatus)}
                size={20}
                color={getHealthStatusColor(currentDog.healthStatus)}
              />
              <Text style={[styles.healthStatusText, { color: getHealthStatusColor(currentDog.healthStatus) }]}>
                {currentDog.healthStatus.toUpperCase()}
              </Text>
            </View>

            <View style={styles.energyContainer}>
              <MaterialIcons name="battery-full" size={16} color="#FFFFFF" />
              <View style={styles.energyBar}>
                <View style={[styles.energyFill, { width: `${(currentDog.energyLevel / 10) * 100}%` }]} />
              </View>
              <Text style={styles.energyText}>{currentDog.energyLevel}/10</Text>
            </View>

            <View style={styles.gamificationRow}>
              <View style={styles.levelContainer}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.levelText}>Level {level}</Text>
              </View>
              <View style={styles.streakContainer}>
                <Animated.View style={{ transform: [{ scale: streakAnimation }] }}>
                  <MaterialIcons name="local-fire-department" size={16} color="#FF6B35" />
                </Animated.View>
                <Text style={styles.streakText}>{healthStreak} days</Text>
              </View>
            </View>

            <View style={styles.xpContainer}>
              <Text style={styles.xpText}>XP: {xp}</Text>
              <View style={styles.xpBar}>
                <View style={[styles.xpProgress, { width: `${(xp % 1000) / 10}%` }]} />
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showAchievement && (
          <View style={styles.achievementNotification}>
            <MaterialIcons name="emoji-events" size={24} color="#FFD700" />
            <Text style={styles.achievementText}>{showAchievement}</Text>
          </View>
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, isPremium ? styles.premiumAction : {}]}
            onPress={() => {
              handleSymptomChecker();
              addXP(10);
              pulseAnimationEffect();
            }}
          >
            <MaterialIcons name="medical-services" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Health Check</Text>
            <Text style={styles.actionXP}>+10 XP</Text>
            {isPremium && <View style={styles.premiumDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLogEvent}
          >
            <MaterialIcons name="add-circle" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Log Event</Text>
            <Text style={styles.actionXP}>+5 XP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSchedule}
          >
            <MaterialIcons name="schedule" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Schedule</Text>
            <Text style={styles.actionXP}>+8 XP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isPremium ? styles.premiumAction : {}]}
            onPress={handleVetChat}
          >
            <MaterialIcons name="videocam" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Vet Chat</Text>
            <Text style={styles.actionXP}>+15 XP</Text>
            {isPremium && <View style={styles.premiumDot} />}
          </TouchableOpacity>
        </View>

        {/* HEALTH FEATURES SECTION */}
        <View style={styles.breakthroughSection}>
          <Text style={styles.breakthroughTitle}>Health Features</Text>
          <Text style={styles.breakthroughSubtitle}>Tools to help you care for your dog</Text>
          
          <View style={styles.breakthroughGrid}>
            <TouchableOpacity
              style={[styles.breakthroughCard, styles.predictionCard]}
              onPress={() => setShowHealthTracking(true)}
            >
              <MaterialIcons name="trending-up" size={32} color="#4CAF50" />
              <Text style={styles.breakthroughCardTitle}>Health Tracking</Text>
              <Text style={styles.breakthroughCardDesc}>Monitor your dog's health trends</Text>
              <Text style={styles.breakthroughCardSavings}>Stay informed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.breakthroughCard, styles.geneticCard]}
              onPress={() => setShowBreedInfo(true)}
            >
              <MaterialIcons name="pets" size={32} color="#4CAF50" />
              <Text style={styles.breakthroughCardTitle}>Breed Info</Text>
              <Text style={styles.breakthroughCardDesc}>Learn about your dog's breed</Text>
              <Text style={styles.breakthroughCardSavings}>Breed-specific care</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.breakthroughCard, styles.communityCard]}
              onPress={() => setShowCommunity(true)}
            >
              <MaterialIcons name="groups" size={32} color="#4CAF50" />
              <Text style={styles.breakthroughCardTitle}>Community</Text>
              <Text style={styles.breakthroughCardDesc}>Connect with other dog owners</Text>
              <Text style={styles.breakthroughCardSavings}>Share experiences</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.breakthroughCard, styles.emergencyCard]}
              onPress={() => setShowEmergencyMode(true)}
            >
              <MaterialIcons name="emergency" size={32} color="#F44336" />
              <Text style={styles.breakthroughCardTitle}>Emergency</Text>
              <Text style={styles.breakthroughCardDesc}>Quick access to emergency info</Text>
              <Text style={styles.breakthroughCardSavings}>Be prepared</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.premiumActions}>
          <TouchableOpacity
            style={[styles.premiumButton, styles.healthReportButton]}
            onPress={handleHealthReport}
          >
            <MaterialIcons name="assessment" size={20} color="#FFFFFF" />
            <Text style={styles.premiumButtonText}>Health Report</Text>
            <Text style={styles.premiumButtonXP}>+20 XP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.premiumButton, styles.premiumFeaturesButton]}
            onPress={handlePremiumFeatures}
          >
            <MaterialIcons name="star" size={20} color="#FFD700" />
            <Text style={styles.premiumButtonText}>Premium</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.healthOverview}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Overview</Text>
            <TouchableOpacity onPress={() => setNotificationCount(0)}>
              <View style={styles.notificationBadge}>
                <MaterialIcons name="notifications" size={20} color="#4CAF50" />
                {notificationCount > 0 && (
                  <View style={styles.notificationCount}>
                    <Text style={styles.notificationCountText}>{notificationCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.healthMetrics}>
            <View style={styles.metric}>
              <MaterialIcons name="monitor-weight" size={24} color="#4CAF50" />
              <Text style={styles.metricValue}>{currentDog.weight} kg</Text>
              <Text style={styles.metricLabel}>Weight</Text>
            </View>
            <View style={styles.metric}>
              <MaterialIcons name="directions-walk" size={24} color="#4CAF50" />
              <Text style={styles.metricValue}>3.2 km</Text>
              <Text style={styles.metricLabel}>Today Walk</Text>
            </View>
            <View style={styles.metric}>
              <MaterialIcons name="restaurant" size={24} color="#4CAF50" />
              <Text style={styles.metricValue}>2/3</Text>
              <Text style={styles.metricLabel}>Meals</Text>
            </View>
            <View style={styles.metric}>
              <MaterialIcons name="bedtime" size={24} color="#4CAF50" />
              <Text style={styles.metricValue}>14h</Text>
              <Text style={styles.metricLabel}>Sleep</Text>
            </View>
          </View>

          <View style={styles.dailyGoalsContainer}>
            <Text style={styles.dailyGoalsTitle}>Daily Goals</Text>
            <View style={styles.goalProgress}>
              <View style={styles.goalItem}>
                <Text style={styles.goalText}>Walks: {dailyGoal.completed}/{dailyGoal.walks}</Text>
                <View style={styles.goalBar}>
                  <View style={[styles.goalFill, { width: `${(dailyGoal.completed / dailyGoal.walks) * 100}%` }]} />
                </View>
              </View>
              <View style={styles.goalItem}>
                <Text style={styles.goalText}>Meals: {dailyGoal.completed}/{dailyGoal.meals}</Text>
                <View style={styles.goalBar}>
                  <View style={[styles.goalFill, { width: `${(dailyGoal.completed / dailyGoal.meals) * 100}%` }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.recentEvents}>
          <Text style={styles.sectionTitle}>Recent Health Events</Text>
          {healthEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventIcon}>
                <MaterialIcons
                  name={
                    event.type === "walk" ? "directions-walk" :
                    event.type === "meal" ? "restaurant" :
                    event.type === "medication" ? "medication" :
                    event.type === "symptom" ? "warning" :
                    event.type === "vet_visit" ? "local-hospital" :
                    event.type === "vaccination" ? "vaccines" :
                    event.type === "grooming" ? "content-cut" :
                    "sports"
                  }
                  size={24}
                  color="#4CAF50"
                />
              </View>
              <View style={styles.eventDetails}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
                <Text style={styles.eventTime}>
                  {event.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} 
                </Text>
              </View>
              {event.severity && (
                <View style={[styles.severityBadge, {
                  backgroundColor: event.severity === "critical" ? "#F44336" :
                                 event.severity === "high" ? "#FF9800" :
                                 event.severity === "medium" ? "#FFC107" : "#4CAF50"
                }]}>
                  <Text style={styles.severityText}>{event.severity.toUpperCase()}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.aiInsights}>
          <Text style={styles.sectionTitle}> AI Health Insights</Text>
          {aiInsights.map((insight) => (
            <View key={insight.id} style={[styles.insightCard, styles[`insight${insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)}` as keyof typeof styles]]}>
              <MaterialIcons
                name={
                  insight.type === "health" ? "favorite" :
                  insight.type === "behavior" ? "psychology" :
                  insight.type === "nutrition" ? "restaurant" :
                  insight.type === "exercise" ? "fitness-center" :
                  insight.type === "warning" ? "warning" :
                  "emoji-events"
                }
                size={24}
                color={
                  insight.priority === "urgent" ? "#F44336" :
                  insight.priority === "high" ? "#FF9800" :
                  insight.priority === "medium" ? "#FFC107" : "#4CAF50"
                }
              />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>{insight.description}</Text>
                {insight.actionable && (
                  <TouchableOpacity style={styles.insightAction}>
                    <Text style={styles.insightActionText}>{insight.actionText}</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#4CAF50" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyMode}>
          <MaterialIcons name="emergency" size={24} color="#FFFFFF" />
          <Text style={styles.emergencyText}>Emergency Mode</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Payment Screen Modal */}
      <PaymentScreen
        visible={showPaymentScreen}
        onClose={() => setShowPaymentScreen(false)}
        onSubscriptionChange={(isPremium) => {
          setIsPremium(isPremium);
          setShowPaymentScreen(false);
        }}
      />

      {/* Health Tracking Modal */}
      {showHealthTracking && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Health Tracking</Text>
              <TouchableOpacity onPress={() => setShowHealthTracking(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>
              Track your dog's health metrics including weight, activity levels, 
              eating patterns, and behavior changes over time.
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowHealthTracking(false)}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Breed Info Modal */}
      {showBreedInfo && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Breed Information</Text>
              <TouchableOpacity onPress={() => setShowBreedInfo(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>
              Learn about Golden Retriever-specific health needs, exercise requirements, 
              common health issues, and care recommendations.
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowBreedInfo(false)}
            >
              <Text style={styles.modalButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dogInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  dogDetails: {
    marginLeft: 12,
  },
  dogName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  dogBreed: {
    fontSize: 16,
    color: "#E8F5E8",
    marginTop: 2,
  },
  pulseScoreContainer: {
    alignItems: "center",
  },
  pulseScoreLabel: {
    fontSize: 14,
    color: "#E8F5E8",
    marginBottom: 4,
  },
  pulseScore: {
    fontSize: 36,
    fontWeight: "bold",
  },
  healthStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  healthStatusText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
  healthOverview: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  healthMetrics: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  metric: {
    alignItems: "center",
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  metricLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  recentEvents: {
    marginBottom: 20,
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F5E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  eventTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  aiInsights: {
    marginBottom: 20,
  },
  insightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 8,
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: "#F44336",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  emergencyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 16,
  },
  gamificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    width: "100%",
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  xpContainer: {
    marginTop: 8,
    width: "100%",
  },
  xpText: {
    color: "#E8F5E8",
    fontSize: 12,
    marginBottom: 4,
  },
  xpBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  xpProgress: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 2,
  },
  achievementNotification: {
    backgroundColor: "#FFD700",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  achievementText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  actionXP: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "bold",
    marginTop: 2,
  },
  dogNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  premiumText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 2,
  },
  moodContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  moodText: {
    color: "#E8F5E8",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  energyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  energyBar: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  energyFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  energyText: {
    color: "#E8F5E8",
    fontSize: 12,
    fontWeight: "bold",
  },
  premiumAction: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  premiumDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD700",
  },
  premiumActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  premiumButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  healthReportButton: {
    backgroundColor: "#2196F3",
  },
  premiumFeaturesButton: {
    backgroundColor: "#FFD700",
  },
  premiumButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  premiumButtonXP: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  notificationBadge: {
    position: "relative",
  },
  notificationCount: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#F44336",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationCountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  dailyGoalsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  dailyGoalsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  goalProgress: {
    gap: 12,
  },
  goalItem: {
    gap: 4,
  },
  goalText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  goalBar: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  goalFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },
  insightLow: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  insightMedium: {
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  insightHigh: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  insightUrgent: {
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  insightAction: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  insightActionText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  // BREAKTHROUGH FEATURES STYLES
  breakthroughButton: {
    borderWidth: 2,
    borderColor: "#FF6B35",
    backgroundColor: "#FFF5F0",
  },
  breakthroughBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  breakthroughText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "bold",
  },
  breakthroughSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  breakthroughTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 8,
  },
  breakthroughSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  breakthroughGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  breakthroughCard: {
    width: "48%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  geneticCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  communityCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  emergencyCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  breakthroughCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  breakthroughCardDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
    lineHeight: 16,
  },
  breakthroughCardSavings: {
    fontSize: 11,
    color: "#4CAF50",
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center",
  },
  // Modal styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
