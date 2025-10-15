import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, X, Search } from 'lucide-react-native';
import { Colors } from '@/constants';
import { PostCard } from '../../components/feed';

interface Post {
  id: number;
  type: 'image' | 'video';
  userName: string;
  userRole: string;
  date: string;
  caption?: string;
  likes: number;
  comments: number;
  following: boolean;
  tags?: Array<{
    icon: 'odometer' | 'fuel' | 'userCheck';
    label: string;
    value: string;
  }>;
}

export default function FeedSearchScreen() {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Abastecimento',
    'Manutenção preventiva',
    'Honda Civic',
    'Troca de óleo',
  ]);

  // Foca no input assim que a tela carregar
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Posts mockados (mesmos do feed)
  const allPosts: Post[] = [
    {
      id: 1,
      type: 'image',
      userName: 'Carlos Silva',
      userRole: 'Condutor',
      date: '30 Set, 14:30',
      caption: 'Manhã de domingo com meu querido Civic! 🌅 Rodão impecável!',
      likes: 24,
      comments: 3,
      following: false,
      tags: [
        { icon: 'odometer', label: 'Quilometragem', value: '45.230 km' },
        { icon: 'fuel', label: 'Combustível', value: '60%' },
        { icon: 'userCheck', label: 'Vínculo', value: 'Condutor' },
      ],
    },
    {
      id: 2,
      type: 'image',
      userName: 'Ana Costa',
      userRole: 'Proprietária',
      date: '28 Set, 10:15',
      caption: 'Dia de manutenção preventiva! Carro sempre caprichado.',
      likes: 18,
      comments: 5,
      following: true,
      tags: [
        { icon: 'odometer', label: 'Quilometragem', value: '44.690 km' },
        { icon: 'fuel', label: 'Combustível', value: '45%' },
      ],
    },
    {
      id: 3,
      type: 'video',
      userName: 'João Pereira',
      userRole: 'Proprietário',
      date: '25 Set, 18:40',
      caption: 'Abasteci no caminho pro trabalho. Consumo está ótimo!',
      likes: 12,
      comments: 2,
      following: false,
      tags: [
        { icon: 'odometer', label: 'Quilometragem', value: '44.120 km' },
        { icon: 'fuel', label: 'Combustível', value: 'Completo' },
        { icon: 'userCheck', label: 'Vínculo', value: 'Proprietário' },
      ],
    },
  ];

  // Filtra posts baseado na busca
  const filteredPosts = searchQuery.trim()
    ? allPosts.filter((post) => {
        const query = searchQuery.toLowerCase();
        return (
          post.caption?.toLowerCase().includes(query) ||
          post.userName.toLowerCase().includes(query) ||
          post.tags?.some((tag) =>
            tag.label.toLowerCase().includes(query) ||
            tag.value.toLowerCase().includes(query)
          )
        );
      })
    : [];

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleRemoveRecentSearch = (search: string) => {
    setRecentSearches(recentSearches.filter((s) => s !== search));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Header com Input */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text.secondary} />
        </TouchableOpacity>

        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.text.tertiary} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Buscar no feed..."
            placeholderTextColor={Colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <X size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Buscas Recentes - Só aparece quando não está buscando */}
        {!searchQuery.trim() && recentSearches.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Buscas recentes</Text>
            </View>
            <View style={styles.recentList}>
              {recentSearches.map((search, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.recentItem,
                    pressed && styles.recentItemPressed,
                  ]}
                  onPress={() => handleRecentSearchPress(search)}
                >
                  <Clock size={18} color={Colors.text.tertiary} />
                  <Text style={styles.recentText}>{search}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveRecentSearch(search)}
                    style={styles.removeButton}
                  >
                    <X size={16} color={Colors.text.tertiary} />
                  </TouchableOpacity>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Resultados da Busca */}
        {searchQuery.trim() && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              {filteredPosts.length === 0
                ? 'Nenhum resultado encontrado'
                : `${filteredPosts.length} ${filteredPosts.length === 1 ? 'resultado' : 'resultados'}`}
            </Text>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </View>
        )}

        {/* Estado Vazio - Quando não está buscando e não tem histórico */}
        {!searchQuery.trim() && recentSearches.length === 0 && (
          <View style={styles.emptyState}>
            <Search size={48} color={Colors.text.placeholder} />
            <Text style={styles.emptyTitle}>Busque no feed</Text>
            <Text style={styles.emptyDescription}>
              Encontre posts por usuário, veículo, tipo de atividade ou palavras-chave
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    height: 40,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  recentSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  recentHeader: {
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  recentList: {
    gap: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  recentItemPressed: {
    transform: [{ scale: 0.98 }],
  },
  recentText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  removeButton: {
    padding: 4,
  },
  resultsSection: {
    paddingHorizontal: 16,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.tertiary,
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
