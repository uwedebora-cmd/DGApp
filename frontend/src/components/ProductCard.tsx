import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { formatRWF } from '../constants/i18n';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }: { product: any }) {
    const router = useRouter();
    const { addToCart } = useCart();
    const [isFav, setIsFav] = useState(false);
    const [addedQuick, setAddedQuick] = useState(false);

    const rawImages: string[] = Array.isArray(product?.images) ? product.images : [];
    const validImages = rawImages.filter((img: any) => typeof img === 'string' && img.startsWith('http'));
    const imageUrl = validImages[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80';
    const imageCount = validImages.length;

    const handleQuickAdd = (e: any) => {
        e.stopPropagation();
        if ((product.quantity ?? 1) > 0) {
            addToCart(product);
            setAddedQuick(true);
            setTimeout(() => setAddedQuick(false), 1400);
        }
    };

    const handleToggleFav = (e: any) => {
        e.stopPropagation();
        setIsFav((prev) => !prev);
    };

    return (
        <TouchableOpacity
            style={styles.cardFrame}
            onPress={() => router.push(`/product/${product.id}`)}
            activeOpacity={0.88}
        >
            {/* INNER IMAGE SHOWCASE FRAME */}
            <View style={styles.imageShowcaseFrame}>
                <Image source={{ uri: imageUrl }} style={styles.productImage} />

                {/* Top-Left: Multi-Image Pill */}
                {imageCount > 1 && (
                    <View style={styles.imageCountBadge}>
                        <Ionicons name="images" size={10} color="#FFFFFF" style={{ marginRight: 3 }} />
                        <Text style={styles.imageCountText}>{imageCount}</Text>
                    </View>
                )}

                {/* Top-Right: Wishlist Heart Circle */}
                <TouchableOpacity
                    style={[styles.floatingHeartBtn, isFav && styles.floatingHeartBtnActive]}
                    onPress={handleToggleFav}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons
                        name={isFav ? 'heart' : 'heart-outline'}
                        size={15}
                        color={isFav ? '#EF4444' : Colors.text}
                    />
                </TouchableOpacity>

                {/* Bottom-Right of Image Frame: Floating Quick-Add Button */}
                <TouchableOpacity
                    style={[styles.quickAddBtn, addedQuick && styles.quickAddBtnSuccess]}
                    onPress={handleQuickAdd}
                    activeOpacity={0.8}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                    <Ionicons
                        name={addedQuick ? 'checkmark' : 'add'}
                        size={16}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
            </View>

            {/* PRODUCT DETAILS FRAME */}
            <View style={styles.detailsFrame}>
                {/* Micro Brand / Category Pill */}
                <Text style={styles.categoryMicroTag} numberOfLines={1}>
                    {(product?.category || 'DebShop Select').toUpperCase()}
                </Text>

                <Text style={styles.productName} numberOfLines={1}>
                    {product?.name || 'Product'}
                </Text>

                <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>{formatRWF(parseFloat(product?.price || 0))}</Text>
                    <View style={styles.ratingPill}>
                        <Ionicons name="star" size={10} color={Colors.secondary} />
                        <Text style={styles.ratingText}>4.9</Text>
                    </View>
                </View>

                {/* Stock status footer */}
                <View style={styles.stockStatusRow}>
                    {typeof product?.quantity === 'number' && product.quantity <= 5 && product.quantity > 0 ? (
                        <View style={styles.lowStockBadge}>
                            <View style={styles.lowStockDot} />
                            <Text style={styles.lowStockText}>Only {product.quantity} left</Text>
                        </View>
                    ) : (
                        <View style={styles.inStockBadge}>
                            <View style={styles.inStockDot} />
                            <Text style={styles.inStockText}>In Stock</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardFrame: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 9,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 4,
    },
    imageShowcaseFrame: {
        position: 'relative',
        width: '100%',
        height: 138,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageCountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 10,
    },
    imageCountText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    floatingHeartBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    floatingHeartBtnActive: {
        backgroundColor: '#FEE2E2',
    },
    quickAddBtn: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 4,
    },
    quickAddBtnSuccess: {
        backgroundColor: Colors.success,
    },
    detailsFrame: {
        paddingTop: 8,
        paddingHorizontal: 4,
        paddingBottom: 2,
    },
    categoryMicroTag: {
        fontSize: 10,
        fontWeight: '800',
        color: Colors.textMuted,
        letterSpacing: 0.6,
        marginBottom: 2,
    },
    productName: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text,
        letterSpacing: 0.2,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '900',
        color: Colors.primary,
        letterSpacing: 0.2,
    },
    ratingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: Colors.secondaryLight,
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 6,
    },
    ratingText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#92400E',
    },
    stockStatusRow: {
        marginTop: 6,
    },
    lowStockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    lowStockDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.error,
    },
    lowStockText: {
        fontSize: 11,
        color: Colors.error,
        fontWeight: '700',
    },
    inStockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    inStockDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.success,
    },
    inStockText: {
        fontSize: 11,
        color: Colors.textMuted,
        fontWeight: '600',
    },
});
