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
        <View style={styles.iconBox}>{icon}</View>
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.values}>
        <Text style={styles.mainValue}>{mainValue}</Text>
        {changeIcon && changeText && (
          <View style={[styles.changeRow, { color: changeColor }]}>
            {changeIcon}
            <Text style={[styles.changeText, { color: changeColor }]}>{changeText}</Text>
          </View>
        )}
      </View>

      {(footerText || footerSecondaryText) && (
        <View style={styles.footer}>
          {footerText && <Text style={styles.footerText}>{footerText}</Text>}
          {footerSecondaryText && <Text style={styles.footerText}>{footerSecondaryText}</Text>}
        </View>
      )}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    padding: 20,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary.dark,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  values: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  mainValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.dark,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
});
