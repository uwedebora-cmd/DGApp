import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { LanguageProvider } from '../context/LanguageContext';
import { View, Image, ImageBackground, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';
import OfflineNotice from '../components/OfflineNotice';

const SPLASH_DURATION = 1600; // Snappy, modern splash duration

function SplashScreen() {
    return (
        <ImageBackground
            source={require('../../assets/splash.jpg')}
            style={styles.splash}
            resizeMode="cover"
        >
            <View style={styles.splashOverlay}>
                <View style={styles.splashCenter}>
                    <View style={styles.logoWrapper}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.splashLogo}
                            resizeMode="cover"
                        />
                    </View>
                    <Text style={styles.splashBrand}>DebShop</Text>
                    <Text style={styles.splashTagline}>Your Premium Retail Destination</Text>
                </View>
                <View style={styles.splashFooter}>
                    <View style={styles.loadingPill}>
                        <ActivityIndicator size="small" color={Colors.primary} />
                        <Text style={styles.splashLoadingText}>Initializing Secure Store...</Text>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

function RootLayoutNav() {
    const { token, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION);
        return () => clearTimeout(timer);
    }, []);

    // Auth guard (triggers strictly after splash timer and auth resolution)
    useEffect(() => {
        if (showSplash || isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!token && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (token && inAuthGroup) {
            router.replace('/(tabs)/tab1');
        }
    }, [token, isLoading, segments, showSplash]);

    if (showSplash) return <SplashScreen />;

    if (isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <>
            <StatusBar style="light" />
            <OfflineNotice />
            <Slot />
        </>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <LanguageProvider>
                <AuthProvider>
                    <CartProvider>
                        <RootLayoutNav />
                    </CartProvider>
                </AuthProvider>
            </LanguageProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    splash: {
        flex: 1,
        backgroundColor: '#080C14',
    },
    splashOverlay: {
        flex: 1,
        backgroundColor: 'rgba(8, 12, 20, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    splashCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoWrapper: {
        width: 124,
        height: 124,
        borderRadius: 32,
        backgroundColor: '#0F172A',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
        elevation: 16,
        marginBottom: 22,
        borderWidth: 2,
        borderColor: 'rgba(16, 185, 129, 0.45)',
        overflow: 'hidden',
    },
    splashLogo: {
        width: '100%',
        height: '100%',
    },
    splashBrand: {
        fontSize: 26,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 3,
        marginBottom: 6,
        textShadowColor: 'rgba(5, 150, 105, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    splashTagline: {
        fontSize: 13,
        fontWeight: '600',
        color: '#A7F3D0',
        letterSpacing: 0.8,
    },
    splashFooter: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    loadingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        borderWidth: 1,
        borderColor: 'rgba(5, 150, 105, 0.3)',
    },
    splashLoadingText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#CBD5E1',
        letterSpacing: 0.4,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
});
