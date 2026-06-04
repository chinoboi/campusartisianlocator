import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, radius, alpha } from '../../theme';

type Props = {
  children: React.ReactNode;
  style?: any;
};

export function Card({ children, style }: Props) {
  return (
    <View style={[styles.card, style]} accessible accessibilityRole="summary">
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: alpha(colors.text, 0.06),
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
});

export default Card;
