import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

interface ComparisonCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  mainValue: string;
  changeIcon?: ReactNode;
  changeText?: string;
  changeColor?: string;
  footerText?: string;
  footerSecondaryText?: string;
  children?: ReactNode;
}

export const ComparisonCard = ({
  icon,
  title,
  subtitle,
  mainValue,
  changeIcon,
  changeText,
  changeColor,
  footerText,
  footerSecondaryText,
  children,
}: ComparisonCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <Text style={styles.mainValue}>{mainValue}</Text>

      {changeIcon && changeText && (
        <View style={[styles.changeRow, { backgroundColor: changeColor ? `${changeColor}15` : 'transparent' }]}>
          {changeIcon}
          <Text style={[styles.changeText, { color: changeColor }]}>{changeText}</Text>
        </View>
      )}

      {(footerText || footerSecondaryText) && (
        <View style={styles.footer}>
          {footerText && <Text style={styles.footerText}>{footerText}</Text>}
          {footerSecondaryText && <Text style={styles.footerSecondary}>{footerSecondaryText}</Text>}
        </View>
      )}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  mainValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary.dark,
    marginBottom: 8,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    gap: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
  },
  footerText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  footerSecondary: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
});
