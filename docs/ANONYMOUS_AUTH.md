# Autenticação Anônima - Greaclos

## Visão Geral

O projeto Greaclos agora suporta autenticação anônima através do Firebase, permitindo que usuários joguem sem criar uma conta permanente.

## Funcionalidades Implementadas

### 1. Login Anônimo

- Botão "Jogar como Visitante" nas páginas de login e signup
- Criação automática de perfil anônimo no Firestore
- Geração de nome de usuário aleatório (ex: "Jogador1234")

### 2. Interface do Usuário

- Indicador visual "Anônimo" no header para usuários anônimos
- Seção especial na página de perfil com avisos e opções de upgrade
- Componente de aviso reutilizável para diferentes contextos

### 3. Gerenciamento de Estado

- Hook personalizado `useAnonymousLogin` para gerenciar login anônimo
- Integração com o AuthContext existente
- Redirecionamento automático para `/games` após login

## Como Usar

### Para Usuários

1. Acesse `/login` ou `/signup`
2. Clique em "Jogar como Visitante"
3. Você será automaticamente logado e redirecionado para os jogos
4. Seu progresso será salvo temporariamente

### Para Desenvolvedores

#### Hook de Login Anônimo

```typescript
import { useAnonymousLogin } from "../hooks/useAnonymousLogin";

const MyComponent = () => {
  const { handleAnonymousLogin, isLoading } = useAnonymousLogin();

  return (
    <button onClick={handleAnonymousLogin} disabled={isLoading}>
      Login Anônimo
    </button>
  );
};
```

#### Componente de Aviso

```typescript
import AnonymousWarning from '../components/auth/AnonymousWarning';

// Aviso informativo
<AnonymousWarning type="info" />

// Aviso de limitação
<AnonymousWarning type="warning" />
```

## Estrutura de Dados

### Perfil Anônimo no Firestore

```typescript
{
  username: "Jogador1234",
  age: 0,
  email: "",
  isAnonymous: true,
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## Limitações

- Contas anônimas podem ter dados perdidos se o usuário limpar o cache
- Algumas funcionalidades avançadas podem não estar disponíveis
- Não é possível recuperar uma conta anônima perdida

## Troubleshooting

### Erro: "Maximum call stack size exceeded"

**Problema**: Recursão infinita na função `signInAnonymously`

**Causa**: Conflito de nomes entre a função local e a função do Firebase

**Solução**: A função local foi renomeada para `handleAnonymousLogin` para evitar conflito

**Código corrigido**:

```typescript
// ❌ ANTES (causava recursão infinita)
const signInAnonymously = async () => {
  const result = await signInAnonymously(auth); // Chamava a si mesma!
};

// ✅ DEPOIS (funciona corretamente)
const handleAnonymousLogin = async () => {
  const result = await signInAnonymously(auth); // Chama a função do Firebase
};
```

### Outros Problemas Comuns

1. **Erro de permissão no Firestore**

   - Verifique as regras de segurança do Firestore
   - Certifique-se de que usuários anônimos podem criar documentos

2. **Erro de configuração do Firebase**
   - Confirme que a autenticação anônima está habilitada
   - Verifique se as configurações do Firebase estão corretas

## Próximos Passos

- [ ] Implementar conversão de conta anônima para permanente
- [ ] Adicionar backup de dados para contas anônimas
- [ ] Implementar sincronização de progresso entre dispositivos
- [ ] Adicionar mais opções de personalização para usuários anônimos

## Configuração do Firebase

Certifique-se de que a autenticação anônima está habilitada no console do Firebase:

1. Acesse o Console do Firebase
2. Vá para Authentication > Sign-in method
3. Habilite "Anonymous" como provedor de autenticação
4. Configure as regras do Firestore para permitir acesso anônimo se necessário
