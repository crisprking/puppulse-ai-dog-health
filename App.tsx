import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

// Types
interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  lastVetVisit: string;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  vaccinations: string[];
  medications: string[];
  allergies: string[];
  emergencyContacts: string[];
  biometricData: {
    heartRate: number;
    temperature: number;
    breathingRate: number;
    lastUpdated: string;
  };
  behaviorPatterns: {
    activity: 'high' | 'medium' | 'low';
    appetite: 'excellent' | 'good' | 'poor';
    sleep: 'normal' | 'restless' | 'excessive';
    mood: 'happy' | 'neutral' | 'anxious' | 'depressed';
  };
  healthPredictions: {
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
    nextCheckup: string;
  };
}

interface HealthEvent {
  id: string;
  date: string;
  type: 'vaccination' | 'checkup' | 'medication' | 'symptom' | 'emergency';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  source: string;
  urgency: 'low' | 'medium' | 'high';
  costSavings: number;
  lifeImpact: string;
  relatedDogs: string[];
  scientificBacking: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

// Sample Data
const currentDog: Dog = {
  id: '1',
  name: 'Buddy',
  breed: 'Golden Retriever',
  age: 3,
  weight: 65,
  lastVetVisit: '2024-01-15',
  healthStatus: 'excellent',
  vaccinations: ['Rabies', 'DHPP', 'Bordetella'],
  medications: ['Heartworm Prevention'],
  allergies: ['Chicken'],
  emergencyContacts: ['Dr. Smith: (555) 123-4567'],
  biometricData: {
    heartRate: 85,
    temperature: 101.2,
    breathingRate: 20,
    lastUpdated: '2024-01-20'
  },
  behaviorPatterns: {
    activity: 'high',
    appetite: 'excellent',
    sleep: 'normal',
    mood: 'happy'
  },
  healthPredictions: {
    riskLevel: 'low',
    recommendations: ['Continue current exercise routine', 'Schedule annual checkup'],
    nextCheckup: '2024-07-15'
  }
};

const healthEvents: HealthEvent[] = [
  {
    id: '1',
    date: '2024-01-20',
    type: 'symptom',
    description: 'Mild limping on front left paw',
    severity: 'low',
    resolved: true
  },
  {
    id: '2',
    date: '2024-01-15',
    type: 'checkup',
    description: 'Annual wellness exam - all clear',
    severity: 'low',
    resolved: true
  },
  {
    id: '3',
    date: '2024-01-10',
    type: 'vaccination',
    description: 'Rabies booster administered',
    severity: 'low',
    resolved: true
  }
];

const aiInsights: AIInsight[] = [
  {
    id: '1',
    title: 'Exercise Optimization',
    description: 'Based on your dog\'s activity patterns, consider increasing morning walks by 10 minutes for optimal health.',
    confidence: 92,
    source: 'Activity Analysis',
    urgency: 'low',
    costSavings: 150,
    lifeImpact: 'Reduces obesity risk by 25%',
    relatedDogs: ['Similar breeds in your area'],
    scientificBacking: 'Journal of Veterinary Behavior, 2023'
  },
  {
    id: '2',
    title: 'Nutritional Alert',
    description: 'Your dog\'s weight trend suggests adjusting portion size by 5% to maintain optimal body condition.',
    confidence: 88,
    source: 'Weight Tracking',
    urgency: 'medium',
    costSavings: 200,
    lifeImpact: 'Prevents joint problems in senior years',
    relatedDogs: ['Golden Retrievers aged 3-5'],
    scientificBacking: 'Veterinary Clinical Nutrition, 2023'
  }
];

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'Health Tracker',
    description: 'Log health data for 7 consecutive days',
    icon: '',
    unlocked: true,
    progress: 7,
    maxProgress: 7
  },
  {
    id: '2',
    title: 'Vet Pro',
    description: 'Schedule 3 vet appointments',
    icon: '',
    unlocked: false,
    progress: 2,
    maxProgress: 3
  },
  {
    id: '3',
    title: 'Exercise Champion',
    description: 'Track 30 days of exercise',
    icon: '',
    unlocked: false,
    progress: 15,
    maxProgress: 30
  }
];

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showHealthTracking, setShowHealthTracking] = useState(false);
  const [showBreedInfo, setShowBreedInfo] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showEmergencyMode, setShowEmergencyMode] = useState(false);
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
        'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
        'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
      });
      setFontsLoaded(true);
    } catch (error) {
      console.log('Font loading error:', error);
      setFontsLoaded(true); // Continue without custom fonts
    }
  };

  const handleHealthTracking = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowHealthTracking(true);
  };

  const handleBreedInfo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowBreedInfo(true);
  };

  const handleCommunity = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCommunity(true);
  };

  const handleEmergencyMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setShowEmergencyMode(true);
  };

  const handlePayment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowPaymentScreen(true);
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'fair': return '#FF9800';
      case 'poor': return '#F44336';
      default: return '#4CAF50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#FF5722';
      case 'critical': return '#F44336';
      default: return '#4CAF50';
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading PupPulse...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>PupPulse</Text>
          <Text style={styles.headerSubtitle}>AI Dog Health Companion</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={handlePayment}>
          <Ionicons name="person-circle" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dog Profile Card */}
        <View style={styles.dogCard}>
          <View style={styles.dogHeader}>
            <View style={styles.dogInfo}>
              <Text style={styles.dogName}>{currentDog.name}</Text>
              <Text style={styles.dogBreed}>{currentDog.breed}  {currentDog.age} years</Text>
            </View>
            <View style={[styles.healthStatus, { backgroundColor: getHealthStatusColor(currentDog.healthStatus) }]}>
              <Text style={styles.healthStatusText}>{currentDog.healthStatus.toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.dogStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentDog.weight} lbs</Text>
              <Text style={styles.statLabel}>Weight</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentDog.biometricData.heartRate} bpm</Text>
              <Text style={styles.statLabel}>Heart Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentDog.biometricData.temperature}F</Text>
              <Text style={styles.statLabel}>Temperature</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleHealthTracking}>
            <Ionicons name="fitness" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Health Tracking</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleBreedInfo}>
            <Ionicons name="information-circle" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Breed Info</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleCommunity}>
            <Ionicons name="people" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Community</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.emergencyButton]} onPress={handleEmergencyMode}>
            <Ionicons name="medical" size={24} color="#FFFFFF" />
            <Text style={[styles.actionText, styles.emergencyText]}>Emergency</Text>
          </TouchableOpacity>
        </View>

        {/* AI Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Health Insights</Text>
          {aiInsights.map((insight) => (
            <View key={insight.id} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <View style={[styles.confidenceBadge, { backgroundColor: getSeverityColor(insight.urgency) }]}>
                  <Text style={styles.confidenceText}>{insight.confidence}%</Text>
                </View>
              </View>
              <Text style={styles.insightDescription}>{insight.description}</Text>
              <View style={styles.insightFooter}>
                <Text style={styles.insightSource}>Source: {insight.source}</Text>
                <Text style={styles.insightSavings}> Save ${insight.costSavings}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Health Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Health Events</Text>
          {healthEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventType}>{event.type.toUpperCase()}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
              </View>
              <Text style={styles.eventDescription}>{event.description}</Text>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(event.severity) }]}>
                <Text style={styles.severityText}>{event.severity.toUpperCase()}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={[styles.achievementCard, achievement.unlocked && styles.achievementUnlocked]}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${(achievement.progress / achievement.maxProgress) * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>{achievement.progress}/{achievement.maxProgress}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <Modal visible={showHealthTracking} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Health Tracking</Text>
            <TouchableOpacity onPress={() => setShowHealthTracking(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalText}>Track your dog's daily health metrics, symptoms, and behaviors.</Text>
            <Text style={styles.modalText}>Features: Weight tracking, symptom logging, medication reminders, and AI-powered health analysis.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={showBreedInfo} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Breed Information</Text>
            <TouchableOpacity onPress={() => setShowBreedInfo(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalText}>Learn about your dog's breed characteristics, health predispositions, and care requirements.</Text>
            <Text style={styles.modalText}>Features: Breed-specific health tips, genetic health risks, and personalized care recommendations.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={showCommunity} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Community</Text>
            <TouchableOpacity onPress={() => setShowCommunity(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalText}>Connect with other dog owners, share experiences, and get advice from the community.</Text>
            <Text style={styles.modalText}>Features: Discussion forums, photo sharing, local meetups, and expert Q&A sessions.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={showEmergencyMode} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={[styles.modalContainer, styles.emergencyModal]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, styles.emergencyTitle]}>Emergency Mode</Text>
            <TouchableOpacity onPress={() => setShowEmergencyMode(false)}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.emergencyText}>Emergency contacts and quick access to veterinary services.</Text>
            <Text style={styles.emergencyText}>Features: Emergency vet finder, symptom checker, first aid guide, and direct calling to emergency services.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={showPaymentScreen} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Premium Features</Text>
            <TouchableOpacity onPress={() => setShowPaymentScreen(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalText}>Unlock advanced AI features, unlimited health tracking, and premium support.</Text>
            <Text style={styles.modalText}>Features: Advanced AI analysis, unlimited health records, priority support, and exclusive content.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8F5E8',
  },
  profileButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dogInfo: {
    flex: 1,
  },
  dogName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dogBreed: {
    fontSize: 16,
    color: '#666',
  },
  healthStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  healthStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dogStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emergencyButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 5,
  },
  emergencyText: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  insightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightSource: {
    fontSize: 12,
    color: '#999',
  },
  insightSavings: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  eventDate: {
    fontSize: 12,
    color: '#999',
  },
  eventDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    width: (width - 60) / 2,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementUnlocked: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  achievementIcon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  emergencyModal: {
    backgroundColor: '#F44336',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  emergencyTitle: {
    color: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 15,
  },
  emergencyText: {
    color: '#FFFFFF',
  },
});
