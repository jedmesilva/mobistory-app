import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Search,
  Car,
  Home,
  MessageCircle,
} from 'lucide-react-native';
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

export default function FeedScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const navBottomTranslateY = useRef(new Animated.Value(0)).current;
  const fabScale = useRef(new Animated.Value(1)).current;

  const posts: Post[] = [
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
    {
      id: 4,
      type: 'image',
      userName: 'Marina Santos',
      userRole: 'Condutora',
      date: '20 Set, 09:00',
      caption: 'Calibragem de pneus finalizada! Conforto garantido nas estradas.',
      likes: 8,
      comments: 1,
      following: false,
      tags: [
        { icon: 'odometer', label: 'Quilometragem', value: '43.850 km' },
      ],
    },
    {
      id: 5,
      type: 'image',
      userName: 'Carlos Silva',
      userRole: 'Condutor',
      date: '15 Set, 08:00',
      caption: 'Revisão programada chegando! Vou deixar tudo checado.',
      likes: 15,
      comments: 4,
      following: false,
      tags: [
        { icon: 'odometer', label: 'Quilometragem', value: '43.550 km' },
        { icon: 'fuel', label: 'Combustível', value: '75%' },
      ],
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;

    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    const distanceFromBottom = contentHeight - (currentScrollY + layoutHeight);
    const distanceFromTop = currentScrollY;

    const isNearTop = distanceFromTop < 100;
    const isNearBottom = distanceFromBottom < 100;
    const isScrollingDown = scrollDiff > 0;

    // Animar header
    if (isNearTop || isNearBottom) {
      Animated.spring(headerTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    } else if (isScrollingDown) {
      Animated.spring(headerTranslateY, {
        toValue: -88,
        useNativeDriver: true,
        friction: 8,
      }).start();
    } else {
      Animated.spring(headerTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }

    // Animar nav bottom
    if (isNearTop || isNearBottom) {
      Animated.spring(navBottomTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    } else if (isScrollingDown) {
      Animated.spring(navBottomTranslateY, {
        toValue: 72,
        useNativeDriver: true,
        friction: 8,
      }).start();
    } else {
      Animated.spring(navBottomTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }

    // Animar FAB
    if (isNearTop || isNearBottom) {
      Animated.spring(fabScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }).start();
    } else {
      Animated.spring(fabScale, {
        toValue: isScrollingDown ? 0 : 1,
        useNativeDriver: true,
        friction: 6,
      }).start();
    }

    lastScrollY.current = currentScrollY;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.headerButton}>
              <Car size={20} color={Colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => console.log('Abrir busca')}
            >
              <Search size={20} color={Colors.text.tertiary} />
              <Text style={styles.searchPlaceholder}>Buscar...</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerButton}>
              <MessageCircle size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Conteúdo */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de Introdução */}
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Momentos Mobistory</Text>
          <Text style={styles.introDescription}>
            Compartilhe os momentos com seu veículo e deixe-os eternizados na história.
          </Text>
        </View>

        {/* Posts */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ScrollView>

      {/* Botão Flutuante */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            transform: [{ scale: fabScale }],
            opacity: fabScale,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={() => console.log('Novo evento')}
        >
          <Car size={24} color={Colors.background.primary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Nav Bottom */}
      <Animated.View
        style={[
          styles.navBottom,
          { transform: [{ translateY: navBottomTranslateY }] },
        ]}
      >
        <SafeAreaView edges={['bottom']}>
          <View style={styles.navContent}>
            <TouchableOpacity
              onPress={() => setActiveTab('home')}
              style={styles.navButton}
            >
              <Home
                size={24}
                color={
                  activeTab === 'home'
                    ? Colors.text.primary
                    : Colors.text.tertiary
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveTab('profile');
                router.push('/');
              }}
              style={styles.navButton}
            >
              <Car
                size={24}
                color={
                  activeTab === 'profile'
                    ? Colors.text.primary
                    : Colors.text.tertiary
                }
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerButton: {
    padding: 10,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120,
    paddingBottom: 120,
  },
  intro: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  introDescription: {
    fontSize: 14,
    color: Colors.text.tertiary,
    lineHeight: 20,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 88,
    right: 16,
    zIndex: 20,
  },
  fab: {
    width: 56,
    height: 56,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
    zIndex: 10,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
