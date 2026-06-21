import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SeletorHumor from '../components/SeletorHumor';
import ModalConfirmacao from '../components/ModalConfirmacao';
import {
  salvarRegistro,
  atualizarRegistro,
  excluirRegistro,
  getRegistroPorId,
} from '../services/registrosStorage';

export default function TelaFormulario({ navigation, route }) {
  // Se veio um registroId por parâmetro de navegação, estamos em modo edição
  const registroId = route.params?.registroId;
  const modoEdicao = !!registroId;

  const [data, setData] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [humor, setHumor] = useState(null);
  const [nota, setNota] = useState('');
  const [erros, setErros] = useState({ data: '', humor: '' });
  const [carregando, setCarregando] = useState(modoEdicao);
  const [modalVisivel, setModalVisivel] = useState(false);

  // Em modo edição, busca o registro existente e popula os campos
  useEffect(() => {
    navigation.setOptions({
      title: modoEdicao ? 'Editar registro' : 'Novo registro',
    });

    if (modoEdicao) {
      (async () => {
        const registro = await getRegistroPorId(registroId);
        if (registro) {
          setData(new Date(registro.data + 'T00:00:00'));
          setHumor(registro.humor);
          setNota(registro.nota || '');
        }
        setCarregando(false);
      })();
    }
  }, [registroId]);

  function validar() {
    const novosErros = { data: '', humor: '' };
    let valido = true;

    if (!data) {
      novosErros.data = 'Selecione uma data.';
      valido = false;
    }
    if (!humor) {
      novosErros.humor = 'Selecione um humor.';
      valido = false;
    }

    setErros(novosErros);
    return valido;
  }

  async function handleSalvar() {
    if (!validar()) return;

    const dataIso = formatarParaIso(data);
    const payload = { data: dataIso, humor, nota };

    if (modoEdicao) {
      await atualizarRegistro(registroId, payload);
    } else {
      await salvarRegistro(payload);
    }

    navigation.goBack();
  }

  function handleExcluir() {
    setModalVisivel(true);
  }

  async function confirmarExclusao() {
    setModalVisivel(false);
    await excluirRegistro(registroId);
    navigation.goBack();
  }

  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.textoCarregando}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>
        <Text style={styles.label}>Data</Text>
        <TouchableOpacity
          style={[styles.campoData, erros.data ? styles.campoComErro : null]}
          onPress={() => setMostrarDatePicker(true)}
        >
          <Text style={styles.textoData}>{formatarParaExibicao(data)}</Text>
        </TouchableOpacity>
        {erros.data ? <Text style={styles.textoErro}>{erros.data}</Text> : null}

        {mostrarDatePicker && (
          <DateTimePicker
            value={data}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(evento, dataSelecionada) => {
              setMostrarDatePicker(Platform.OS === 'ios');
              if (dataSelecionada) {
                setData(dataSelecionada);
                setErros((e) => ({ ...e, data: '' }));
              }
              if (Platform.OS === 'android') {
                setMostrarDatePicker(false);
              }
            }}
          />
        )}

        <Text style={[styles.label, { marginTop: 20 }]}>Humor</Text>
        <SeletorHumor
          humorSelecionado={humor}
          onSelecionar={(id) => {
            setHumor(id);
            setErros((e) => ({ ...e, humor: '' }));
          }}
          erro={erros.humor}
        />

        <Text style={[styles.label, { marginTop: 20 }]}>Nota (opcional)</Text>
        <TextInput
          style={styles.campoNota}
          multiline
          numberOfLines={4}
          placeholder="Escreva sobre o seu dia..."
          placeholderTextColor="#AAAAAA"
          value={nota}
          onChangeText={setNota}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
          <Text style={styles.textoBotaoSalvar}>Salvar</Text>
        </TouchableOpacity>

        {modoEdicao && (
          <TouchableOpacity style={styles.botaoExcluir} onPress={handleExcluir}>
            <Text style={styles.textoBotaoExcluir}>Excluir registro</Text>
          </TouchableOpacity>
        )}
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

// Converte um objeto Date para string ISO 'YYYY-MM-DD', usando o fuso local
// (evita o bug clássico de toISOString() voltar um dia por causa do UTC)
function formatarParaIso(date) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function formatarParaExibicao(date) {
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  conteudo: {
    padding: 16,
  },
  textoCarregando: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999999',
  },
  label: {
    fontSize: 11,
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  campoData: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  campoComErro: {
    borderColor: '#D32F2F',
  },
  textoData: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  textoErro: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 6,
  },
  campoNota: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#1A1A1A',
  },
  botaoSalvar: {
    backgroundColor: '#1A1A1A',
    width: '100%',
    height: 48,
    maxHeight: 48,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexGrow: 0,
    flexShrink: 0,
    marginTop: 28,
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 18,
  },
  botaoExcluir: {
    width: '100%',
    height: 48,
    maxHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D32F2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexGrow: 0,
    flexShrink: 0,
    marginTop: 12,
  },
  textoBotaoExcluir: {
    color: '#D32F2F',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 18,
  },
});
