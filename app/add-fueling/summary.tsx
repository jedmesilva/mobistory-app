import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { useRouter } from 'expo-router';
import {
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Fuel,
  Activity,
} from 'lucide-react-native';
import {
  ComparisonCard,
  InsightsBox,
  ConsumptionAnalysisCard,
} from '@/components/add-fueling';

export default function SummaryScreen() {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  const currentFueling = {
    date: '2025-09-19',
    km: 89950,
    station: {
      name: 'Shell Select',
      brand: 'Shell',
      address: 'Av. Paulista, 1500 - Bela Vista',
    },
    fuels: [
      { type: 'Gasolina Comum', liters: 42.5, pricePerLiter: 5.49, totalPrice: 233.32 },
      { type: 'Etanol', liters: 5.0, pricePerLiter: 3.89, totalPrice: 19.45 },
    ],
    totalLiters: 47.5,
    totalValue: 252.77,
  };

  const previousFueling = {
    date: '2025-09-10',
    km: 88920,
    station: {
      name: 'Petrobras',
      brand: 'Petrobras',
      address: 'R. Augusta, 800 - Consolação',
    },
    fuels: [{ type: 'Gasolina Comum', liters: 38.5, pricePerLiter: 5.42, totalPrice: 208.67 }],
    totalLiters: 38.5,
    totalValue: 208.67,
  };

  const distanceTraveled = currentFueling.km - previousFueling.km;
  const daysBetween = Math.floor((new Date(currentFueling.date).getTime() - new Date(previousFueling.date).getTime()) / (1000 * 60 * 60 * 24));
  const consumption = (distanceTraveled / previousFueling.totalLiters).toFixed(1);
  const avgDailyKm = Math.round(distanceTraveled / daysBetween);

  const priceComparison = currentFueling.fuels[0].pricePerLiter - previousFueling.fuels[0].pricePerLiter;
  const priceChange = ((priceComparison / previousFueling.fuels[0].pricePerLiter) * 100).toFixed(1);

  const valueComparison = currentFueling.totalValue - previousFueling.totalValue;
  const valuePercentChange = ((valueComparison / previousFueling.totalValue) * 100).toFixed(1);

  const getConsumptionStatus = () => {
    const consumptionValue = parseFloat(consumption);
    if (consumptionValue >= 12) return { status: 'excellent', label: 'Excelente', message: 'Parabéns! Seu veículo está com consumo excelente. Continue dirigindo de forma econômica.' };
    if (consumptionValue >= 10) return { status: 'good', label: 'Bom', message: 'Bom consumo! Seu veículo está dentro da média esperada para o modelo.' };
    if (consumptionValue >= 8) return { status: 'average', label: 'Médio', message: 'Consumo médio. Considere revisar hábitos de direção e manutenção do veículo.' };
    return { status: 'low', label: 'Baixo', message: 'Consumo abaixo do esperado. Recomendamos verificar a manutenção do veículo.' };
  };

  const consumptionStatus = getConsumptionStatus();

  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  const getChangeIcon = (value: number) => {
    if (value > 0) return <TrendingUp size={16} />;
    if (value < 0) return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  const getChangeColor = (value: number, invert = false) => {
    if (value > 0) return invert ? Colors.error.dark : '#16a34a';
    if (value < 0) return invert ? '#16a34a' : Colors.error.dark;
    return Colors.text.tertiary;
  };

  const handleComplete = () => {
    router.replace('/fuel-history/1');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Resumo do Abastecimento</Text>
            <Text style={styles.subtitle}>Comparativo com abastecimento anterior</Text>
          </View>
          {/* Main Summary */}
          <View style={styles.mainSummaryCard}>
            <View style={styles.mainSummary}>
              <Text style={styles.mainValue}>{formatCurrency(currentFueling.totalValue)}</Text>
              <Text style={styles.mainLabel}>
                {currentFueling.totalLiters.toFixed(1)} litros • {currentFueling.station.name}
              </Text>
              <Text style={styles.dateText}>
                {new Date(currentFueling.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  weekday: 'long',
                })}
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{distanceTraveled.toLocaleString('pt-BR')}</Text>
                <Text style={styles.statLabel}>km rodados</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{daysBetween}</Text>
                <Text style={styles.statLabel}>dias</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{avgDailyKm}</Text>
                <Text style={styles.statLabel}>km/dia</Text>
              </View>
            </View>
          </View>

          {/* Consumption Analysis */}
          <View style={styles.consumptionCard}>
            <Text style={styles.consumptionTitle}>Consumo: {consumption} km/L</Text>
            <Text style={styles.consumptionStatus}>{consumptionStatus.label}</Text>
            <Text style={styles.consumptionMessage}>{consumptionStatus.message}</Text>
          </View>

          {/* Comparisons */}
          <Text style={styles.sectionTitle}>Comparativo</Text>

          {/* Price Comparison */}
          <ComparisonCard
            icon={<TrendingUp size={20} color={Colors.text.secondary} />}
            title="Preço do Combustível"
            subtitle="Gasolina Comum - comparação"
            mainValue={`${formatCurrency(currentFueling.fuels[0].pricePerLiter)}/L`}
            changeIcon={React.cloneElement(getChangeIcon(priceComparison), { color: getChangeColor(priceComparison, true) })}
            changeText={
              priceComparison === 0
                ? 'Sem alteração'
                : `${priceComparison > 0 ? '+' : ''}${formatCurrency(Math.abs(priceComparison))} (${priceChange}%)`
            }
            changeColor={getChangeColor(priceComparison, true)}
            footerText={`Anterior: ${formatCurrency(previousFueling.fuels[0].pricePerLiter)}/L`}
            footerSecondaryText={priceComparison > 0 ? 'Aumento no preço' : priceComparison < 0 ? 'Redução no preço' : 'Preço mantido'}
          />

          {/* Station Comparison */}
          <ComparisonCard
            icon={<MapPin size={20} color={Colors.text.secondary} />}
            title="Posto de Combustível"
            subtitle="Local do abastecimento"
            mainValue={currentFueling.station.name}
            changeText={
              currentFueling.station.name !== previousFueling.station.name ? 'Posto diferente' : 'Mesmo posto'
            }
            changeColor={currentFueling.station.name !== previousFueling.station.name ? Colors.info.DEFAULT : Colors.text.tertiary}
          >
            <View style={styles.stationComparison}>
              <View style={styles.stationRow}>
                <Text style={styles.footerLabel}>Atual:</Text>
                <Text style={styles.footerValue}>{currentFueling.station.name}</Text>
              </View>
              <View style={styles.stationRow}>
                <Text style={styles.footerLabel}>Anterior:</Text>
                <Text style={styles.footerValue}>{previousFueling.station.name}</Text>
              </View>
            </View>
            {currentFueling.station.name !== previousFueling.station.name && (
              <View style={styles.highlightBox}>
                <Text style={styles.highlightText}>Você mudou de posto. Isso pode explicar a diferença no preço do combustível.</Text>
              </View>
            )}
          </ComparisonCard>

          {/* Value Comparison */}
          <ComparisonCard
            icon={<Fuel size={20} color={Colors.text.secondary} />}
            title="Valor do Abastecimento"
            subtitle="Comparação de gastos"
            mainValue={formatCurrency(currentFueling.totalValue)}
            changeIcon={React.cloneElement(getChangeIcon(valueComparison), { color: getChangeColor(valueComparison, true) })}
            changeText={
              valueComparison === 0
                ? 'Mesmo valor'
                : `${valueComparison > 0 ? '+' : ''}${formatCurrency(Math.abs(valueComparison))} (${valuePercentChange}%)`
            }
            changeColor={getChangeColor(valueComparison, true)}
            footerText={`Anterior: ${formatCurrency(previousFueling.totalValue)}`}
            footerSecondaryText={valueComparison > 0 ? 'Gastou mais' : valueComparison < 0 ? 'Gastou menos' : 'Mesmo gasto'}
          />

          {/* Insights */}
          <InsightsBox title="Insights do Período">
            <InsightsBox.Item>
              Você rodou <Text style={styles.bold}>{distanceTraveled} km</Text> em <Text style={styles.bold}>{daysBetween} dias</Text>{' '}
              (média de <Text style={styles.bold}>{avgDailyKm} km/dia</Text>)
            </InsightsBox.Item>
            <InsightsBox.Item>
              Seu consumo de <Text style={styles.bold}>{consumption} km/L</Text> está{' '}
              {consumptionStatus.label.toLowerCase()} para o Honda Civic
            </InsightsBox.Item>
            {currentFueling.station.name !== previousFueling.station.name && (
              <InsightsBox.Item>
                Mudança de posto pode ter influenciado na diferença de preço (<Text style={styles.bold}>{priceChange}%</Text>)
              </InsightsBox.Item>
            )}
            <InsightsBox.Item>
              {valueComparison > 0 ? (
                <>
                  Gastou <Text style={styles.bold}>{formatCurrency(valueComparison)}</Text> a mais
                </>
              ) : valueComparison < 0 ? (
                <>
                  Economizou <Text style={styles.bold}>{formatCurrency(Math.abs(valueComparison))}</Text>
                </>
              ) : (
                <>Gastou o mesmo valor</>
              )}{' '}
              comparado ao abastecimento anterior
            </InsightsBox.Item>
          </InsightsBox>

          {/* Toggle Details */}
          <TouchableOpacity onPress={() => setShowDetails(!showDetails)} style={styles.detailsToggle}>
            <Text style={styles.detailsToggleText}>{showDetails ? 'Ocultar detalhes' : 'Ver detalhes completos'}</Text>
            <View style={[styles.chevron, showDetails && styles.chevronRotated]}>
              <TrendingUp size={16} color={Colors.text.tertiary} />
            </View>
          </TouchableOpacity>

          {showDetails && (
            <View style={styles.detailsSection}>
              <View style={styles.card}>
                <View style={styles.cardBody}>
                  <Text style={styles.detailsCardTitle}>Abastecimento Atual</Text>
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Data:</Text>
                      <Text style={styles.detailValue}>{new Date(currentFueling.date).toLocaleDateString('pt-BR')}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>KM:</Text>
                      <Text style={styles.detailValue}>{currentFueling.km.toLocaleString('pt-BR')} km</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Posto:</Text>
                      <Text style={styles.detailValue}>{currentFueling.station.name}</Text>
                    </View>
                    {currentFueling.fuels.map((fuel, index) => (
                      <View key={index} style={[styles.detailRow, styles.fuelDetail]}>
                        <Text style={styles.detailLabel}>{fuel.type}:</Text>
                        <Text style={styles.detailValue}>
                          {fuel.liters}L • {formatCurrency(fuel.pricePerLiter)}/L
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.card}>
                <View style={styles.cardBody}>
                  <Text style={styles.detailsCardTitle}>Abastecimento Anterior</Text>
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabelGray}>Data:</Text>
                      <Text style={styles.detailValueGray}>{new Date(previousFueling.date).toLocaleDateString('pt-BR')}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabelGray}>KM:</Text>
                      <Text style={styles.detailValueGray}>{previousFueling.km.toLocaleString('pt-BR')} km</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabelGray}>Posto:</Text>
                      <Text style={styles.detailValueGray}>{previousFueling.station.name}</Text>
                    </View>
                    {previousFueling.fuels.map((fuel, index) => (
                      <View key={index} style={[styles.detailRow, styles.fuelDetail]}>
                        <Text style={styles.detailLabelGray}>{fuel.type}:</Text>
                        <Text style={styles.detailValueGray}>
                          {fuel.liters}L • {formatCurrency(fuel.pricePerLiter)}/L
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <SafeAreaView style={styles.footerSafeArea} edges={['bottom']}>
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push('/add-fueling/fuel-input')} style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>Revisar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleComplete} style={styles.completeButton}>
            <Text style={styles.completeButtonText}>Concluir e Fechar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scrollView: { flex: 1 },
  content: { padding: 16, paddingTop: 24, paddingBottom: 100 },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  mainSummaryCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    padding: 24,
    marginBottom: 32,
  },
  mainSummary: { alignItems: 'center', marginBottom: 24 },
  mainValue: { fontSize: 36, fontWeight: '700', color: Colors.primary.dark, marginBottom: 8 },
  mainLabel: { fontSize: 14, color: Colors.text.secondary, marginBottom: 4 },
  dateText: { fontSize: 12, color: Colors.text.tertiary },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: Colors.primary.dark, marginBottom: 4 },
  statLabel: { fontSize: 12, color: Colors.text.tertiary },
  consumptionCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  consumptionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  consumptionStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success.text,
    marginBottom: 8,
  },
  consumptionMessage: {
    fontSize: 13,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.primary.dark, marginBottom: 12 },
  card: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    marginBottom: 24,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  fuelHeader: { backgroundColor: Colors.background.secondary },
  activityHeader: { backgroundColor: Colors.background.secondary },
  cardHeaderText: { fontSize: 14, fontWeight: '600', color: Colors.primary.dark },
  cardBody: { padding: 24 },
  stationComparison: { gap: 4, marginTop: 12 },
  stationRow: { flexDirection: 'row', justifyContent: 'space-between' },
  footerLabel: { fontSize: 12, color: Colors.text.tertiary },
  footerValue: { fontSize: 12, color: Colors.text.tertiary },
  highlightBox: { marginTop: 12, padding: 12, backgroundColor: '#eff6ff', borderRadius: 8 },
  highlightText: { fontSize: 12, color: Colors.info.text },
  bold: { fontWeight: '600' },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 16,
  },
  detailsToggleText: { fontSize: 14, fontWeight: '500', color: Colors.text.secondary },
  chevron: { transform: [{ rotate: '0deg' }] },
  chevronRotated: { transform: [{ rotate: '180deg' }] },
  detailsSection: { gap: 16 },
  detailsCardTitle: { fontSize: 16, fontWeight: '600', color: Colors.primary.dark, marginBottom: 16 },
  detailsGrid: { gap: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  fuelDetail: { paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.background.tertiary },
  detailLabel: { fontSize: 14, color: Colors.text.tertiary },
  detailValue: { fontSize: 14, fontWeight: '500', color: Colors.primary.dark },
  detailLabelGray: { fontSize: 14, color: Colors.text.placeholder },
  detailValueGray: { fontSize: 14, color: Colors.text.tertiary },
  footerSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
  },
  reviewButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 16,
    alignItems: 'center',
  },
  reviewButtonText: { fontSize: 16, fontWeight: '600', color: Colors.text.tertiary },
  completeButton: { flex: 1, paddingVertical: 16, backgroundColor: Colors.primary.DEFAULT, borderRadius: 16, alignItems: 'center' },
  completeButtonText: { fontSize: 16, fontWeight: '600', color: Colors.background.primary },
});
