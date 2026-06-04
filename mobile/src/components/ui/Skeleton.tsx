import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, alpha, radius } from '../../theme';

type Props = { style?: any };

export function Skeleton({ style }: Props) {
  return <View style={[styles.block, style]} />;
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: alpha(colors.text, 0.06),
    borderRadius: radius.sm,
  },
});

export default Skeleton;
