# Otimização de Bundle - Greaclos

## Visão Geral

Este documento descreve as otimizações implementadas para reduzir o tamanho do bundle e melhorar a performance da aplicação.

## Otimizações Implementadas

### 1. **Code Splitting com Lazy Loading**

- ✅ Todas as páginas principais carregam sob demanda
- ✅ Suspense com LoadingSpinner para melhor UX
- ✅ Redução significativa do bundle inicial

### 2. **Manual Chunks no Vite**

```typescript
manualChunks: {
  vendor: ['react', 'react-dom'],
  router: ['react-router-dom'],
  firebase: ['firebase'],
  ui: ['lucide-react', 'framer-motion'],
}
```

### 3. **Minificação Avançada**

- ✅ ESBuild para minificação otimizada (mais rápida que Terser)
- ✅ Configuração otimizada para produção
- ✅ Remoção automática de código morto

### 4. **Otimização de Dependências**

- ✅ Pre-bundling de dependências comuns
- ✅ Exclusão de lucide-react do pre-bundling
- ✅ Inclusão explícita de React e React Router

## Como Usar

### Build Normal

```bash
npm run build
```

### Build com Análise

```bash
npm run build:analyze
```

### Desenvolvimento

```bash
npm run dev
```

## Estrutura de Chunks

Após o build, você terá chunks separados:

1. **vendor.js** - React e React DOM
2. **router.js** - React Router
3. **firebase.js** - Firebase SDK
4. **ui.js** - Lucide React e Framer Motion
5. **index.js** - Código da aplicação principal
6. **páginas individuais** - Cada página como chunk separado

## Benefícios

### Performance

- ⚡ Carregamento inicial mais rápido
- ⚡ Cache mais eficiente (chunks separados)
- ⚡ Menor uso de memória

### UX

- 🎯 Loading states visuais
- 🎯 Carregamento progressivo
- 🎯 Melhor experiência em conexões lentas

### Manutenibilidade

- 🔧 Chunks organizados por funcionalidade
- 🔧 Fácil identificação de dependências pesadas
- 🔧 Análise de bundle automatizada

## Monitoramento

### Script de Análise

O script `build:analyze` mostra:

- Tamanho de cada arquivo gerado
- Comparação em KB e MB
- Identificação de chunks grandes

### Vite DevTools

Use as ferramentas de desenvolvimento do Vite para:

- Analisar imports
- Verificar tree shaking
- Monitorar hot reload

## Próximas Otimizações

- [ ] Implementar Service Worker para cache
- [ ] Otimizar imagens e assets
- [ ] Implementar preloading de rotas críticas
- [ ] Adicionar compressão gzip/brotli
- [ ] Implementar critical CSS inlining

## Troubleshooting

### Chunks Muito Grandes

1. Verifique imports desnecessários
2. Use dynamic imports para componentes pesados
3. Considere usar bibliotecas alternativas mais leves

### Performance Lenta

1. Execute `npm run build:analyze`
2. Verifique se o lazy loading está funcionando
3. Monitore o Network tab no DevTools

### Erros de Build

1. Verifique se todos os imports estão corretos
2. Confirme que as dependências estão instaladas
3. Limpe o cache: `rm -rf node_modules/.vite`
 