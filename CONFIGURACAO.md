# 🔑 Configuração da API Key - TMDB

## ⚠️ IMPORTANTE: Este passo é OBRIGATÓRIO para o funcionamento da aplicação!

### 📋 Passo a Passo:

1. **Acesse o TMDB**
   - Vá para: https://www.themoviedb.org/
   - Clique em "Sign Up" para criar uma conta gratuita

2. **Crie sua conta**
   - Preencha os dados solicitados
   - Confirme seu email

3. **Acesse as configurações da API**
   - Faça login na sua conta
   - Clique no seu avatar (canto superior direito)
   - Vá em "Settings" > "API"

4. **Solicite uma API Key**
   - Clique em "Create" para uma nova API Key
   - Selecione "Developer" como tipo
   - Preencha as informações solicitadas
   - Aceite os termos de uso

5. **Copie sua API Key**
   - A chave será algo como: `1234567890abcdef1234567890abcdef`
   - **Guarde esta chave em um local seguro!**

6. **Configure no projeto**
   - Abra o arquivo: `src/services/tmdbApi.ts`
   - Localize a linha: `const API_KEY = 'sua_chave_api_aqui'`
   - Substitua `'sua_chave_api_aqui'` pela sua chave real
   - Exemplo: `const API_KEY = '1234567890abcdef1234567890abcdef'`

7. **Salve o arquivo e reinicie o servidor**
   ```bash
   # Pare o servidor (Ctrl+C)
   npm run dev
   ```

### ✅ Verificação:

Após configurar, você deve ver:

- Filmes carregando na página inicial
- Busca funcionando
- Detalhes dos filmes sendo exibidos
- Sem erros no console do navegador

### 🚨 Problemas Comuns:

- **"Erro ao carregar filmes populares"**: API Key incorreta ou não configurada
- **"401 Unauthorized"**: API Key inválida
- **"429 Too Many Requests"**: Limite de requisições atingido (aguarde alguns minutos)

### 📞 Suporte:

Se ainda tiver problemas:

1. Verifique se a API Key está correta
2. Confirme se a conta TMDB está ativa
3. Verifique o console do navegador para erros específicos
4. Aguarde alguns minutos se atingir o limite de requisições

---

**🎬 Após configurar, sua aplicação de filmes estará funcionando perfeitamente!**
