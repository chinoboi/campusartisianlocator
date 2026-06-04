import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, spacing, radius } from '../../theme';

type Props = TextInputProps & {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  compact?: boolean;
  accessibilityLabel?: string;
};

export function Input({ value, onChangeText, placeholder, label, multiline, accessibilityLabel, compact, ...rest }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[
          styles.input,
          multiline ? (compact ? styles.multilineCompact : styles.multiline) : null,
          compact && !multiline ? styles.compact : null,
          focused && styles.focused,
        ]}
        multiline={multiline}
        placeholderTextColor={colors.muted}
        accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.muted,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
  },
  focused: {
    borderColor: colors.primaryDark,
    borderWidth: 2,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  compact: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    minHeight: 36,
    fontSize: 13,
  },
  multilineCompact: {
    minHeight: 44,
    textAlignVertical: 'top',
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
    fontSize: 13,
  },
});

export default Input;
