import React, { useState, useRef, useCallback, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants';
import { PostCard, FeedHeader, FeedNavBottom, FeedFAB } from '../../components/feed';
import { NewUpdateModal } from '../../components/ui';
import { useMoments } from '@/hooks/moment';

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
  const [showNewUpdateModal, setShowNewUpdateModal] = useState(false);
  const { moments, loading} = useMoments();

  const [headerHeight, setHeaderHeight] = useState(0);
  const [navBottomHeight, setNavBottomHeight] = useState(0);

  // Valores animados controlados manualmente
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const navBottomTranslateY = useRef(new Animated.Value(0)).current;
  const navBottomOpacity = useRef(new Animated.Value(1)).current;
  const fabScale = useRef(new Animated.Value(1)).current;

  // Transform moments data to posts format
  const posts: Post[] = useMemo(() => moments.map((moment) => {
    const activePlate = moment.vehicles.plates?.find(p => p.active) || moment.vehicles.plates?.[0];
    const activeColor = moment.vehicles.colors?.find(c => c.active) || moment.vehicles.colors?.[0];
    const vehicleName = `${moment.vehicles.brands.brand} ${moment.vehicles.models.model}`;
    const primaryVehicleImage = moment.vehicles.vehicle_images?.find(img => img.is_primary) || moment.vehicles.vehicle_images?.[0];

    return {
      id: parseInt(moment.id.slice(0, 8), 16), // Convert UUID to number
      type: moment.type as 'image' | 'video',
      userName: moment.entities.name,
      userRole: 'Condutor', // TODO: Get from relationship type
      vehicleId: moment.vehicles.id,
      vehicleName,
      vehiclePlate: activePlate?.plate || '',
      vehicleColor: activeColor?.color || '',
      vehicleImageUrl: primaryVehicleImage?.image_url,
      date: new Date(moment.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      caption: moment.caption || '',
      imageUrl: moment.moment_images[0]?.image_url,
      likes: moment.moment_reactions.length,
      comments: moment.moment_comments.length,
      following: false,
      tags: moment.tags as any || [],
    };
  }), [moments]);

  // Keep old mock data as fallback
  const mockPosts: Post[] = useMemo(() => [
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
  ], []);

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

  const handleTabChange = useCallback((tab: 'home' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'profile') {
      router.push('/vehicle/linked');
    }
  }, [router]);

  const handleSearchPress = useCallback(() => {
    router.push('/feed/search');
  }, [router]);

  const handleVehiclePress = useCallback(() => {
    router.push({
      pathname: '/vehicles-link-list',
      params: { from: 'feed' }
    });
  }, [router]);

  const handleMessagePress = useCallback(() => {
    router.push('/conversations');
  }, [router]);

  const handleNewUpdatePress = useCallback(() => {
    setShowNewUpdateModal(true);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <FeedHeader
        translateY={headerTranslateY}
        opacity={headerOpacity}
        onSearchPress={handleSearchPress}
        onVehiclePress={handleVehiclePress}
        onMessagePress={handleMessagePress}
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

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
            <Text style={styles.loadingText}>Carregando momentos...</Text>
          </View>
        )}

        {/* Posts */}
        {!loading && posts.length > 0 && posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhum momento publicado ainda.</Text>
            <Text style={styles.emptyStateSubtext}>Seja o primeiro a compartilhar!</Text>
          </View>
        )}
      </Animated.ScrollView>

      {/* Botão Flutuante */}
      <FeedFAB
        scale={fabScale}
        onPress={handleNewUpdatePress}
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

      <NewUpdateModal
        visible={showNewUpdateModal}
        onClose={() => setShowNewUpdateModal(false)}
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
});
