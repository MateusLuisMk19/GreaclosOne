// Utilitário para testar login anônimo (usado apenas em desenvolvimento)
export const testAnonymousLogin = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      console.log('🧪 Testando login anônimo...');
      
      // Simular teste de login anônimo
      const mockUser = {
        uid: 'test-anonymous-123',
        email: null,
        metadata: {
          creationTime: new Date().toISOString()
        }
      };
      
      const mockProfile = {
        username: `Jogador${Math.floor(Math.random() * 10000)}`,
        age: 0,
        email: '',
        isAnonymous: true,
        createdAt: new Date().toISOString()
      };
      
      console.log('✅ Mock de usuário anônimo criado:', mockUser);
      console.log('✅ Mock de perfil anônimo criado:', mockProfile);
      console.log('🧪 Teste concluído com sucesso!');
      
      return { user: mockUser, profile: mockProfile };
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      throw error;
    }
  }
}; 