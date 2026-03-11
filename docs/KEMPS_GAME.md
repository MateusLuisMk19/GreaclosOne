# Jogo Kem's - Greaclos

## 🎯 Visão Geral

Kem's é um jogo de cartas emocionante e estratégico implementado no projeto Greaclos. O objetivo é formar 4 cartas do mesmo valor e gritar "Kem's" antes que a IA grite "Corta"!

## 🎴 Sobre o Jogo

### **Nomes Alternativos**

Kem's também é conhecido como:

- Games, Kent, Sinais, Cash
- Camps, Dero, Cape, Keips
- Queime-se, Keims, Queipse
- Keipson

### **Jogadores**

- **Single Player vs IA**: 1 jogador vs Computador (implementado)
- **Duplas**: 2 a 6 duplas (4 a 12 jogadores) - futuro
- **Baralho**: 52 cartas (sem Jokers)

## 🎮 Como Jogar

### **1. Início do Jogo**

- Cada jogador recebe **4 cartas**
- **4 cartas** são colocadas na mesa (face para cima)
- Jogadores analisam suas cartas e as da mesa

### **2. Sistema de Turnos**

- **Alternância**: Você → IA → Você → IA...
- **Sua vez**: Selecione e troque cartas
- **Vez da IA**: IA joga automaticamente
- **Indicador visual**: Mostra de quem é a vez

### **3. Como Jogar (Nova Mecânica)**

- **Pegar cartas**: Clique em uma carta da mesa para pegá-la automaticamente
- **Descartar cartas**: Você tem 8 segundos para descartar o mesmo número de cartas
- **Sistema automático**: Não há botão de troca - tudo é automático
- **Contagem regressiva**: 8 segundos para descartar, senão mesa é trocada

### **4. Contagem Regressiva**

- **1 carta**: 5 segundos
- **2+ cartas**: 8 segundos (mudou de 10 para 8)
- **+5 segundos**: Cada vez que descartar uma carta
- **Quando chega a 0**:
  - Se descartou todas: Passa para próximo turno
  - Se não descartou: **Turno bloqueado** até descartar todas
  - **Notificação clara**: Jogador é avisado que precisa descartar

### **5. Objetivo**

Formar **4 cartas do mesmo valor** (ex: 4 Ases, 4 Reis, etc.)

## 🤖 Inteligência Artificial

### **Níveis de Dificuldade**

- **Fácil**: Movimentos aleatórios, 30% chance de passar
- **Médio**: Estratégia básica, forma pares e trincas
- **Difícil**: Estratégia avançada, 80% movimentos inteligentes

### **Comportamento da IA**

- **Análise**: Avalia cartas da mão e da mesa
- **Estratégia**: Tenta formar grupos de cartas iguais
- **Timing**: Delay variável para parecer mais humana
- **Adaptação**: Ajusta comportamento baseado na dificuldade

### **Estratégias da IA**

- **Formação de grupos**: Procura por pares e trincas
- **Movimentos inteligentes**: Calcula melhor jogada possível
- **Passar a vez**: Quando não encontra boa estratégia
- **Gritar Kem's**: Automaticamente quando tem 4 cartas iguais

## 🎯 Ações do Jogo

### **Pegar Cartas da Mesa**

- **Clique direto**: Clique em uma carta da mesa para pegá-la
- **Automático**: A carta vai direto para sua mão
- **Contagem inicia**: 8 segundos para descartar cartas

### **Descartar Cartas**

- **Obrigatório**: Deve descartar o mesmo número de cartas pegas
- **Tempo limitado**: 8 segundos para descartar
- **+5 segundos**: Cada carta descartada adiciona 5 segundos
- **Clique para descartar**: Clique nas cartas da sua mão
- **Turno bloqueado**: Não pode avançar até descartar todas
- **Notificação**: Sistema avisa claramente o que fazer

### **Gritar KEM'S!**

- Quando tiver 4 cartas iguais
- Clique no botão "KEM'S!"
- Sistema verifica se é válido
- **Sucesso**: +1 ponto
- **Falha**: Ponto para a IA

### **Gritar CORTA!**

- Para acusar a IA
- Clique no botão "CORTA!"
- Interrompe o jogo
- Verifica a acusação

## ⚙️ Configurações

### **Modos de Jogo**

