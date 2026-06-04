import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radius, typography, alpha } from '../../theme';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function Button({ title, onPress, variant = 'primary', disabled, accessibilityLabel, style }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
          styles.base,
          variant === 'primary' && styles.primary,
          variant === 'outline' && styles.outline,
          pressed && styles.pressed,
          disabled && styles.disabled,
          focused && styles.focused,
          style,
        ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <Text style={[styles.text, variant === 'outline' && styles.textOutline]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: alpha(colors.text, 0.12),
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.5,
  },
  focused: {
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: typography.body,
  },
  textOutline: {
    color: colors.primaryDark,
  },
});

export default Button;
