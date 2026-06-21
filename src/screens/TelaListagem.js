import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CardHumor from '../components/CardHumor';
import GraficoMensal from '../components/GraficoMensal';
import { getRegistros } from '../services/registrosStorage';

export default function TelaListagem({ navigation }) {
  const [registros, setRegistros] = useState([]);
  // mesSelecionado guarda { ano, mes } — mes de 0 a 11, igual ao Date do JS
  const [mesSelecionado, setMesSelecionado] = useState(() => {
    const hoje = new Date();
    return { ano: hoje.getFullYear(), mes: hoje.getMonth() };
  });

  // Recarrega a lista sempre que a tela recebe foco (ex: ao voltar do Formulário)
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      async function carregar() {
        const dados = await getRegistros();
        if (ativo) {
          // Ordena do mais recente para o mais antigo
          dados.sort((a, b) => b.data.localeCompare(a.data));
          setRegistros(dados);
        }
      }
      carregar();
      return () => {
        ativo = false;
      };
    }, [])
  );

  // Estado derivado: registros pertencentes ao mês/ano selecionado
  const registrosDoMes = useMemo(() => {
    return registros.filter((r) => {
      const [ano, mes] = r.data.split('-');
      return (
        Number(ano) === mesSelecionado.ano &&
        Number(mes) - 1 === mesSelecionado.mes
      );
    });
  }, [registros, mesSelecionado]);

  function irParaMesAnterior() {
    setMesSelecionado((atual) => {
      const novoMes = atual.mes === 0 ? 11 : atual.mes - 1;
      const novoAno = atual.mes === 0 ? atual.ano - 1 : atual.ano;
      return { ano: novoAno, mes: novoMes };
    });
  }

  function irParaProximoMes() {
    setMesSelecionado((atual) => {
      const novoMes = atual.mes === 11 ? 0 : atual.mes + 1;
      const novoAno = atual.mes === 11 ? atual.ano + 1 : atual.ano;
      return { ano: novoAno, mes: novoMes };
    });
  }

  const nomeMes = NOMES_MESES[mesSelecionado.mes];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.titulo}>Diário de Humor</Text>
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => navigation.navigate('Formulario')}
        >
          <Text style={styles.textoBotaoAdicionar}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.seletorMes}>
        <TouchableOpacity onPress={irParaMesAnterior}>
          <Text style={styles.seta}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.textoMes}>
          {nomeMes} {mesSelecionado.ano}
        </Text>
        <TouchableOpacity onPress={irParaProximoMes}>
          <Text style={styles.seta}>{'›'}</Text>
        </TouchableOpacity>
      </View>

      <GraficoMensal registrosDoMes={registrosDoMes} />

      <FlatList
        data={registros}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.listaVazia}>
            Nenhum registro ainda. Toque em "+" para começar.
          </Text>
        }
        renderItem={({ item }) => (
          <CardHumor
            registro={item}
            onPress={() =>
              navigation.navigate('Detalhes', { registroId: item.id })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const NOMES_MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  botaoAdicionar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoAdicionar: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 20,
  },
  seletorMes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  seta: {
    fontSize: 22,
    color: '#777777',
    paddingHorizontal: 12,
  },
  textoMes: {
    fontSize: 13,
    color: '#555555',
  },
  lista: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  listaVazia: {
    textAlign: 'center',
    color: '#999999',
    marginTop: 40,
    fontSize: 13,
  },
});
