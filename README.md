# ♻️ ReUse — Plataforma de Doações e Trocas

O **ReUse** é um projeto acadêmico de desenvolvimento web que busca incentivar o consumo consciente, a reutilização de objetos e a redução do desperdício. A plataforma conecta pessoas que desejam disponibilizar produtos que não utilizam mais a outras pessoas interessadas em recebê-los por **doação ou troca**.

Além do catálogo de anúncios, o sistema contempla o acompanhamento das solicitações, a comunicação entre os participantes e recursos para promover a confiança e a segurança da comunidade.

> **Estado do projeto:** aplicação em desenvolvimento, com diversas interações de usuário já implementadas no código. As funcionalidades descritas abaixo foram identificadas nos arquivos do repositório; sua operação em produção depende da configuração correta do servidor e do banco de dados.

## 🎯 Objetivo

Criar um ambiente digital acessível no qual os usuários possam anunciar itens, encontrar produtos disponíveis, solicitar doações e acompanhar o processo até a conclusão da entrega, contribuindo para a economia circular.

## 🧰 Tecnologias utilizadas

| Camada | Tecnologias | Finalidade |
| --- | --- | --- |
| Front-end | HTML5, CSS3 e JavaScript | Interface, formulários, navegação e interações |
| Back-end | PHP | Regras de negócio, validações, sessões e endpoints |
| Banco de dados | MySQL | Persistência de usuários, itens, solicitações e demais registros |
| Integração | Fetch API, FormData e JSON | Comunicação assíncrona entre navegador e servidor |

A arquitetura segue o fluxo **interface HTML → JavaScript → endpoints PHP → banco MySQL → resposta JSON → atualização da interface**, sem necessidade de recarregar a página para a maioria das operações.

## ✅ Funcionalidades implementadas e interações do usuário

### 1. Cadastro, autenticação e sessão

- Criar uma conta informando nome, e-mail, senha e confirmação de senha, com telefone e localização opcionais.
- Entrar na plataforma utilizando e-mail e senha.
- Permanecer autenticado por sessão PHP, com validação de sessão ao acessar o sistema.
- Encerrar a sessão pelo botão **Sair**.
- Receber mensagens de validação e de sucesso ou erro na interface.

O cadastro utiliza `password_hash()` para armazenar senhas com hash. A autenticação utiliza `password_verify()` e também contém compatibilidade com registros antigos em texto puro, convertendo-os para hash após login válido.

### 2. Exploração e busca de produtos

- Visualizar anúncios e informações como nome, descrição, categoria, estado de conservação, tipo de negociação e doador.
- Pesquisar produtos por nome, descrição ou categoria.
- Filtrar por categoria e estado de conservação (**Novo, Seminovo, Usado ou Desgastado**).
- Consultar o perfil do responsável pelo anúncio.
- Iniciar uma solicitação a partir de um produto disponível.
- Acessar a denúncia de um anúncio diretamente pelo catálogo.

### 3. Publicação de anúncios

- Cadastrar um produto com nome, descrição, categoria, conservação, negociação e localização.
- Escolher entre **Doação** e **Troca**.
- Definir se a localização será exibida publicamente.
- Enviar uma imagem JPG, PNG ou WebP de até **2 MB**.
- **Publicar anúncio** ou **salvar rascunho** para preenchimento posterior.

O código permite a criação de rascunhos, mas não foi identificada na interface atual uma funcionalidade completa de edição ou republicação de rascunhos.

### 4. Solicitações de produtos

**Para quem solicita:**
- Selecionar um produto disponível e clicar na ação de solicitação.
- Enviar uma mensagem ao responsável pelo anúncio.
- Consultar suas solicitações e acompanhar os respectivos status.

**Para quem anunciou:**
- Visualizar as solicitações recebidas para seus produtos.
- **Aprovar**, **reprovar** ou **excluir** solicitações pendentes.
- **Confirmar a entrega** de uma solicitação aprovada.
- Abrir a conversa com o solicitante e consultar seu perfil.

