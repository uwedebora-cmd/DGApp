import React, { useState } from 'react';
import {
    Platform,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable,
    ScrollView,
    Image,
    Alert,
} from 'react-native';
import { Tabs, useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { DevIcon } from '../../components/DevInfoModal';

interface NavItem {
    key: string;
    label: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    path: '/(tabs)/tab1' | '/(tabs)/tab2' | '/(tabs)/tab3' | '/(tabs)/tab4' | '/(tabs)/profile';
    badge?: number;
}

export default function TabLayout() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { t, lang, setLang } = useLanguage();
    const router = useRouter();
    const segments = useSegments();
    const insets = useSafeAreaInsets();
    const [drawerVisible, setDrawerVisible] = useState(false);

    const isAdmin = user?.role === 'admin' || user?.is_admin === true;
    const currentTab = segments[1] || 'tab1';

    const handleNavigate = (path: '/(tabs)/tab1' | '/(tabs)/tab2' | '/(tabs)/tab3' | '/(tabs)/tab4' | '/(tabs)/profile') => {
        setDrawerVisible(false);
        router.push(path);
    };

    const handleLogout = () => {
        setDrawerVisible(false);
        Alert.alert(
            t.logout,
            lang === 'en'
                ? 'Are you sure you want to log out?'
                : lang === 'rw'
                ? 'Urashaka gusohoka?'
                : 'Êtes-vous sûr de vouloir vous déconnecter?',
            [
                { text: t.cancel, style: 'cancel' },
                { text: t.logout, style: 'destructive', onPress: logout },
            ]
        );
    };

    const navItems: NavItem[] = isAdmin
        ? [
              {
                  key: 'tab1',
                  label: 'Dashboard',
                  subtitle: 'Store overview & stats',
                  icon: 'speedometer' as const,
                  path: '/(tabs)/tab1' as const,
              },
              {
                  key: 'tab2',
                  label: 'Inventory',
                  subtitle: 'Manage products & stock',
                  icon: 'layers' as const,
                  path: '/(tabs)/tab2' as const,
              },
              {
                  key: 'tab3',
                  label: 'Fulfillment',
                  subtitle: 'Deliveries & dispatch',
                  icon: 'paper-plane' as const,
                  path: '/(tabs)/tab3' as const,
              },
              {
                  key: 'tab4',
                  label: 'Reports',
                  subtitle: 'Revenue & analytics',
                  icon: 'trending-up' as const,
                  path: '/(tabs)/tab4' as const,
              },
              {
                  key: 'profile',
                  label: 'Admin Profile',
                  subtitle: 'Account & permissions',
                  icon: 'shield-checkmark' as const,
                  path: '/(tabs)/profile' as const,
              },
          ]
        : [
              {
                  key: 'tab1',
                  label: 'Explore',
                  subtitle: 'Featured catalog & offers',
                  icon: 'storefront' as const,
                  path: '/(tabs)/tab1' as const,
              },
              {
                  key: 'tab2',
                  label: 'Discover',
                  subtitle: 'Search & browse by category',
                  icon: 'compass' as const,
                  path: '/(tabs)/tab2' as const,
              },
              {
                  key: 'tab3',
                  label: 'Shopping Bag',
                  subtitle: 'View cart & checkout',
                  icon: 'bag-handle' as const,
                  badge: cartCount > 0 ? cartCount : undefined,
                  path: '/(tabs)/tab3' as const,
              },
              {
                  key: 'tab4',
                  label: 'My Orders',
                  subtitle: 'Track deliveries & receipts',
                  icon: 'receipt' as const,
                  path: '/(tabs)/tab4' as const,
              },
              {
                  key: 'profile',
                  label: 'My Account',
                  subtitle: 'Settings, language & profile',
                  icon: 'person-circle' as const,
                  path: '/(tabs)/profile' as const,
              },
          ];

    return (
        <>
            <Tabs
                backBehavior="history"
                screenOptions={{
                    tabBarStyle: {
                        display: 'none', // Tabs are held in the top-left hamburger menu drawer
                    },
                    headerStyle: {
                        backgroundColor: Colors.primary,
                        elevation: 4,
                        shadowColor: Colors.primaryDark,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 6,
                    },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: {
                        fontWeight: '900',
                        fontSize: 19,
                        letterSpacing: 0.8,
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => setDrawerVisible(true)}
                            activeOpacity={0.7}
                            style={styles.hamburgerButton}
                            hitSlop={{ top: 12, bottom: 12, left: 14, right: 14 }}
                        >
                            <Ionicons name="menu" size={27} color="#FFFFFF" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View style={styles.headerRightContainer}>
                            {!isAdmin && (
                                <TouchableOpacity
                                    onPress={() => router.push('/(tabs)/tab3')}
                                    style={styles.cartIconWrapper}
                                    activeOpacity={0.7}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons name="bag-handle-outline" size={22} color="#FFFFFF" />
                                    {cartCount > 0 && (
                                        <View style={styles.cartHeaderBadge}>
                                            <Text style={styles.cartHeaderBadgeText}>
                                                {cartCount > 99 ? '99+' : cartCount}
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}
                            <DevIcon />
                        </View>
                    ),
                }}
            >
                <Tabs.Screen
                    name="tab1"
                    options={{
                        title: isAdmin ? 'DebShop • Dashboard' : 'DebShop • Explore',
                    }}
                />
                <Tabs.Screen
                    name="tab2"
                    options={{
                        title: isAdmin ? 'DebShop • Inventory' : 'DebShop • Discover',
                    }}
                />
                <Tabs.Screen
                    name="tab3"
                    options={{
                        title: isAdmin ? 'DebShop • Fulfillment' : 'DebShop • Bag',
                    }}
                />
                <Tabs.Screen
                    name="tab4"
                    options={{
                        title: isAdmin ? 'DebShop • Reports' : 'DebShop • Orders',
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: isAdmin ? 'DebShop • Admin' : 'DebShop • Account',
                    }}
                />
                <Tabs.Screen
                    name="index"
                    options={{
                        href: null,
                    }}
                />
            </Tabs>

            {/* TOP-LEFT HAMBURGER SLIDE-IN NAVIGATION DRAWER */}
            <Modal
                visible={drawerVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDrawerVisible(false)}
                statusBarTranslucent
            >
                <Pressable style={styles.drawerBackdrop} onPress={() => setDrawerVisible(false)}>
                    <Pressable
                        style={[styles.drawerContainer, { paddingTop: Math.max(insets.top, 24) }]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Drawer Header with Brand Logo */}
                        <View style={styles.drawerHeader}>
                            <View style={styles.drawerBrandRow}>
                                <View style={styles.brandLogoBox}>
                                    <Image
                                        source={require('../../../assets/logo.png')}
                                        style={styles.brandLogoImage}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View style={styles.brandTitleBox}>
                                    <Text style={styles.brandTitleText}>DebShop</Text>
                                    <Text style={styles.brandSubText}>Premium Retail App</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => setDrawerVisible(false)}
                                activeOpacity={0.7}
                                style={styles.closeDrawerBtn}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="close" size={22} color={Colors.textMuted} />
                            </TouchableOpacity>
                        </View>

                        {/* User Identity Chip */}
                        <View style={styles.userCard}>
                            <View style={styles.userAvatarCircle}>
                                <Ionicons
                                    name={isAdmin ? 'shield-checkmark' : 'person'}
                                    size={18}
                                    color="#FFFFFF"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.userEmailText} numberOfLines={1}>
                                    {user?.email || 'Customer'}
                                </Text>
                                <View style={styles.roleBadge}>
                                    <Text style={styles.roleBadgeText}>
                                        {isAdmin ? 'ADMINISTRATOR' : 'VERIFIED SHOPPER'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.navSectionHeading}>NAVIGATION</Text>

                        {/* Navigation Items (The Tabs held by the hamburger) */}
                        <ScrollView
                            style={styles.navScroll}
                            contentContainerStyle={styles.navScrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {navItems.map((item) => {
                                const isActive = currentTab === item.key;
                                return (
                                    <TouchableOpacity
                                        key={item.key}
                                        style={[
                                            styles.navItemRow,
                                            isActive && styles.navItemRowActive,
                                        ]}
                                        onPress={() => handleNavigate(item.path)}
                                        activeOpacity={0.75}
                                    >
                                        <View
                                            style={[
                                                styles.navIconBox,
                                                isActive && styles.navIconBoxActive,
                                            ]}
                                        >
                                            <Ionicons
                                                name={item.icon}
                                                size={21}
                                                color={isActive ? Colors.primary : Colors.textMuted}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text
                                                style={[
                                                    styles.navItemLabel,
                                                    isActive && styles.navItemLabelActive,
                                                ]}
                                            >
                                                {item.label}
                                            </Text>
                                            <Text style={styles.navItemSubtitle} numberOfLines={1}>
                                                {item.subtitle}
                                            </Text>
                                        </View>
                                        {item.badge !== undefined && (
                                            <View style={styles.navBadgePill}>
                                                <Text style={styles.navBadgeText}>{item.badge}</Text>
                                            </View>
                                        )}
                                        {isActive && (
                                            <View style={styles.activeDotIndicator} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        {/* Drawer Footer with Quick Language Switch & Logout */}
                        <View style={[styles.drawerFooter, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                            {/* Language Pills */}
                            <View style={styles.langSwitchRow}>
                                <Text style={styles.langLabel}>Lang:</Text>
                                {(['en', 'rw', 'fr'] as const).map((l) => (
                                    <TouchableOpacity
                                        key={l}
                                        style={[
                                            styles.langPill,
                                            lang === l && styles.langPillActive,
                                        ]}
                                        onPress={() => setLang(l)}
                                        activeOpacity={0.7}
                                    >
                                        <Text
                                            style={[
                                                styles.langPillText,
                                                lang === l && styles.langPillTextActive,
                                            ]}
                                        >
                                            {l.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Sign Out Button */}
                            <TouchableOpacity
                                style={styles.logoutBtn}
                                onPress={handleLogout}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                                <Text style={styles.logoutBtnText}>{t.logout}</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    hamburgerButton: {
        paddingLeft: 14,
        paddingRight: 10,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 6,
        gap: 4,
    },
    cartIconWrapper: {
        position: 'relative',
        padding: 6,
        marginRight: 4,
    },
    cartHeaderBadge: {
        position: 'absolute',
        top: 2,
        right: 0,
        backgroundColor: Colors.secondary,
        minWidth: 17,
        height: 17,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    cartHeaderBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '900',
    },

    // Drawer Styles
    drawerBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        flexDirection: 'row',
    },
    drawerContainer: {
        width: '82%',
        maxWidth: 320,
        backgroundColor: '#FFFFFF',
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        paddingHorizontal: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 20,
    },
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    drawerBrandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    brandLogoBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: Colors.primary,
        backgroundColor: '#0F172A',
    },
    brandLogoImage: {
        width: '100%',
        height: '100%',
    },
    brandTitleBox: {
        justifyContent: 'center',
    },
    brandTitleText: {
        fontSize: 18,
        fontWeight: '900',
        color: Colors.text,
        letterSpacing: 0.5,
    },
    brandSubText: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.textMuted,
        letterSpacing: 0.3,
    },
    closeDrawerBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.background,
        padding: 12,
        borderRadius: 14,
        marginTop: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    userAvatarCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userEmailText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.text,
    },
    roleBadge: {
        marginTop: 2,
    },
    roleBadgeText: {
        fontSize: 9,
        fontWeight: '800',
        color: Colors.primaryDark,
        letterSpacing: 0.8,
    },
    navSectionHeading: {
        fontSize: 11,
        fontWeight: '800',
        color: Colors.textMuted,
        letterSpacing: 1.2,
        marginBottom: 8,
        marginTop: 4,
    },
    navScroll: {
        flex: 1,
    },
    navScrollContent: {
        paddingVertical: 4,
        gap: 6,
    },
    navItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: 'transparent',
    },
    navItemRowActive: {
        backgroundColor: Colors.primaryLight,
    },
    navIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navIconBoxActive: {
        backgroundColor: '#FFFFFF',
    },
    navItemLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text,
    },
    navItemLabelActive: {
        color: Colors.primary,
        fontWeight: '800',
    },
    navItemSubtitle: {
        fontSize: 11,
        color: Colors.textMuted,
        marginTop: 1,
    },
    navBadgePill: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    navBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
    },
    activeDotIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
    },
    drawerFooter: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: 12,
        gap: 10,
    },
    langSwitchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    langLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textMuted,
    },
    langPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    langPillActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    langPillText: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textMuted,
    },
    langPillTextActive: {
        color: '#FFFFFF',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    logoutBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#DC2626',
    },
});
