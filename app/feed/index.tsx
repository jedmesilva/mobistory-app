import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants';
import { PostCard, FeedHeader, FeedNavBottom, FeedFAB } from '../../components/feed';

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

const HEADER_HEIGHT = 120;
const NAV_BOTTOM_HEIGHT = 100;
const SCROLL_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 0.5; // Velocidade mínima para esconder (ajustável)

export default function FeedScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');

  const [headerHeight, setHeaderHeight] = useState(0);
  const [navBottomHeight, setNavBottomHeight] = useState(0);

  // Valores animados controlados manualmente
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const navBottomTranslateY = useRef(new Animated.Value(0)).current;
  const navBottomOpacity = useRef(new Animated.Value(1)).current;
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

  // Função para mostrar todos os elementos
  const showAllElements = () => {
    Animated.parallel([
      Animated.spring(headerTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(navBottomTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(navBottomOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(fabScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }),
    ]).start();
  };

  // Função para esconder todos os elementos
  const hideAllElements = () => {
    const headerTranslate = headerHeight > 0 ? -headerHeight : -HEADER_HEIGHT;
    const navTranslate = navBottomHeight > 0 ? navBottomHeight : NAV_BOTTOM_HEIGHT;

    Animated.parallel([
      Animated.spring(headerTranslateY, {
        toValue: headerTranslate,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(headerOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(navBottomTranslateY, {
        toValue: navTranslate,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(navBottomOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(fabScale, {
        toValue: 0,
        useNativeDriver: true,
        friction: 6,
      }),
    ]).start();
  };

  // Lógica baseada em velocidade E detecção de limites
  const handleScrollEndDrag = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const velocity = event.nativeEvent.velocity?.y || 0;

    // Detecta se chegou no TOPO (contentOffset.y ≈ 0)
    const isAtTop = contentOffset.y <= 10;

    // Detecta se chegou no FIM (contentOffset.y + altura visível ≈ altura total)
    const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 10;

    // Se chegou no topo OU no fim → SEMPRE MOSTRA
    if (isAtTop || isAtBottom) {
      showAllElements();
      return;
    }

    // Scroll rápido para CIMA (velocity < -threshold) → ESCONDE
    if (velocity < -VELOCITY_THRESHOLD) {
      hideAllElements();
    }
    // Qualquer scroll para BAIXO (velocity > 0) → MOSTRA
    else if (velocity > 0) {
      showAllElements();
    }
  };

  const handleTabChange = (tab: 'home' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'profile') {
      router.push('/vehicle-profile');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <FeedHeader
        translateY={headerTranslateY}
        opacity={headerOpacity}
        onSearchPress={() => router.push('/feed/search')}
        onVehiclePress={() => router.push('/vehicles-link-list')}
        onMessagePress={() => router.push('/conversations')}
        onLayout={setHeaderHeight}
      />

      {/* Conteúdo */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleScrollEndDrag}
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
      </Animated.ScrollView>

      {/* Botão Flutuante */}
      <FeedFAB
        scale={fabScale}
        onPress={() => router.push('/new-update')}
        navBottomHeight={navBottomHeight}
      />

      {/* Nav Bottom */}
      <FeedNavBottom
        translateY={navBottomTranslateY}
        opacity={navBottomOpacity}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLayout={setNavBottomHeight}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
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
});
