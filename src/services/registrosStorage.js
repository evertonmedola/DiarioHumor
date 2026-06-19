import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

// Toda a lista de registros vive como UM único array JSON nesta chave.
// Decisão registrada em ESTADO.md: volume de dados de um diário pessoal
// é pequeno o suficiente para isso ser tranquilo, e simplifica bastante
// a leitura/escrita comparado a múltiplas chaves por registro.
const STORAGE_KEY = '@diario-humor:registros';

// READ: retorna o array completo de registros (ou [] se não houver nada ainda)
export async function getRegistros() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (erro) {
    console.error('Erro ao ler registros do AsyncStorage:', erro);
    return [];
  }
}

// Função interna: persiste o array inteiro de volta no AsyncStorage
async function salvarTodos(registros) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
}

// CREATE: recebe { data, humor, nota } e adiciona um novo registro com id e timestamp
export async function salvarRegistro({ data, humor, nota }) {
  const registros = await getRegistros();

  const novoRegistro = {
    id: uuid.v4(),
    data, // formato ISO: 'YYYY-MM-DD'
    humor, // id referente a constants/humores.js
    nota: nota || '',
    criadoEm: Date.now(),
  };

  const atualizados = [...registros, novoRegistro];
  await salvarTodos(atualizados);
  return novoRegistro;
}

// UPDATE: encontra pelo id e substitui os campos editáveis
export async function atualizarRegistro(id, { data, humor, nota }) {
  const registros = await getRegistros();

  const atualizados = registros.map((registro) =>
    registro.id === id
      ? { ...registro, data, humor, nota: nota || '' }
      : registro
  );

  await salvarTodos(atualizados);
}

// DELETE: filtra removendo o registro pelo id
export async function excluirRegistro(id) {
  const registros = await getRegistros();
  const atualizados = registros.filter((registro) => registro.id !== id);
  await salvarTodos(atualizados);
}

// READ (único): busca um registro específico pelo id
// Usado pela TelaFormulario (modo edição) e TelaDetalhes
export async function getRegistroPorId(id) {
  const registros = await getRegistros();
  return registros.find((registro) => registro.id === id) || null;
}
