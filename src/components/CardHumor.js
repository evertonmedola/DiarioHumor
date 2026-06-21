import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import IconeHumor from './IconeHumor';
import { getHumorPorId } from '../constants/humores';

// Componente reutilizável: representa um item da lista na TelaListagem.
// Recebe o registro completo e uma função de callback ao ser tocado.
export default function CardHumor({ registro, onPress }) {
  const humor = getHumorPorId(registro.humor);

  // Formata 'YYYY-MM-DD' para 'DD/MM/AAAA' sem depender de libs externas de data
  const dataFormatada = formatarData(registro.data);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <IconeHumor humorId={registro.humor} tamanho={36} />
      <View style={styles.info}>
        <Text style={styles.data}>{dataFormatada}</Text>
        <Text style={styles.preview} numberOfLines={1}>
          {registro.nota ? registro.nota : `Sem nota · ${humor?.label || ''}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function formatarData(dataIso) {
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    marginBottom: 8,
  },
  info: {
    flex: 1,
  },
  data: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  preview: {
    fontSize: 13,
    color: '#777777',
    marginTop: 2,
  },
});
