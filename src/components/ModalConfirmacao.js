import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Modal de confirmação próprio, em vez de Alert.alert.
// Motivo: Alert.alert do React Native não tem efeito visível no Expo Web
// (não lança popup nenhum), então qualquer confirmação de exclusão
// silenciosamente não fazia nada ao testar no navegador. Esse componente
// funciona igual em Web, iOS e Android.
export default function ModalConfirmacao({
  visivel,
  titulo,
  mensagem,
  onCancelar,
  onConfirmar,
}) {
  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onCancelar}
    >
      <View style={styles.fundo}>
        <View style={styles.caixa}>
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.mensagem}>{mensagem}</Text>

          <View style={styles.linhaBotoes}>
            <TouchableOpacity style={styles.botaoCancelar} onPress={onCancelar}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoConfirmar} onPress={onConfirmar}>
              <Text style={styles.textoConfirmar}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  caixa: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  mensagem: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 19,
    marginBottom: 20,
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: 10,
  },
  botaoCancelar: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCancelar: {
    fontSize: 14,
    color: '#444444',
    fontWeight: '500',
  },
  botaoConfirmar: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoConfirmar: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
