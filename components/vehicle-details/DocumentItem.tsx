import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, Eye, Download } from 'lucide-react-native';

export interface Document {
  id: number;
  name: string;
  type: string;
  fileType: string;
  size: string;
  uploadDate: string;
  url: string;
}

interface DocumentItemProps {
  document: Document;
  onView?: (document: Document) => void;
  onDownload?: (document: Document) => void;
}

export const DocumentItem = ({ document, onView, onDownload }: DocumentItemProps) => {
  return (
    <View style={styles.documentItem}>
      <View style={styles.documentLeft}>
        <View style={styles.documentIcon}>
          <FileText size={20} color="#374151" />
        </View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentName} numberOfLines={1}>
            {document.name}
          </Text>
          <View style={styles.documentMeta}>
            <Text style={styles.documentMetaText}>{document.fileType}</Text>
            <Text style={styles.documentMetaText}>•</Text>
            <Text style={styles.documentMetaText}>{document.size}</Text>
            <Text style={styles.documentMetaText}>•</Text>
            <Text style={styles.documentMetaText}>{document.uploadDate}</Text>
          </View>
        </View>
      </View>
      <View style={styles.documentActions}>
        <TouchableOpacity
          style={styles.documentActionButton}
          onPress={() => onView?.(document)}
        >
          <Eye size={16} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.documentActionButton}
          onPress={() => onDownload?.(document)}
        >
          <Download size={16} color="#4b5563" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  documentItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  documentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  documentIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  documentMetaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  documentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  documentActionButton: {
    width: 32,
    height: 32,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
