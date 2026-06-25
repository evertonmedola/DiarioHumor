import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getHumorPorId } from '../constants/humores';

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// Monta o grid de um mês: cada posição é um dia (1..N) ou null
// (espaço vazio antes do dia 1 / depois do último dia), para alinhar
// corretamente com a coluna do dia da semana correspondente.
function montarGrid(ano, mes) {
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay(); // 0 = domingo
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  const celulas = [];
  for (let i = 0; i < primeiroDiaSemana; i++) {
    celulas.push(null);
  }
  for (let dia = 1; dia <= totalDias; dia++) {
    celulas.push(dia);
  }
  while (celulas.length % 7 !== 0) {
    celulas.push(null);
  }
  return celulas;
}

function paraIso(ano, mes, dia) {
  const mesStr = String(mes + 1).padStart(2, '0');
  const diaStr = String(dia).padStart(2, '0');
  return `${ano}-${mesStr}-${diaStr}`;
}

export default function CalendarioMensal({
  ano,
  mes,
  registrosDoMes,
  diaSelecionado,
  onSelecionarDia,
}) {
  const grid = useMemo(() => montarGrid(ano, mes), [ano, mes]);

  // Mapa rápido: 'YYYY-MM-DD' -> registro, para não fazer .find() a cada célula
  const registrosPorData = useMemo(() => {
    const mapa = {};
    registrosDoMes.forEach((registro) => {
      mapa[registro.data] = registro;
    });
    return mapa;
  }, [registrosDoMes]);

  const hojeIso = paraIso(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  return (
    <View style={styles.container}>
      <View style={styles.linhaCabecalho}>
        {DIAS_SEMANA.map((letra, indice) => (
          <Text key={indice} style={styles.textoCabecalho}>
            {letra}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((dia, indice) => {
          if (dia === null) {
            return <View key={indice} style={styles.celula} />;
          }

          const dataIso = paraIso(ano, mes, dia);
          const registro = registrosPorData[dataIso];
          const humor = registro ? getHumorPorId(registro.humor) : null;
          const selecionado = dataIso === diaSelecionado;
          const ehHoje = dataIso === hojeIso;

          return (
            <TouchableOpacity
              key={indice}
              style={[
                styles.celula,
                selecionado && styles.celulaSelecionada,
              ]}
              onPress={() => onSelecionarDia(dataIso)}
            >
              <Text
                style={[styles.numeroDia, ehHoje && styles.numeroDiaHoje]}
              >
                {dia}
              </Text>
              <Text style={styles.emojiDia}>{humor ? humor.emoji : ''}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  linhaCabecalho: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  textoCabecalho: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: '#999999',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  celula: {
    width: '14.28%',
    aspectRatio: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  celulaSelecionada: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  numeroDia: {
    fontSize: 12,
    color: '#444444',
  },
  numeroDiaHoje: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  emojiDia: {
    fontSize: 14,
    height: 16,
  },
});