# Decisões de projeto – Diário de Humor

## Tecnologia escolhida

- [x] Híbrido (React Native com Expo)
- **Por quê?** Já tinha utilizado essa stack no projeto anterior da disciplina
  (CurrencyFav), então a curva de aprendizado de ferramentas (Expo Go, Metro
  Bundler, estrutura de pastas) já estava resolvida. Isso permitiu focar o
  tempo nas regras de negócio específicas deste app (persistência de humor,
  gráfico) em vez de reaprender configuração de ambiente nativo.

## Persistência escolhida

- **AsyncStorage**, com toda a lista de registros guardada como um único
  array JSON sob a chave `@diario-humor:registros`.
- **Por quê?** Avaliei também `expo-sqlite` (usado no projeto anterior), mas
  para este app o volume de dados é pequeno (um registro por dia, no máximo)
  e não há necessidade de queries relacionais complexas — só leitura,
  inserção, atualização e remoção em um array. AsyncStorage é mais simples
  de implementar e mais rápido de testar para esse escopo.
- Toda a lógica de acesso fica isolada em `src/services/registrosStorage.js`,
  para não duplicar `JSON.parse`/`JSON.stringify` espalhado pelas telas.

## Estrutura de navegação

- **3 telas**, usando `@react-navigation/native-stack` (Stack Navigator
  tradicional, sem Expo Router):
  - **Listagem** (tela inicial): mostra o gráfico do mês + lista de registros.
  - **Formulário**: usada tanto para criar quanto para editar. O modo é
    decidido pela presença do parâmetro `registroId` — se existir, a tela
    busca o registro e preenche os campos; se não existir, começa em branco.
  - **Detalhes**: mostra um registro específico por completo, com botões de
    editar e excluir.
- **Como se comunicam:** via parâmetros de navegação
  (`navigation.navigate('Detalhes', { registroId })`), nunca por estado
  global. Optei por não usar Context API ou Redux porque a navegação é
  simples e a lista é relida do AsyncStorage sempre que a tela de Listagem
  recebe foco (`useFocusEffect`), o que já mantém os dados atualizados sem
  complexidade adicional.

## Funcionalidade que eu queria implementar mas não deu tempo

- **Edição de humores customizados**: hoje a lista de humores (`feliz`,
  `triste`, `ansioso`, etc.) é fixa em `src/constants/humores.js`. Seria
  interessante permitir que o usuário criasse seus próprios humores com
  emoji e cor personalizados.
- **Como eu começaria a fazer:** criaria uma tela extra de "Configurações"
  com um CRUD próprio para humores, salvos em outra chave do AsyncStorage
  (`@diario-humor:humores-customizados`), e o `SeletorHumor`/`CardHumor`
  passariam a ler dessa lista combinada (fixa + customizada) em vez do
  array estático.

## Trecho que eu escrevi sem ajuda de IA (aponte 1 função/método)

A função abaixo está em `src/screens/TelaListagem.js` e controla a troca de
mês no seletor que fica acima do gráfico de barras. Eu reescrevi essa parte
do código manualmente (substituindo duas funções quase idênticas que a IA
tinha gerado, `irParaMesAnterior` e `irParaProximoMes`, por uma única função
parametrizada):

```js
function mudarMes(delta) {
  setMesSelecionado((atual) => {
    const totalDeMeses = atual.ano * 12 + atual.mes + delta;
    const novoAno = Math.floor(totalDeMeses / 12);
    const novoMes = totalDeMeses % 12;
    return { ano: novoAno, mes: novoMes };
  });
}
```

**O que ela faz:** em vez de verificar "é dezembro?" ou "é janeiro?" com
condicionais (como a versão original fazia, repetindo a mesma checagem duas
vezes), eu transformo o mês e o ano selecionados em um único número contínuo
de meses (`ano * 12 + mes`). Somo ou subtraio `delta` (1 para avançar, -1
para voltar) nesse número, e depois "decomponho" o resultado de volta em mês
e ano usando divisão inteira (`Math.floor`, para o ano) e resto da divisão
(`%`, para o mês — sempre um valor entre 0 e 11). Isso faz a virada de ano
acontecer automaticamente, sem precisar tratar dezembro→janeiro e
janeiro→dezembro como casos especiais.

Os dois botões de seta da tela agora chamam a mesma função, só trocando o
sinal do parâmetro: `mudarMes(-1)` para o mês anterior e `mudarMes(1)` para
o próximo.

## Partes feitas com auxílio de IA vs. feitas manualmente

- **Com auxílio de IA (Claude):** toda a estrutura inicial do projeto foi
  gerada com apoio de IA — componentes, telas, navegação, persistência e os
  documentos de planejamento (`MAPEAMENTO.md`, `ESTADO.md`). Entendi e revisei
  cada trecho antes de testar, já que seria questionado sobre o funcionamento
  na defesa oral.
- **Feito manualmente (depuração real):** ao testar o app no celular via
  Expo Go, encontrei e corrigi (com apoio de IA para diagnóstico, mas
  aplicando e validando as mudanças eu mesmo no ambiente real) os seguintes
  problemas:
  1. O gráfico de barras (`react-native-chart-kit`) renderizava mal — troquei
     por um gráfico construído com `View`/flexbox puro, sem dependência
     externa.
  2. O botão "Salvar" do formulário ficava com tamanho desproporcional —
     corrigido fixando `width`, `height` e impedindo o elemento de crescer
     (`flexGrow: 0`, `flexShrink: 0`).
  3. A exclusão de registro não funcionava ao testar no navegador (Expo Web).
     Causa: `Alert.alert` do React Native não exibe nada no Web. Substituí
     por um componente próprio (`ModalConfirmacao.js`, usando `Modal` do React
     Native), que funciona de forma idêntica em Web, iOS e Android.
  4. Durante a migração do projeto do Expo SDK 51 para o SDK 54 (para ficar
     compatível com a versão do Expo Go instalada no meu celular), enfrentei
     conflitos de dependências (`ERESOLVE`) no `npm install`. Resolvi limpando
     `node_modules` e `package-lock.json`, e usando `npx expo install --fix`
     para obter as versões corretas e compatíveis entre si.
