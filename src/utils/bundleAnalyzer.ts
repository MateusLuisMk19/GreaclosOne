// Utilitário para análise de bundle (usado apenas em desenvolvimento)
export const analyzeBundle = () => {
  if (process.env.NODE_ENV === 'development') {
    // Aqui você pode adicionar lógica para análise de bundle
    console.log('Bundle analysis available in development mode');
  }
};

// Função para verificar tamanho de imports
export const checkImportSize = (moduleName: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Importing: ${moduleName}`);
  }
}; 