- **Até 3 pontos**: Jogo mais rápido
- **Até 5 pontos**: Jogo mais longo

### **Dificuldade da IA**

- **Fácil**: Ideal para iniciantes
- **Médio**: Desafio equilibrado
- **Difícil**: Para jogadores experientes

### **Regras Implementadas**

- ✅ Validação de turnos
- ✅ Sistema de IA inteligente
- ✅ **Nova mecânica**: Pegar e descartar automático
- ✅ **Contagem atualizada**: 8 segundos para descartar
- ✅ **Sistema automático**: Sem botão de troca
- ✅ **+5 segundos**: Cada descarte adiciona tempo
- ✅ **Bloqueio de turno**: Não avança até descartar todas
- ✅ **Notificações claras**: Jogador sempre sabe o que fazer
- ✅ Contagem regressiva automática
- ✅ Verificação de vitória
- ✅ Sistema de pontuação
- ✅ Troca automática de cartas da mesa
- ✅ **Turno automático**: Passa para IA após descarte completo

## 🎨 Interface do Jogo

### **Áreas Principais**

1. **Configurações**: Escolha do modo e dificuldade
2. **Status**: Pontuação de ambos os jogadores
3. **Mão do Jogador**: Suas 4 cartas (selecionáveis)
4. **Cartas da Mesa**: 4 cartas disponíveis
5. **Mão da IA**: 4 cartas (viradas para baixo)
6. **Regras**: Instruções completas

### **Estados Visuais**

- **Cartas selecionadas**: Ring azul e escala aumentada
- **Contagem regressiva**: Timer laranja (8 segundos)
- **Vez da IA**: Indicador vermelho pulsante
- **IA pensando**: Círculo vermelho animado
- **Vitória**: Troféu verde
- **Corta**: Triângulo vermelho
- **Instruções**: Texto azul mostrando o que fazer
- **Avisos de tempo**: Texto vermelho quando tempo esgota
- **+5 segundos**: Feedback visual quando descarta

### **Indicadores de Turno**

- **Sua vez**: Botões ativos, cartas selecionáveis
- **Vez da IA**: Botões desabilitados, IA joga automaticamente
- **Status visual**: Mostra claramente de quem é a vez
- **Instruções**: Texto explicativo do que fazer
- **Bloqueio de turno**: Aviso claro quando não pode avançar

### **Nova Interface**

- **Sem botão de troca**: Sistema totalmente automático
- **Instruções claras**: Mostra o que fazer a cada momento
- **Contagem visual**: Timer de 8 segundos para descarte
- **Feedback imediato**: Mensagens explicando cada ação
- **Notificações de tempo**: Avisos quando tempo esgota
- **Status de bloqueio**: Mostra quando turno está bloqueado

## 🔧 Funcionalidades Técnicas

### **Componentes Utilizados**

- `PlayingCard`: Cartas individuais
- `generateDeck`: Geração do baralho
- `shuffleDeck`: Embaralhamento
- Sistema de estado React

### **Lógica do Jogo**

- **Validação de turnos**: Só jogar na sua vez
- **IA inteligente**: Diferentes níveis de dificuldade
- **Validação de trocas**: Mesmo número de cartas
- **Verificação de vitória**: 4 cartas iguais
- **Contagem regressiva**: useEffect com timer
- **Gerenciamento de estado**: useState para gameState

### **Sistema de IA**

- **Algoritmos**: Estratégias baseadas em dificuldade
- **Análise de cartas**: Agrupamento por valor
- **Tomada de decisão**: Lógica inteligente
- **Timing**: Delays variáveis para realismo

### **Validações Implementadas**

- ✅ Turno correto para jogar
- ✅ Número igual de cartas para troca
- ✅ Não permitir 3 cartas iguais
- ✅ Verificação automática de vitória
- ✅ Controle de estados do jogo

## 🚀 Casos de Uso

### **Jogo Individual vs IA**

- **Prática**: Aprender as regras
- **Estratégia**: Desenvolver táticas
- **Diversão**: Jogar sozinho
- **Desafio**: Diferentes níveis de dificuldade

### **Educacional**

- **Regras claras**: Instruções integradas
- **Feedback visual**: Estados claros
- **Validações**: Prevenção de erros
- **Aprendizado**: Estratégias da IA

### **Futuro - Modo Multiplayer**

