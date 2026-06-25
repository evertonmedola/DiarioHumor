import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HUMORES } from '../constants/humores';

// Gráfico de barras feito com View/flexbox, sem depender de lib externa
// de gráficos. Decisão tomada após o react-native-chart-kit renderizar mal
// no Expo Web (eixos cortados, barras desproporcionais). Essa abordagem
// funciona de forma idêntica em Web, iOS e Android, e é mais fácil de
// explicar na defesa oral, já que cada peça do gráfico é só uma View
// com altura calculada em porcentagem.
const ALTURA_MAXIMA_BARRA = 56; // em pixels (compacto, para conviver com o calendário na mesma tela)

export default function GraficoMensal({ registrosDoMes }) {
  const contagens = useMemo(() => {
    return HUMORES.map((humor) => ({
      ...humor,
      total: registrosDoMes.filter((r) => r.humor === humor.id).length,
    }));
  }, [registrosDoMes]);

  const maiorContagem = Math.max(1, ...contagens.map((h) => h.total));

  if (registrosDoMes.length === 0) {
    return (
      <View style={styles.vazio}>
        <Text style={styles.textoVazio}>Nenhum registro neste mês ainda.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.areaBarras}>
        {contagens.map((humor) => {
          const alturaBarra = Math.max(
            4,
            (humor.total / maiorContagem) * ALTURA_MAXIMA_BARRA
          );
          return (
            <View key={humor.id} style={styles.colunaBarra}>
              <Text style={styles.valorBarra}>
                {humor.total > 0 ? humor.total : ''}
              </Text>
              <View
                style={[
                  styles.barra,
                  {
                    height: alturaBarra,
                    backgroundColor: humor.total > 0 ? humor.cor : '#EEEEEE',
                  },
                ]}
              />
              <Text style={styles.emojiBarra}>{humor.emoji}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  areaBarras: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: ALTURA_MAXIMA_BARRA + 44,
  },
  colunaBarra: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  valorBarra: {
    fontSize: 11,
    color: '#777777',
    marginBottom: 4,
    height: 14,
  },
  barra: {
    width: 22,
    borderRadius: 6,
  },
  emojiBarra: {
    fontSize: 16,
    marginTop: 6,
  },
  vazio: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoVazio: {
    fontSize: 13,
    color: '#999999',
  },
});
