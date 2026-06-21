import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getHumorPorId } from '../constants/humores';

// Componente reutilizável: renderiza o emoji do humor dentro de um círculo.
// Usado em: CardHumor (lista), SeletorHumor (formulário) e TelaDetalhes.
// O tamanho é configurável via prop `tamanho` para os diferentes contextos.
export default function IconeHumor({ humorId, tamanho = 36 }) {
  const humor = getHumorPorId(humorId);

  return (
    <View
      style={[
        styles.circulo,
        {
          width: tamanho,
          height: tamanho,
          borderRadius: tamanho / 2,
        },
      ]}
    >
      <Text style={{ fontSize: tamanho * 0.5 }}>
        {humor ? humor.emoji : '❓'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: {
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
