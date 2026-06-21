# Diário de Humor

App de diário de humor desenvolvido em React Native + Expo, para a disciplina
de Desenvolvimento Mobile.

## Como rodar

```bash
npm install
npx expo start
```

Depois escaneie o QR Code com o app **Expo Go** no seu celular Android, ou
pressione `a` no terminal para abrir num emulador Android já configurado.

## Funcionalidades

- Criar, listar, editar e excluir registros de humor (CRUD completo)
- Cada registro tem: data, humor (escolhido entre 6 opções) e nota opcional
- Gráfico de barras mostrando a distribuição de humores no mês selecionado
- Navegação entre mês anterior/próximo no gráfico
- Persistência local via AsyncStorage (os dados sobrevivem ao fechar o app)

## Estrutura de pastas

```
src/
├── constants/      → lista de humores (fonte única de verdade)
├── services/       → acesso ao AsyncStorage (CRUD)
├── components/     → componentes reutilizáveis (IconeHumor, CardHumor, SeletorHumor, GraficoMensal)
├── screens/        → as 3 telas do app
└── navigation/      → configuração do Stack Navigator
```

Veja `MAPEAMENTO.md` e `ESTADO.md` para mais detalhes sobre a arquitetura,
e `DECISOES.md` para as decisões técnicas tomadas durante o desenvolvimento.
