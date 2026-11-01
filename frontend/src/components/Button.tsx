import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';

export default function Button({ title, onPress, loading, style, textStyle, disabled }: any) {
    const isDisabled = loading || disabled;
    return (
        <TouchableOpacity
            style={[styles.btn, style, isDisabled && styles.btnDisabled]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.85}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
                <Text style={[styles.txt, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    btnDisabled: {
        opacity: 0.65,
    },
    txt: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});
