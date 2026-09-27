# Knowledge Repository

Repositório de conhecimento onde usuários publicam materiais de estudo, comentam e anexam arquivos. Feito com API própria em Java e interface web em Next.js.

## Estrutura

- `api/`: API em Java com Spring Boot
- `ui/`: interface web em Next.js
- `docker-compose.yaml`: sobe API, front-end e banco de dados juntos

## Funcionalidades

- Cadastro e login de usuários, com autenticação via JWT
- Publicação de materiais de estudo (título, conteúdo, disciplina e curso)
- Comentários nos materiais, com suporte a respostas (comentários dentro de comentários)
- Anexo de arquivos aos materiais
- Curtidas e contagem de visualizações nos materiais e comentários

## Como rodar

1. Copie o `.env-example` para `.env` e preencha as variáveis (dados do banco e chave JWT)
2. Rode:

```bash
docker compose up -d
```

3. A API sobe em `http://localhost:8080` e a interface em `http://localhost:3000`

## Tecnologias

**API**
- Java 21 + Spring Boot
- Spring Security (OAuth2 Resource Server) + JWT
- PostgreSQL + Liquibase (controle de migrações)

**Interface**
- Next.js + React
- Tailwind CSS

**Infra**
- Docker e Docker Compose

## Licença

Veja o arquivo `LICENSE`.