Ao aprovar uma solicitação, o produto passa para o estado **Reservado** e outras solicitações pendentes para o mesmo produto são reprovadas. Ao confirmar a entrega, o produto passa para **Concluído**.

**Pré-requisito:** para registrar uma solicitação, é necessário existir pelo menos um produto anunciado e disponível. O usuário não pode solicitar o próprio item.

### 5. Chat entre participantes

- Consultar conversas associadas a solicitações.
- Selecionar uma conversa e visualizar o histórico de mensagens.
- Enviar mensagens de até **300 caracteres**.
- Atualizar manualmente o histórico.
- Receber notificações quando uma nova mensagem for enviada.

O acesso às conversas é restrito aos participantes da solicitação. **O chat não é em tempo real por WebSocket**: as mensagens são carregadas por requisições à API, inclusive pelo botão de atualização.

### 6. Avaliações de produtos e usuários

- Avaliar produtos recebidos após uma doação concluída, com nota de **1 a 5 estrelas** e comentário opcional.
- Avaliar a pessoa envolvida na transação, seja doador ou recebedor.
- Consultar a reputação média e os comentários no perfil de outro usuário.
- Impedir avaliações duplicadas para a mesma transação, conforme as validações do back-end.

As opções de avaliação são disponibilizadas de acordo com as solicitações concluídas e elegíveis.

### 7. Perfil e conta

- Visualizar o próprio perfil.
- Alterar nome, e-mail, telefone e localização.
- Alterar a senha mediante confirmação da senha atual.
- Consultar perfis públicos, avaliações recebidas e reputação de outros participantes.

### 8. Notificações

- Consultar notificações relacionadas a solicitações e mensagens.
- Identificar notificações ainda não lidas.
- Marcar notificações como lidas.

### 9. Denúncias

- Denunciar um **anúncio** ou **usuário**.
- Informar o motivo da denúncia, como fraude, conteúdo inadequado, produto proibido ou assédio.
- Adicionar descrição e evidência em JPG, PNG, WebP ou PDF, até **2 MB**.
- Enviar a denúncia para registro e análise posterior.

O formulário e o registro da denúncia estão implementados; não foi identificado um painel administrativo de moderação neste pacote.

### 10. Medições e testes

- Visualizar a duração da última requisição à API.
- Acompanhar o maior tempo de resposta registrado na sessão da página.
- Consultar a quantidade de requisições medidas e o tempo de carregamento.
- Visualizar um histórico de endpoints, durações, códigos HTTP e horários.
- Exportar as medições em **CSV**.

Essas métricas são obtidas no navegador e não equivalem, isoladamente, a um teste de carga ou de desempenho do servidor.

## 🚧 Funcionalidades em desenvolvimento ou não integradas

### Campanhas de ONGs

O repositório contém scripts JavaScript para **listar, cadastrar, alterar e excluir campanhas** de organizações. Entretanto, a versão analisada não contém os endpoints PHP correspondentes na pasta esperada (`php/campanhas/`), e o módulo não aparece integrado ao `index.html` principal. Portanto, o CRUD de campanhas deve ser tratado como **parcial/não integrado**, até que o back-end e a interface estejam conectados e testados.

### Outros pontos para evolução

- Disponibilizar edição e gerenciamento completo dos anúncios e rascunhos.
- Implementar uma interface administrativa para análise e resolução de denúncias.
- Integrar e validar o módulo de campanhas de ONGs.
- Ampliar os testes automatizados e a documentação dos endpoints.
- Validar os fluxos completos em ambiente de homologação e produção.

## 🔄 Exemplo do fluxo de uso

