# O Que Ver - App de Filmes

> 🎬 Descubra seu próximo filme favorito com filtros personalizados ou sorteio aleatório! App Vue.js para explorar o universo cinematográfico.

App para descobrir filmes com filtros personalizados ou sorteio aleatório. Construído com Vue 3, TypeScript e integração com a API do TMDB.

## Funcionalidades

- **Página inicial** com filmes populares e em cartaz
- **Busca avançada** com filtros por gênero, ano e duração
- **Sorteio aleatório** de filmes baseado em critérios
- **Detalhes completos** de cada filme
- **Design responsivo** para mobile e desktop

## Tecnologias

- Vue 3 + TypeScript
- Pinia para estado
- Vue Router
- PrimeVue para UI
- Vite para build

## Como usar

1. **Instale as dependências**

   ```bash
   npm install
   ```

2. **Configure a API Key do TMDB**
   - Crie uma conta em [themoviedb.org](https://www.themoviedb.org/)
   - Vá em Settings > API e solicite uma chave
   - Crie um arquivo `.env` na raiz do projeto:

   ```
   VITE_TMDB_API_KEY=sua_chave_aqui
   ```

3. **Execute o projeto**

   ```bash
   npm run dev
   ```

4. **Acesse** http://localhost:3000

## Scripts

- `npm run dev` - Desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Linter

## Estrutura

```
src/
├── components/     # Componentes reutilizáveis
├── views/         # Páginas da aplicação
├── stores/        # Estado com Pinia
├── services/      # API do TMDB
└── router/        # Configuração de rotas
```
