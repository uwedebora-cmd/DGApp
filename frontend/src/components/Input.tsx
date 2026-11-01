import React, { useState } from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    TextInputProps,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface InputProps extends TextInputProps {
    containerStyle?: StyleProp<ViewStyle>;
    isPassword?: boolean;
}

export default function Input({
    containerStyle,
    isPassword,
    secureTextEntry,
    style,
    onFocus,
    onBlur,
    ...props
}: InputProps) {
    const isPasswordField = isPassword || secureTextEntry;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={[
                        styles.input,
                        isFocused && styles.inputFocused,
                        isPasswordField && styles.inputWithIcon,
                        style,
                    ]}
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={isPasswordField ? !isPasswordVisible : false}
                    onFocus={(e) => {
                        setIsFocused(true);
                        if (onFocus) onFocus(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        if (onBlur) onBlur(e);
                    }}
                    {...props}
                />
                {isPasswordField && (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setIsPasswordVisible((prev) => !prev)}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={19}
                            color={isFocused ? Colors.primary : Colors.textMuted}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 6,
        width: '100%',
    },
    inputWrapper: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: Colors.border,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        fontSize: 15,
        color: Colors.text,
    },
    inputFocused: {
        borderColor: Colors.primary,
        backgroundColor: '#FFFFFF',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    inputWithIcon: {
        paddingRight: 44,
    },
    iconButton: {
        position: 'absolute',
        right: 12,
        height: 24,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