1. Um usuário cria sua conta e acessa a plataforma.
2. Publica um item para doação, com descrição, categoria e estado de conservação.
3. Outro usuário encontra o item utilizando a busca e envia uma solicitação.
4. O anunciante visualiza o pedido, consulta o perfil do interessado e pode conversar pelo chat.
5. O anunciante aprova a solicitação, reservando o produto.
6. Após a entrega, o anunciante confirma sua conclusão no sistema.
7. Os participantes podem registrar avaliações, contribuindo para a reputação da comunidade.

## 🗂️ Estrutura do projeto

```text
Projeto-Reuse-main/
├── index.html                 # Interface principal
├── app.css                    # Estilos da aplicação
├── style.css                  # Estilos adicionais
├── app.js                     # Navegação, eventos e chamadas à API
├── js/
│   ├── avaliacoes/           # Scripts de avaliações
│   ├── campanhas/            # Scripts do módulo de campanhas (não integrado)
│   ├── produtos/             # Scripts de produtos
│   └── solicitacoes/         # Scripts de solicitações
├── php/                      # Endpoints e regras de negócio
│   ├── base.php              # Funções compartilhadas, sessão e proteção CSRF
│   ├── conexao.php           # Conexão com MySQL
│   ├── cadastro.php          # Cadastro de usuários
│   ├── login.php             # Autenticação
│   ├── produto_novo.php      # Publicação de itens
│   ├── produtos_get.php      # Consulta de itens
│   ├── solicitacao_novo.php  # Criação de solicitações
│   ├── solicitacao_decidir.php # Aprovação, recusa e conclusão
│   ├── chat_get.php          # Consulta de conversas
│   └── ...                   # Demais endpoints
├── uploads/                  # Imagens e evidências enviadas
├── Projeto Reuse.sql         # Script SQL do projeto
└── README.md                 # Documentação
```

## ⚙️ Como executar

1. Instale um ambiente com **PHP, MySQL e servidor HTTP** (por exemplo, XAMPP ou ambiente equivalente).
2. Copie o projeto para o diretório público do servidor.
3. Crie o banco e aplique o script `Projeto Reuse.sql`, conferindo se todas as tabelas e alterações necessárias estão presentes.
4. Configure `php/conexao.php` com os dados corretos do banco de desenvolvimento.
5. Garanta que o diretório `uploads/` tenha permissões adequadas para o processo do servidor.
6. Inicie o servidor e o MySQL e abra o endereço HTTP da aplicação, como `http://localhost/Projeto-Reuse-main/`.
7. Cadastre um usuário, entre na plataforma e teste os fluxos de anúncio e solicitação.

> **Importante:** não abra o `index.html` diretamente com `file://`: os endpoints PHP precisam de um servidor. A instalação também pode exigir ajustes no SQL conforme a versão do banco utilizado.

## 🔐 Segurança e cuidados com o repositório

O projeto contém validações de entrada, consultas preparadas em diversos endpoints, sessões, verificação de autorização, proteção CSRF para operações sensíveis e validação de arquivos enviados.


## 👥 Equipe e responsabilidades

| Integrante | Responsabilidade informada no README original |
| --- | --- |
| Erick Kenzo Tanaka Okumoto | CRUD de produtos |
| Eduardo Araújo Steigleder | CRUD de avaliações de usuários |
| João Victor Alves Benfica | CRUD de campanhas das ONGs |
| Rafael Siqueira Furlan | CRUD de solicitações |

As responsabilidades acima correspondem à divisão acadêmica registrada no README original e não significam, por si só, que todos os módulos estejam integrados nesta versão.

## 📌 Situação atual

O ReUse já possui uma interface web integrada a endpoints PHP para os principais fluxos de usuário: **cadastro, login, anúncios, solicitações, comunicação, avaliações, perfil, notificações e denúncias**. O projeto permanece em evolução, especialmente quanto à integração das campanhas de ONGs, à gestão de anúncios e aos testes de ponta a ponta.

---

**ReUse — Reutilizar é transformar. ♻️**
