import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useDeviceAuth } from '../../hooks/useDeviceAuth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Colors } from '../../constants/Colors';
import { getApiErrorMessage } from '../../services/api';

export default function LoginScreen() {
    const router = useRouter();
    const { loginWithDevice, rebindDeviceWithLock, deviceToken } = useAuth();
    const { security, refreshSecurity } = useDeviceAuth();

    const [isRebindMode, setIsRebindMode] = useState(false);
    const [rebindEmail, setRebindEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasAttemptedAutoPrompt, setHasAttemptedAutoPrompt] = useState(false);

    // Primary action: Authenticate with active phone lock (Biometrics / PIN / Pattern)
    const handleDeviceUnlock = useCallback(async () => {
        try {
            setLoading(true);
            await loginWithDevice();
            router.replace('/(tabs)/tab1');
        } catch (error: any) {
            if (error?.message === 'NO_DEVICE_TOKEN') {
                setIsRebindMode(true);
                Alert.alert(
                    'No Linked Account',
                    'This device is not yet linked. Enter your email to claim/rebind this phone, or tap Register below.'
                );
            } else {
                Alert.alert(
                    'Authentication',
                    getApiErrorMessage(error, error?.message || 'Device authentication could not be completed.')
                );
            }
        } finally {
            setLoading(false);
        }
    }, [loginWithDevice, router]);

    // Auto-prompt device lock on initial launch if device is already registered
    useEffect(() => {
        let isMounted = true;
        const autoPrompt = async () => {
            if (!hasAttemptedAutoPrompt && deviceToken) {
                setHasAttemptedAutoPrompt(true);
                setTimeout(() => {
                    if (isMounted) {
                        void handleDeviceUnlock();
                    }
                }, 400);
            }
        };
        void autoPrompt();
        return () => {
            isMounted = false;
        };
    }, [deviceToken, hasAttemptedAutoPrompt, handleDeviceUnlock]);

    // Handle account rebind for new phone or cleared cache
    const handleRebind = async () => {
        const cleanEmail = rebindEmail.trim();
        if (!cleanEmail) {
            return Alert.alert('Email Required', 'Please enter your registered account email.');
        }

        try {
            setLoading(true);
            await rebindDeviceWithLock(cleanEmail);
            Alert.alert('Device Linked', 'Your account was successfully linked to this phone.', [
                {
                    text: 'Continue to DebShop',
                    onPress: () => router.replace('/(tabs)/tab1'),
                },
            ]);
        } catch (error: any) {
            Alert.alert(
                'Linking Failed',
                getApiErrorMessage(error, error?.message || 'Could not link this device to the specified email.')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right', 'bottom']}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Top Security Pill */}
                    <View style={styles.topSecurityRow}>
                        <View style={styles.hardwareBadge}>
                            <Ionicons name="shield-checkmark" size={13} color={Colors.primary} />
                            <Text style={styles.hardwareBadgeText}>HARDWARE-ENCRYPTED LOCK</Text>
                        </View>
                    </View>

                    {/* Brand Presentation */}
                    <View style={styles.brandHero}>
                        <View style={styles.logoAura}>
                            <Image
                                source={require('../../../assets/logo.png')}
                                style={styles.logoImage}
                                resizeMode="cover"
                            />
                        </View>
                        <Text style={styles.brandTitle}>DebShop</Text>
                        <Text style={styles.brandTagline}>Your Premium Retail Destination</Text>
                    </View>

                    {/* Main Interaction Card */}
                    <View style={styles.authCard}>
                        {/* Segmented Mode Switcher */}
                        <View style={styles.tabSwitcher}>
                            <TouchableOpacity
                                style={[styles.tabButton, !isRebindMode && styles.tabButtonActive]}
                                onPress={() => setIsRebindMode(false)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="finger-print"
                                    size={15}
                                    color={!isRebindMode ? Colors.primary : Colors.textMuted}
                                />
                                <Text
                                    style={[
                                        styles.tabButtonText,
                                        !isRebindMode && styles.tabButtonTextActive,
                                    ]}
                                >
                                    Quick Unlock
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.tabButton, isRebindMode && styles.tabButtonActive]}
                                onPress={() => setIsRebindMode(true)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="swap-horizontal"
                                    size={15}
                                    color={isRebindMode ? Colors.primary : Colors.textMuted}
                                />
                                <Text
                                    style={[
                                        styles.tabButtonText,
                                        isRebindMode && styles.tabButtonTextActive,
                                    ]}
                                >
                                    Link Phone
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {!isRebindMode ? (
                            /* Standard Biometric Lock Mode */
                            <View style={styles.cardBody}>
                                <View style={styles.biometricOuterRing}>
                                    <View style={styles.biometricMiddleRing}>
                                        <View style={styles.biometricCore}>
                                            <Ionicons name="finger-print" size={48} color={Colors.primary} />
                                        </View>
                                    </View>
                                </View>

                                <Text style={styles.cardHeaderTitle}>Device Authentication</Text>
                                <Text style={styles.cardHeaderSubtitle}>
                                    Touch sensor, scan Face ID, or verify your phone screen lock to proceed.
                                </Text>

                                {security.warningMessage && (
                                    <View style={styles.warningBox}>
                                        <Ionicons name="alert-circle" size={16} color="#DC2626" />
                                        <Text style={styles.warningText}>{security.warningMessage}</Text>
                                    </View>
                                )}

                                <Button
                                    title={loading ? 'Verifying Lock...' : 'Unlock Account'}
                                    onPress={handleDeviceUnlock}
                                    loading={loading}
                                    style={styles.primaryActionBtn}
                                />
                            </View>
                        ) : (
                            /* Rebind / New Phone Mode */
                            <View style={styles.cardBody}>
                                <View style={styles.rebindIconCircle}>
                                    <Ionicons name="phone-portrait-outline" size={32} color={Colors.primary} />
                                </View>

                                <Text style={styles.cardHeaderTitle}>Claim / Rebind Device</Text>
                                <Text style={styles.cardHeaderSubtitle}>
                                    Enter your registered email to link this phone using your active screen lock.
                                </Text>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.fieldLabel}>Account Email</Text>
                                    <Input
                                        placeholder="e.g. name@example.com"
                                        value={rebindEmail}
                                        onChangeText={setRebindEmail}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                    />
                                </View>

                                <Button
                                    title={loading ? 'Confirming Lock...' : 'Verify Phone Lock & Link'}
                                    onPress={handleRebind}
                                    loading={loading}
                                    style={styles.primaryActionBtn}
                                />
                            </View>
                        )}
                    </View>

                    {/* Footer Registration Action */}
                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>New to DebShop? </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/register')}
                            activeOpacity={0.7}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Text style={styles.footerLink}>Register New Device</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Security Note */}
                    <View style={styles.securityFootnote}>
                        <Ionicons name="lock-closed-outline" size={12} color={Colors.textMuted} />
                        <Text style={styles.securityFootnoteText}>
                            Passwordless Security · Zero Credentials Stored on Cloud
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 22,
        paddingVertical: 24,
    },
    topSecurityRow: {
        alignItems: 'center',
        marginBottom: 16,
    },
    hardwareBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryLight,
        paddingVertical: 5,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#A7F3D0',
        gap: 6,
    },
    hardwareBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: Colors.primaryDark,
        letterSpacing: 1.1,
    },
    brandHero: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoAura: {
        width: 86,
        height: 86,
        borderRadius: 26,
        backgroundColor: '#0F172A',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(5, 150, 105, 0.4)',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        marginBottom: 12,
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    brandTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: Colors.text,
        letterSpacing: 1,
    },
    brandTagline: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textMuted,
        marginTop: 3,
        letterSpacing: 0.3,
    },
    authCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 6,
    },
    tabSwitcher: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 14,
        padding: 4,
        marginBottom: 20,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 9,
        borderRadius: 11,
    },
    tabButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    tabButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textMuted,
    },
    tabButtonTextActive: {
        color: Colors.primary,
        fontWeight: '800',
    },
    cardBody: {
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    biometricOuterRing: {
        width: 104,
        height: 104,
        borderRadius: 52,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    biometricMiddleRing: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: '#D1FAE5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    biometricCore: {
        width: 66,
        height: 66,
        borderRadius: 33,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    rebindIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#A7F3D0',
    },
    cardHeaderTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text,
        textAlign: 'center',
    },
    cardHeaderSubtitle: {
        fontSize: 13,
        color: Colors.textMuted,
        textAlign: 'center',
        marginTop: 6,
        marginBottom: 20,
        lineHeight: 18,
        paddingHorizontal: 8,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 10,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 4,
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        padding: 10,
        borderRadius: 12,
        marginBottom: 16,
        width: '100%',
        gap: 8,
    },
    warningText: {
        fontSize: 12,
        color: '#DC2626',
        flex: 1,
    },
    primaryActionBtn: {
        width: '100%',
        marginTop: 6,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    footerText: {
        fontSize: 14,
        color: Colors.textMuted,
    },
    footerLink: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.primary,
    },
    securityFootnote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        marginTop: 18,
    },
    securityFootnoteText: {
        fontSize: 11,
        color: Colors.textMuted,
    },
});
