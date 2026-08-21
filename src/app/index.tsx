import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Image, Linking, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';


import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const FaradayBlue = '#208AEF';
const EMAIL = 'officialsujitmemane@gmail.com';
const PHONE_DISPLAY = '+91 8624800390';
const PHONE_E164 = '918624800390';
const WHATSAPP_HIRED_MESSAGE = "You're hired — let's have a call";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.06, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse]);

  const pingGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    shadowOpacity: 0.35 + (pulse.value - 1) * 4,
  }));

  const handleFireNotification = async () => {
    try {
      console.log('Firing local notification...');

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('Existing permission status:', existingStatus);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        console.log('Requesting notification permissions...');
        const permissionResponse = await Notifications.requestPermissionsAsync();

        finalStatus = permissionResponse.status;
        console.log('Permission response:', permissionResponse);
      }
      if (finalStatus !== 'granted') {
        console.log('Notification permission not granted:', finalStatus);
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('faraday-ping', {
          name: 'Faraday ping',
          importance: Notifications.AndroidImportance.MAX,
          sound: 'notification.wav',
        });
      }

      console.log('Scheduling notification...');
      const notification = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Faraday',
          body: 'Sujit Memane wants to work with you Just testing this ping — hire him?',
          sound: 'notification.wav',
          color: FaradayBlue,
        },
        trigger:
          Platform.OS === 'android'
            ? {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 1,
                channelId: 'faraday-ping',
              }
            : null,
      });
      console.log('Notification scheduled:', notification);
    } catch (error) {
      console.log('error', error);
    }
  };

  const openEmail = () => {
    void Linking.openURL(
      `mailto:${EMAIL}?subject=${encodeURIComponent("You're hired")}&body=${encodeURIComponent("You're hired. Let's talk.")}`,
    );
  };

  const openCall = () => {
    void Linking.openURL(`tel:+${PHONE_E164}`);
  };

  const openWhatsApp = () => {
    void Linking.openURL(
      `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(WHATSAPP_HIRED_MESSAGE)}`,
    );
  };

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}>
        
          <Image width={44} height={44} style={{
            width: 44,
            height: 44,
   
            alignItems: 'center',
            justifyContent: 'center',
          }} source={require("../../assets/images/icon.png")}  />
          <View>
            <ThemedText type="smallBold" style={styles.wordmark}>
              FARADAY
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Take-home · notifications
            </ThemedText>
          </View>
        </View>

        <View style={styles.hero}>
          <ThemedText type="title" style={styles.headline}>
            Built to ping{'\n'}the right people.
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.lede}>
            Sujit Memane · SDE-1, Fintech
          </ThemedText>
        </View>

        <Animated.View style={[styles.pingWrap, pingGlowStyle]}>
          <Pressable
            onPress={handleFireNotification}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
            <ThemedText type="smallBold" style={styles.ctaEyebrow}>
              Tap this
            </ThemedText>
            <ThemedText style={styles.ctaLabel}>Send Faraday ping</ThemedText>
          </Pressable>
        </Animated.View>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold" style={styles.cardEyebrow}>
            Hire him
          </ThemedText>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            You are hired
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            Fintech SDE-1. Email, call, or WhatsApp — prefilled as hired, let’s have a call.
          </ThemedText>

          <Pressable onPress={openEmail} style={({ pressed }) => [styles.contactRow, pressed && styles.ctaPressed]}>
            <ThemedText type="smallBold" style={styles.contactLabel}>
              Email
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {EMAIL}
            </ThemedText>
          </Pressable>

          <Pressable onPress={openCall} style={({ pressed }) => [styles.contactRow, pressed && styles.ctaPressed]}>
            <ThemedText type="smallBold" style={styles.contactLabel}>
              Direct call
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {PHONE_DISPLAY}
            </ThemedText>
          </Pressable>

          <Pressable onPress={openWhatsApp} style={({ pressed }) => [styles.contactRow, pressed && styles.ctaPressed]}>
            <ThemedText type="smallBold" style={styles.contactLabel}>
              WhatsApp
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              wa.me · You’re hired, let’s have a call
            </ThemedText>
          </Pressable>
        </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.five,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: FaradayBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markLetter: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  wordmark: {
    letterSpacing: 3,
    color: FaradayBlue,
  },
  hero: {
    gap: Spacing.two,
  },
  headline: {
    fontSize: 40,
    lineHeight: 44,
  },
  lede: {
    fontSize: 16,
  },
  pingWrap: {
    shadowColor: FaradayBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 18,
    elevation: 12,
  },
  card: {
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  cardEyebrow: {
    color: FaradayBlue,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 24,
    lineHeight: 30,
  },
  contactRow: {
    marginTop: Spacing.two,
    backgroundColor: 'rgba(32, 138, 239, 0.12)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: Spacing.three,
    gap: 2,
  },
  contactLabel: {
    color: FaradayBlue,
  },
  cta: {
    backgroundColor: FaradayBlue,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9DCEFF',
  },
  ctaPressed: {
    opacity: 0.88,
  },
  ctaEyebrow: {
    color: '#D6EBFF',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  ctaLabel: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 20,
  },
});
