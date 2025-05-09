import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card = ({ children, style, onPress }: CardProps) => {
  return (
    <PaperCard
      style={[styles.card, style]}
      onPress={onPress}
      mode="elevated"
    >
      <PaperCard.Content>
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF'
  }
}); 