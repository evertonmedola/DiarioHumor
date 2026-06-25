import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CalendarioMensal from '../components/CalendarioMensal';
import CardDoDiaSelecionado from '../components/CardDoDiaSelecionado';
import GraficoMensal from '../components/GraficoMensal';
import { getRegistros } from '../services/registrosStorage';

export default function TelaListagem({ navigation }) {
  const [registros, setRegistros] = useState([]);

  const [mesSelecionado, setMesSelecionado] = useState(() => {
    const hoje = new Date();
    return { ano: hoje.getFullYear(), mes: hoje.getMonth() };
  });

  const [diaSelecionado, setDiaSelecionado] = useState(() =>
    formatarParaIso(new Date())
  );

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      async function carregar() {
        const dados = await getRegistros();
        if (ativo) setRegistros(dados);
      }
      carregar();
      return () => {
        ativo = false;
      };
    }, [])
  );

  const registrosDoMes = useMemo(() => {
    return registros.filter((r) => {
      const [ano, mes] = r.data.split('-');
      return (
        Number(ano) === mesSelecionado.ano &&
        Number(mes) - 1 === mesSelecionado.mes
      );
    });
  }, [registros, mesSelecionado]);

  const registroDoDiaSelecionado = useMemo(() => {
    return registros.find((r) => r.data === diaSelecionado) || null;
  }, [registros, diaSelecionado]);

  function mudarMes(delta) {
    setMesSelecionado((atual) => {
      const totalDeMeses = atual.ano * 12 + atual.mes + delta;
      const novoAno = Math.floor(totalDeMeses / 12);
      const novoMes = totalDeMeses % 12;
      return { ano: novoAno, mes: novoMes };
    });
  }

  function handleTocarDia() {
    if (registroDoDiaSelecionado) {
      navigation.navigate('Detalhes', {
        registroId: registroDoDiaSelecionado.id,
      });
    } else {
      navigation.navigate('Formulario', { dataInicial: diaSelecionado });
    }
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

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.seletorMes}>
          <TouchableOpacity onPress={() => mudarMes(-1)}>
            <Text style={styles.seta}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.textoMes}>
            {nomeMes} {mesSelecionado.ano}
          </Text>
          <TouchableOpacity onPress={() => mudarMes(1)}>
            <Text style={styles.seta}>{'›'}</Text>
          </TouchableOpacity>
        </View>

        <CalendarioMensal
          ano={mesSelecionado.ano}
          mes={mesSelecionado.mes}
          registrosDoMes={registrosDoMes}
          diaSelecionado={diaSelecionado}
          onSelecionarDia={setDiaSelecionado}
        />

        <CardDoDiaSelecionado
          dataIso={diaSelecionado}
          registro={registroDoDiaSelecionado}
          onPress={handleTocarDia}
        />

        <Text style={styles.tituloSecao}>Resumo do mês</Text>
        <GraficoMensal registrosDoMes={registrosDoMes} />
      </ScrollView>
    </SafeAreaView>
  );
}

function formatarParaIso(date) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
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
  scroll: {
    paddingBottom: 32,
  },
  seletorMes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 4,
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
  tituloSecao: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 20,
    marginHorizontal: 16,
    marginBottom: 4,
  },
});