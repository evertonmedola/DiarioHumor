# Plano de Estado – Diário de Humor

Este documento descreve onde cada dado da aplicação vive, como é atualizado
e por qual componente/tela ele é consumido.

## Tabela geral de estado

| Dado                          | Local no código                          | Como é atualizado                                              | Onde é consumido                          |
|--------------------------------|-------------------------------------------|-------------------------------------------------------------------|----------------------------------------------|
| Lista de registros (todos)     | AsyncStorage (chave `@diario-humor:registros`) + estado local em `TelaListagem` (`useState` + `useEffect`) | Lido do AsyncStorage ao focar a tela (`useFocusEffect`); atualizado após salvar/editar/excluir | `ListaRegistros`, `GraficoMensal` |
| Registros filtrados do mês     | Estado derivado em `TelaListagem` (calculado com `useMemo` a partir da lista completa + mês selecionado) | Recalculado automaticamente quando `listaCompleta` ou `mesSelecionado` mudam | `GraficoMensal` |
| Mês selecionado (filtro do gráfico) | Estado local em `TelaListagem` (`useState`, padrão = mês atual) | Ao clicar nas setas/botões do `SeletorMes` | `GraficoMensal`, `SeletorMes` |
| Campo: data do registro        | Estado local em `TelaFormulario` (`useState`) | `onChange` do `CampoData` (DatePicker) | `CampoData` |
| Campo: humor selecionado       | Estado local em `TelaFormulario` (`useState`) | `onPress` em uma opção do `SeletorHumor` | `SeletorHumor`, validação no submit |
| Campo: nota (texto opcional)   | Estado local em `TelaFormulario` (`useState`) | `onChangeText` do `CampoNota` | `CampoNota` |
| Erros de validação do formulário | Estado local em `TelaFormulario` (`useState`, objeto `{ data: '', humor: '' }`) | Recalculado no submit (`onPress` do `BotaoSalvar`), limpo quando o campo correspondente muda | `CampoData`, `SeletorHumor` (exibição de erro) |
| Registro selecionado (para editar/ver) | Parâmetro de navegação (`route.params.registroId`) + buscado do AsyncStorage no `useEffect` de `TelaFormulario`/`TelaDetalhes` | Ao tocar em um `CardHumor` na listagem (`navigation.navigate('Detalhes', { registroId })`) | `TelaFormulario` (modo edição), `TelaDetalhes` |
| Modo do formulário (criar/editar) | Estado derivado em `TelaFormulario` (`const modoEdicao = !!route.params?.registroId`) | Derivado automaticamente da presença do parâmetro de navegação | `TopBar` (título), `BotaoExcluir` (visibilidade) |
| Confirmação de exclusão        | Controlado via `Alert.alert` nativo (não precisa de estado próprio) | Disparado pelo `onPress` do `BotaoExcluir` | `TelaFormulario`, `TelaDetalhes` |

## Estrutura de um registro (modelo de dado)

```js
{
  id: 'uuid-gerado-na-criacao',
  data: '2026-06-18',        // formato ISO (YYYY-MM-DD)
  humor: 'feliz',             // id referente a constants/humores.js
  nota: 'Texto opcional...',  // string, pode ser vazia
  criadoEm: 1750000000000,    // timestamp, útil para ordenação
}
```

## Fluxo de leitura/escrita no AsyncStorage

- Toda a lista é armazenada como **um único array JSON** sob a chave
  `@diario-humor:registros` (mais simples que múltiplas chaves, e o volume de
  dados de um diário pessoal é pequeno o suficiente para isso ser tranquilo).
- Operações:
  - **Create**: lê o array atual → adiciona novo objeto → salva array atualizado.
  - **Read**: lê o array completo e mantém em estado local (`TelaListagem`).
  - **Update**: lê o array → encontra pelo `id` → substitui o objeto → salva.
  - **Delete**: lê o array → filtra removendo o `id` → salva o array resultante.
- Toda a lógica de acesso ao AsyncStorage fica isolada em um módulo
  `services/registrosStorage.js` (funções `getRegistros`, `salvarRegistro`,
  `atualizarRegistro`, `excluirRegistro`), para não duplicar `JSON.parse`/
  `JSON.stringify` espalhado pelas telas.

## Por que não usar Context API ou Redux aqui

Como a navegação é simples (3 telas) e a lista é relida sempre que a
`TelaListagem` recebe foco (`useFocusEffect`), não há necessidade de um
estado global compartilhado. Isso evita complexidade desnecessária e é
mais fácil de explicar na defesa oral.