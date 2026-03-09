# OrdemS

![Angular](https://img.shields.io/badge/Angular-18-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Node](https://img.shields.io/badge/Node.js-20+-green)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

Sistema web para **gerenciamento de ordens de serviço**, desenvolvido com **Angular**.  
O objetivo da aplicação é permitir o controle, visualização e organização de atendimentos ou serviços realizados para clientes.

---

<p align="center">
<img width="600" alt="Mockup 16" src="https://github.com/user-attachments/assets/10920a7a-42bf-4603-86bf-5aa8b4b2e524" />
<img width="600" alt="Mockup 16-1" src="https://github.com/user-attachments/assets/13e81101-b9c7-43e2-abb9-387ce0ba0a18" />
<img width="600" alt="Mockup 16-2" src="https://github.com/user-attachments/assets/d7aa9a3f-de52-4de1-a9d6-8c79080d703a" />
</p>

---

# 📌 Sobre o projeto

O **OrdemS** é uma aplicação frontend que permite registrar e acompanhar **ordens de serviço (OS)** de maneira estruturada.

A proposta do sistema é facilitar o controle de serviços executados por empresas ou profissionais que precisam:

- Registrar solicitações de serviço
- Acompanhar status de execução
- Organizar informações de clientes
- Controlar histórico de atendimentos

Esse tipo de sistema é comum em áreas como:

- assistência técnica
- manutenção
- suporte técnico
- serviços de campo
- prestadores de serviço em geral

---

# ⚙️ Funcionalidades do sistema

O sistema foi projetado para fornecer uma interface simples e eficiente para gerenciamento de ordens.

Entre as funcionalidades esperadas estão:

### 📄 Gestão de Ordens de Serviço

- criação de novas ordens
- visualização das ordens cadastradas
- acompanhamento do status da ordem
- histórico de serviços realizados

### 👤 Gestão de Clientes

- registro de informações do cliente
- associação de clientes às ordens de serviço

---

# 🚀 Tecnologias utilizadas

O projeto foi desenvolvido utilizando tecnologias modernas de frontend.

- **Angular**
- **TypeScript**
- **HTML5**
- **CSS / SCSS**
- **Node.js**
- **Angular CLI**
- **PrimeNG**

Ferramentas de desenvolvimento:

- Angular CLI
- npm

---

# 📂 Estrutura do projeto

```
OrdemS
│
├── public/              # Arquivos públicos
├── src/
│   ├── app/             # Componentes, módulos, enums, models, pages e serviços
|      |── components/
|      |── enums/
|      |── ferramentas/
|      |── models/
|      |── pages/
|      |── services/
|      |── app.component.css
|      |── app.component.html
|      |── app.component.ts
|      |── app.config.ts
|      |── app.routes.ts
|
│   ├── environments/    # Configurações de ambiente
│   |── index.html
|   |── style.css
|   |── main.ts
│
├── angular.json         # Configuração do Angular
├── package.json         # Dependências do projeto
├── tsconfig.json        # Configurações do TypeScript
└── README.md
```

---

# 🧰 Pré-requisitos

Antes de executar o projeto é necessário ter instalado:

- **Node.js**
- **npm**
- **Angular CLI**

Instalar Angular CLI:

```bash
npm install -g @angular/cli
```

---

# ▶️ Executando o projeto

### 1 — Clone o repositório

```bash
git clone https://github.com/BrendomGoncalves/OrdemS.git
```

### 2 — Acesse a pasta

```bash
cd OrdemS
```

### 3 — Instale as dependências

```bash
npm install
```

### 4 — Execute o projeto

```bash
ng serve
```

A aplicação ficará disponível em:

```
http://localhost:4200
```

---

# 📌 Possíveis melhorias futuras

Algumas melhorias que podem ser implementadas no sistema:

- autenticação de usuários
- controle de permissões
- backup de dados manual

---

# 👨‍💻 Autor

Desenvolvido por **Brendom Gonçalves**

GitHub  
https://github.com/BrendomGoncalves
