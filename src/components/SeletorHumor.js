import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HUMORES } from '../constants/humores';

// Componente reutilizável: grade de opções de humor usada na TelaFormulario.
// Recebe o humor atualmente selecionado e uma função para atualizá-lo.
export default function SeletorHumor({ humorSelecionado, onSelecionar, erro }) {
  return (
    <View>
      <View style={styles.grade}>
        {HUMORES.map((humor) => {
          const selecionado = humor.id === humorSelecionado;
          return (
            <TouchableOpacity
              key={humor.id}
              style={[
                styles.opcao,
                selecionado && styles.opcaoSelecionada,
              ]}
              onPress={() => onSelecionar(humor.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{humor.emoji}</Text>
              <Text style={styles.label}>{humor.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {erro ? <Text style={styles.textoErro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcao: {
    width: '30%',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    alignItems: 'center',
  },
  opcaoSelecionada: {
    borderColor: '#1A1A1A',
    borderWidth: 2,
    backgroundColor: '#F5F5F5',
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontSize: 11,
    color: '#555555',
    marginTop: 4,
  },
  textoErro: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 6,
  },
});
