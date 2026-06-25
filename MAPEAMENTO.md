# Mapeamento de Componentes – Diário de Humor

Este documento descreve a hierarquia de componentes do app, suas responsabilidades
e quais são reutilizáveis em mais de um lugar.

## Visão geral da árvore

```
App (Navigation Container)
│
├── TelaListagem (tela inicial)
│   ├── TopBar
│   │   └── Título "Diário de Humor" + botão "+" (ir para Formulário)
│   ├── SeletorMes (navega entre meses, controla calendário e gráfico)
│   ├── CalendarioMensal
│   │   ├── CabecalhoDiasDaSemana (D S T Q Q S S)
│   │   └── DiaCalendario (reutilizável, um por célula do grid)
│   │       └── IconeHumor (emoji pequeno, se houver registro naquele dia)
│   ├── GraficoMensal (compacto, abaixo do calendário)
│   └── CardDoDiaSelecionado (mostra o registro do dia tocado no calendário)
│       ├── IconeHumor
│       ├── DataFormatada
│       └── NotaPreview
│
├── TelaFormulario (criar/editar registro)
│   ├── TopBar (título dinâmico: "Novo registro" / "Editar registro")
│   ├── CampoData (DatePicker)
│   ├── SeletorHumor (reutilizável)
│   │   └── IconeHumor (mesmo componente usado no CardHumor)
│   ├── CampoNota (TextInput multiline, opcional)
│   ├── BotaoSalvar
│   └── BotaoExcluir (só aparece em modo edição)
│
└── TelaDetalhes (visualização do registro)
    ├── TopBar (com botão de voltar)
    ├── IconeHumor (grande, mesmo componente reutilizável)
    ├── DataFormatada
    ├── NotaCompleta
    ├── BotaoEditar (vai para TelaFormulario em modo edição)
    └── BotaoExcluir (com confirmação)
```

## Componentes reutilizáveis (usados em 2+ lugares)

| Componente     | Onde é usado                                                    | Responsabilidade                                                |
| -------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| `IconeHumor`   | DiaCalendario, CardDoDiaSelecionado, SeletorHumor, TelaDetalhes | Renderiza o emoji/ícone correspondente ao humor selecionado     |
| `BotaoSalvar`  | TelaFormulario                                                  | Botão de ação primária, com estado de loading/disabled          |
| `BotaoExcluir` | TelaFormulario, TelaDetalhes                                    | Botão de exclusão com confirmação (modal próprio)               |
| `TopBar`       | Todas as telas                                                  | Cabeçalho com título e botão de navegação (voltar ou adicionar) |

## Componentes específicos de tela (não reutilizados)

| Componente             | Tela           | Responsabilidade                                                              |
| ---------------------- | -------------- | ----------------------------------------------------------------------------- |
| `CalendarioMensal`     | TelaListagem   | Renderiza o grid de dias do mês, com o humor de cada dia (se houver)          |
| `DiaCalendario`        | TelaListagem   | Uma célula do grid: número do dia + IconeHumor pequeno; toque seleciona o dia |
| `GraficoMensal`        | TelaListagem   | Gráfico de barras compacto com a contagem de humores do mês selecionado       |
| `SeletorMes`           | TelaListagem   | Permite navegar entre meses, atualizando calendário e gráfico juntos          |
| `CardDoDiaSelecionado` | TelaListagem   | Mostra o registro (se houver) do dia tocado no calendário                     |
| `SeletorHumor`         | TelaFormulario | Grade/linha de opções de humor para o usuário escolher                        |
| `CampoData`            | TelaFormulario | DatePicker para selecionar a data do registro                                 |
| `CampoNota`            | TelaFormulario | TextInput multiline para a nota opcional                                      |
| `NotaCompleta`         | TelaDetalhes   | Exibe o texto completo da nota (sem truncamento)                              |

## Definição dos humores (constante compartilhada)

Para manter consistência entre `IconeHumor`, `SeletorHumor` e `GraficoMensal`,
os humores serão definidos uma única vez em `constants/humores.js`, por exemplo:

```js
export const HUMORES = [
  { id: "feliz", emoji: "😄", label: "Feliz", cor: "#4CAF50" },
  { id: "triste", emoji: "😢", label: "Triste", cor: "#2196F3" },
  { id: "ansioso", emoji: "😰", label: "Ansioso", cor: "#FF9800" },
  { id: "irritado", emoji: "😠", label: "Irritado", cor: "#F44336" },
  { id: "neutro", emoji: "😐", label: "Neutro", cor: "#9E9E9E" },
  { id: "animado", emoji: "🤩", label: "Animado", cor: "#9C27B0" },
];
```

Isso evita duplicar a lista de humores em três lugares diferentes e facilita
adicionar/remover humores no futuro.
