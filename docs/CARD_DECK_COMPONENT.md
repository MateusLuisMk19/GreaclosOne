# Componente de Baralho de Cartas - Greaclos

## Visão Geral

O componente de baralho de cartas é uma solução reutilizável para jogos de cartas futuros no projeto Greaclos. Ele fornece todas as funcionalidades necessárias para gerenciar um baralho de 52 cartas com opções de personalização.

## 🎴 Características

### ✅ **Funcionalidades Principais**

- **52 cartas padrão** (A, 2-10, J, Q, K) + 2 Jokers
- **4 naipes**: ♥️ Copas, ♦️ Ouros, ♣️ Paus, ♠️ Espadas
- **Opções de exclusão**: Sem 8s, 9s, 10s (Burros) ou Jokers
- **Design responsivo** com 3 tamanhos (sm, md, lg)
- **Interatividade**: Seleção, clique e estados visuais

### 🎨 **Design do Site**

- **Cores**: Vermelho para copas/ouros, preto para paus/espadas
- **Estilo**: Gradientes, sombras e animações hover
- **Branding**: Logo "GREACLOS CARDS" nas cartas viradas
- **Responsivo**: Adapta-se a diferentes tamanhos de tela

## 🧩 Componentes Disponíveis

### 1. **PlayingCard** - Carta Individual

```typescript
interface CardProps {
  card: Card;
  isFaceDown?: boolean; // Carta virada
  isSelected?: boolean; // Carta selecionada
  isPlayable?: boolean; // Carta jogável
  onClick?: (card: Card) => void;
  className?: string;
  size?: "sm" | "md" | "lg"; // Tamanho da carta
}
```

### 2. **Deck** - Baralho Completo

```typescript
interface DeckProps {
  options?: DeckOptions; // Opções de exclusão
  onCardClick?: (card: Card) => void;
  className?: string;
  showAllCards?: boolean; // Mostrar todas as cartas
  selectedCards?: Card[]; // Cartas selecionadas
  playableCards?: Card[]; // Cartas jogáveis
}
```

### 3. **Hand** - Mão de Cartas

```typescript
interface HandProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}
```

### 4. **CardPile** - Pilha de Cartas

```typescript
interface CardPileProps {
  cards: Card[];
  isFaceDown?: boolean; // Cartas viradas
  className?: string;
  size?: "sm" | "md" | "lg";
}
```

## ⚙️ Opções de Configuração

### **DeckOptions**

```typescript
interface DeckOptions {
  excludeEights?: boolean; // Sem 8s (Burros)
  excludeNines?: boolean; // Sem 9s (Burros)
  excludeTens?: boolean; // Sem 10s (Burros)
  excludeJokers?: boolean; // Sem Jokers
  customExclusions?: string[]; // Exclusões customizadas
}
```

### **Exemplos de Uso**

```typescript
// Baralho padrão (54 cartas)
const standardDeck = generateDeck();

// Baralho sem Burros (40 cartas)
const noBurrosDeck = generateDeck({
  excludeEights: true,
  excludeNines: true,
  excludeTens: true,
});

// Baralho sem Jokers (52 cartas)
const noJokersDeck = generateDeck({
  excludeJokers: true,
});

// Baralho customizado
const customDeck = generateDeck({
  excludeEights: true,
  customExclusions: ["2", "3", "4"],
});
```

## 🚀 Como Usar

### **Importação Básica**

```typescript
import {
  PlayingCard,
  Deck,
  Hand,
  CardPile,
  generateDeck,
  shuffleDeck,
  dealCards,
  type Card,
  type DeckOptions,
} from "./shared";
```

### **Exemplo Simples**

```typescript
const MyCardGame = () => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  return (
    <div>
      <PlayingCard
        card={{
          id: "hearts-A",
          suit: "hearts",
          rank: "A",
          value: 1,
          displayName: "Ace of Hearts",
        }}
        onClick={setSelectedCard}
        size="lg"
      />
    </div>
  );
};
```

### **Exemplo de Mão**

```typescript
const PlayerHand = ({ cards }: { cards: Card[] }) => {
  return (
    <Hand
      cards={cards}
      onCardClick={(card) => console.log("Carta clicada:", card)}
      size="md"
      className="justify-center"
    />
  );
};
```

### **Exemplo de Baralho**

```typescript
const GameDeck = () => {
  const handleCardClick = (card: Card) => {
    console.log("Carta selecionada:", card);
  };

  return (
    <Deck
      options={{ excludeJokers: true }}
      onCardClick={handleCardClick}
      showAllCards={true}
    />
  );
};
```

## 🎯 Casos de Uso

### **1. Jogos de Truco**

```typescript
// Baralho sem 8s, 9s e 10s
const trucoDeck = generateDeck({
  excludeEights: true,
  excludeNines: true,
  excludeTens: true,
});
```

### **2. Jogos de Poker**

```typescript
// Baralho padrão com Jokers
const pokerDeck = generateDeck();
```

### **3. Jogos de Canastra**

```typescript
// Baralho duplo (2 baralhos)
const canastaDeck = [...generateDeck(), ...generateDeck()];
```

### **4. Jogos de Paciência**

```typescript
// Baralho padrão sem Jokers
const solitaireDeck = generateDeck({ excludeJokers: true });
```

## 🔧 Funções Utilitárias

### **generateDeck(options)**

- Gera um baralho com base nas opções fornecidas
- Retorna array de cartas

### **shuffleDeck(deck)**

- Embaralha o baralho usando algoritmo Fisher-Yates
- Retorna novo array embaralhado

### **dealCards(deck, numPlayers, cardsPerPlayer)**

- Distribui cartas para múltiplos jogadores
- Retorna array de mãos

## 📱 Responsividade

### **Tamanhos de Carta**

- **sm**: 48x64px (mobile)
- **md**: 64x80px (tablet)
- **lg**: 80x112px (desktop)

### **Grid Responsivo**

- **Mobile**: 1 coluna
- **Tablet**: 2-3 colunas
- **Desktop**: 4+ colunas

## 🎨 Personalização

### **CSS Customizável**

```typescript
<PlayingCard card={card} className="custom-card-styles" size="lg" />
```

### **Estados Visuais**

- **Normal**: Carta padrão
- **Selecionada**: Ring azul e sombra
- **Não jogável**: Opacidade reduzida
- **Virada**: Design do Greaclos

## 🧪 Testes e Exemplos

### **Componente de Exemplo**

- `CardGameExample.tsx` - Demonstração completa
- Interativo com todas as funcionalidades
- Configurações em tempo real

### **Como Testar**

1. Importe o componente
2. Configure as opções desejadas
3. Teste as interações
4. Verifique a responsividade

## 🔮 Próximos Passos

- [ ] Adicionar animações de flip
- [ ] Implementar drag & drop
- [ ] Adicionar sons de carta
- [ ] Criar temas de cores
- [ ] Adicionar suporte a baralhos especiais

## 📚 Referências

- **Lucide React**: Ícones dos naipes
- **Tailwind CSS**: Estilos e responsividade
- **TypeScript**: Tipagem forte e interfaces
- **React**: Componentes funcionais e hooks

## 🎉 Conclusão

O componente de baralho está pronto para uso em jogos futuros, oferecendo:

- ✅ **Flexibilidade total** para diferentes tipos de jogo
- ✅ **Design consistente** com o site Greaclos
- ✅ **Performance otimizada** com lazy loading
- ✅ **Fácil manutenção** e extensibilidade

**Status**: ✅ **PRONTO PARA USO**
**Compatibilidade**: 🟢 **100%**
**Documentação**: ✅ **COMPLETA**