- **Duplas**: 2 jogadores por equipe
- **Competitivo**: Torneios
- **Social**: Jogar com amigos

## 📱 Responsividade

### **Layout Adaptativo**

- **Mobile**: Layout vertical otimizado
- **Tablet**: Grid 3 colunas
- **Desktop**: Layout completo

### **Tamanhos de Carta**

- **Mobile**: Tamanho pequeno (sm)
- **Tablet/Desktop**: Tamanho grande (lg)

## 🎯 Estratégias de Jogo

### **Dicas para Iniciantes**

1. **Observe a mesa**: Identifique cartas úteis
2. **Seja rápido**: Você tem apenas 8 segundos para descartar
3. **Planeje o descarte**: Escolha cartas que não formem grupos
4. **Conte o tempo**: Aproveite os 8 segundos
5. **Seja rápido**: Grite "Kem's" assim que possível
6. **Observe a IA**: Aprenda com suas estratégias

### **Estratégias Avançadas**

1. **Memorização**: Lembre-se das cartas descartadas
2. **Timing**: Use os 8 segundos a seu favor
3. **Bluff**: Faça trocas para confundir a IA
4. **Observação**: Identifique padrões da IA
5. **Adaptação**: Mude estratégia baseado na dificuldade
6. **Eficiência**: Descartar rapidamente para não perder tempo

### **Contra IA Difícil**

1. **Seja estratégico**: Não pegue cartas desnecessárias
2. **Observe padrões**: A IA tem estratégias consistentes
3. **Use o tempo**: Aproveite os 8 segundos
4. **Seja imprevisível**: Varie suas estratégias
5. **Descarte inteligente**: Mantenha cartas que formem grupos

## 🔮 Próximas Funcionalidades

### **Modo Multiplayer**

- [ ] **2-12 jogadores**: Suporte a múltiplos jogadores
- [ ] **Sistema de duplas**: Equipes de 2
- [ ] **Chat**: Comunicação em tempo real
- [ ] **Salas**: Criação de partidas

### **Melhorias de IA**

- [ ] **IA mais inteligente**: Algoritmos avançados
- [ ] **Diferentes personalidades**: Estilos de jogo variados
- [ ] **Sugestões**: Dicas de jogada
- [ ] **Análise**: Estatísticas de performance

### **Recursos Adicionais**

- [ ] **Sons**: Efeitos sonoros
- [ ] **Animações**: Movimentos de carta
- [ ] **Histórico**: Partidas anteriores
- [ ] **Ranking**: Sistema de pontuação
- [ ] **Replay**: Análise de partidas

## 🧪 Testes e Validação

### **Funcionalidades Testadas**

- ✅ Inicialização do jogo
- ✅ Distribuição de cartas
- ✅ Sistema de turnos
- ✅ Seleção de cartas
- ✅ Troca de cartas
- ✅ Validações de regras
- ✅ IA funcionando
- ✅ Contagem regressiva
- ✅ Verificação de vitória
- ✅ Sistema de pontuação

### **Build System**

- ✅ TypeScript: Compilação sem erros
- ✅ Vite: Build de produção bem-sucedido
- ✅ Lazy Loading: Página carrega sob demanda

## 📚 Documentação Relacionada

- **Componente de Baralho**: `docs/CARD_DECK_COMPONENT.md`
- **Otimizações**: `docs/BUNDLE_OPTIMIZATION.md`
- **Autenticação**: `docs/ANONYMOUS_AUTH.md`

## 🎉 Conclusão

O jogo Kem's foi **implementado com sucesso** no projeto Greaclos, oferecendo:

- 🎮 **Jogabilidade completa** com todas as regras
- 🤖 **IA inteligente** com 3 níveis de dificuldade
- 🎨 **Interface intuitiva** e responsiva
- ⚡ **Performance otimizada** com lazy loading
- 🔧 **Código limpo** e bem estruturado
- 📱 **Responsividade** para todos os dispositivos
- 🎯 **Sistema de turnos** funcional
- 🏆 **Competição real** contra IA

**Status**: ✅ **IMPLEMENTADO E FUNCIONAL**
**Qualidade**: 🟢 **EXCELENTE**
**IA**: 🤖 **INTELIGENTE E ADAPTATIVA**
**Pronto para**: 🎯 **JOGO COMPLETO VS IA**
 