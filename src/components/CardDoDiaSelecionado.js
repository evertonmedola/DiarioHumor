import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import IconeHumor from './IconeHumor';
import { getHumorPorId } from '../constants/humores';

// Mostra o registro do dia selecionado no CalendarioMensal.
// Se não houver registro nesse dia, mostra um convite para criar um novo.
export default function CardDoDiaSelecionado({
  dataIso,
  registro,
  onPress,
}) {
  const dataFormatada = formatarDataExtensa(dataIso);

  if (!registro) {
    return (
      <TouchableOpacity style={styles.cardVazio} onPress={onPress}>
        <Text style={styles.dataVazia}>{dataFormatada}</Text>
        <Text style={styles.textoVazio}>
          Nenhum registro neste dia. Toque para adicionar.
        </Text>
      </TouchableOpacity>
    );
  }

  const humor = getHumorPorId(registro.humor);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <IconeHumor humorId={registro.humor} tamanho={40} />
      <View style={styles.info}>
        <View style={styles.linhaTopo}>
          <Text style={styles.data}>{dataFormatada}</Text>
          <Text style={styles.humorLabel}>{humor?.label}</Text>
        </View>
        <Text style={styles.nota} numberOfLines={2}>
          {registro.nota || 'Sem nota'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function formatarDataExtensa(dataIso) {
  const [ano, mes, dia] = dataIso.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  const nomesMeses = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez',
  ];
  return `${dia} de ${nomesMeses[mes - 1]} de ${ano}`;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
  },
  info: {
    flex: 1,
  },
  linhaTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  data: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  humorLabel: {
    fontSize: 12,
    color: '#777777',
  },
  nota: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
  },
  cardVazio: {
    padding: 14,
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderStyle: 'dashed',
  },
  dataVazia: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  textoVazio: {
    fontSize: 13,
    color: '#999999',
    marginTop: 4,
  },
});