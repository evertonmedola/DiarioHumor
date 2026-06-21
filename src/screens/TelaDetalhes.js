import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import IconeHumor from '../components/IconeHumor';
import ModalConfirmacao from '../components/ModalConfirmacao';
import { getHumorPorId } from '../constants/humores';
import { getRegistroPorId, excluirRegistro } from '../services/registrosStorage';

export default function TelaDetalhes({ navigation, route }) {
  const { registroId } = route.params;
  const [registro, setRegistro] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);

  // Recarrega o registro sempre que a tela ganha foco (ex: após editar e voltar)
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      (async () => {
        const dados = await getRegistroPorId(registroId);
        if (ativo) setRegistro(dados);
      })();
      return () => {
        ativo = false;
      };
    }, [registroId])
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Formulario', { registroId })}
          style={{ paddingHorizontal: 12 }}
        >
          <Text style={{ fontSize: 14, color: '#1A1A1A' }}>Editar</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, registroId]);

  function handleExcluir() {
    setModalVisivel(true);
  }

  async function confirmarExclusao() {
    setModalVisivel(false);
    await excluirRegistro(registroId);
    navigation.goBack();
  }

  if (!registro) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.textoCarregando}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  const humor = getHumorPorId(registro.humor);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>
        <IconeHumor humorId={registro.humor} tamanho={72} />
        <Text style={styles.data}>{formatarDataExtensa(registro.data)}</Text>
        <Text style={styles.humorLabel}>{humor?.label}</Text>

        <View style={styles.caixaNota}>
          <Text style={styles.labelNota}>Nota</Text>
          <Text style={styles.textoNota}>
            {registro.nota || 'Nenhuma nota foi adicionada a este registro.'}
          </Text>
        </View>

        <TouchableOpacity style={styles.botaoExcluir} onPress={handleExcluir}>
          <Text style={styles.textoBotaoExcluir}>Excluir registro</Text>
        </TouchableOpacity>
      </View>

      <ModalConfirmacao
        visivel={modalVisivel}
        titulo="Excluir registro"
        mensagem="Tem certeza que deseja excluir este registro? Essa ação não pode ser desfeita."
        onCancelar={() => setModalVisivel(false)}
        onConfirmar={confirmarExclusao}
      />
    </SafeAreaView>
  );
}

function formatarDataExtensa(dataIso) {
  const [ano, mes, dia] = dataIso.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  const nomesMeses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];
  return `${dia} de ${nomesMeses[mes - 1]} de ${ano}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  conteudo: {
    padding: 24,
    alignItems: 'center',
  },
  textoCarregando: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999999',
  },
  data: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 12,
  },
  humorLabel: {
    fontSize: 13,
    color: '#777777',
    marginTop: 2,
    marginBottom: 24,
  },
  caixaNota: {
    width: '100%',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
  },
  labelNota: {
    fontSize: 11,
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  textoNota: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 21,
  },
  botaoExcluir: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  textoBotaoExcluir: {
    color: '#D32F2F',
    fontSize: 15,
    fontWeight: '600',
  },
});
