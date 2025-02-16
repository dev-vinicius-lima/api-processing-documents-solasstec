# Document Processing System

#### Flow Example:

##### First shipment:

The document is created with the status "New".
The administrator sends the document to Department A.
The document status changes to "Sent".
The history records: "Sent to Department A".

##### Receiving in Sector A:

Sector A receives the document.
The document status changes to "Received".
The history records: "Received by Sector A".

##### Sending to Sector B:

Sector B receives the document.
The document status changes to "Received".
The history records: "Received by Sector B".

##### Receiving in Sector B:

O Setor B recebe o documento.
O status do documento muda para "Recebido".
O histórico registra: "Recebido pelo Setor B".

## Getting Started

### 📦 Installation

##### 1 - clone the project with git:

```bash
git clone git@github.com:dev-vinicius-lima/front-processing-documents-solasstec.git
```

##### 2 - Install the project libraries:

```bash
npm install
```

##### 3 - run the project with the command:

```bash
npm run dev
```

now the project is running at the url http://localhost:3000

---

#### Endpoints:

create new department...

```bash
POST => http://localhost:3333/departments

expects a body with the following json:
{
    "acronym": "Front End",
    "description": "Interface do Usuário"
}

response:
{
    "id": 14,
    "acronym": "Front End",
    "description": "Interface do Usuário"
}

```

Find All Department...

```bash
GET => http://localhost:3333/departments
response:
[
    {
        "id": 1,
        "acronym": "TI",
        "description": "Tecnologia da Informação"
    },
    {
        "id": 4,
        "acronym": "Front End",
        "description": "Interface do Usuário"
    },
]
```

Create New Document

```bash
POST => http://localhost:3333/documents

expects a body with the following FormData:
type: report
title: title
description: description
pdfFile: pdf
departmentId: 1

response:
{
    "id": 99,
    "type": "Relatorio 2",
    "title": "Relatorio anual 2",
    "description": "descrição do relatorio...",
    "file": "1739730370158-ViniciusLima2.0.pdf",
    "createdAt": "2025-02-16T18:26:10.231Z",
    "updatedAt": "2025-02-16T18:26:10.232Z",
    "departmentId": 4,
    "sectorShipping": "Front End",
    "isReceived": false,
    "dateTimeReceived": null
}
```

Send Document

```bash
POST => http://localhost:3333/documents/send

expects a body with the following Json:
{
    "documentId": 80,
    "receivingDepartmentId": 1
}

response:
{
    "id": 32,
    "documentId": 99,
    "sendingDept": 4,
    "receivingDept": 1,
    "dateTime": "2025-02-16T18:27:52.304Z",
    "departmentId": 4,
    "createdAt": "2025-02-16T18:27:52.304Z"
}
```

Received Document

```bash
POST => http://localhost:3333/documents/receive

expects a body with the following Json:
{
    "documentId": 80,
}

response:
{
    "message": "Documento recebido com sucesso",
    "historyEntry": {
        "id": 32,
        "documentId": 99,
        "sendingDept": 4,
        "receivingDept": 1,
        "dateTime": "2025-02-16T18:27:52.304Z",
        "departmentId": 4,
        "createdAt": "2025-02-16T18:27:52.304Z"
        }
}


```

Find By Number Document

```bash
GET => http://localhost:3333/documents/2

response:
{
    "id": 2,
    "type": "Relatorio 2",
    "title": "Relatorio anual",
    "description": "descrição do relatorio...",
    "file": "1739385629068-ViniciusLima2.0.pdf",
    "createdAt": "2025-02-12T18:40:29.074Z",
    "updatedAt": "2025-02-13T01:05:02.511Z",
    "departmentId": 1,
    "sectorShipping": null,
    "isReceived": true,
    "dateTimeReceived": "2025-02-14T20:00:04.900Z",
    "trackingHistory": [
        {
            "id": 7,
            "documentId": 2,
            "sendingDept": 1,
            "receivingDept": 4,
            "dateTime": "2025-02-14T13:55:26.389Z",
            "departmentId": 1,
            "createdAt": "2025-02-14T19:35:41.579Z",
            "sendingDeptRef": {
                "id": 1,
                "acronym": "TI",
                "description": "Tecnologia da Informação"
            },
            "receivingDeptRef": {
                "id": 4,
                "acronym": "Front End",
                "description": "Interface do Usuário"
            }
        }
    ],
    "status": "Recebido"
}


```

Received Document

```bash
POST => http://localhost:3333/documents/receive

expects a body with the following Json:
{
    "documentId": 80,
}

response:
{
    "message": "Documento recebido com sucesso",
    "historyEntry": {
        "id": 32,
        "documentId": 99,
        "sendingDept": 4,
        "receivingDept": 1,
        "dateTime": "2025-02-16T18:27:52.304Z",
        "departmentId": 4,
        "createdAt": "2025-02-16T18:27:52.304Z"
        }
}


```

Delete Document

```bash
DELETE => http://localhost:3333/documents/99

response:
{
    "message": "Documento deletado com sucesso"
}


```

Find All Document

```bash
GET => http://localhost:3333/documents
response:
[
    {
        "id": 66,
        "type": "Planilha",
        "title": "contas a pagar",
        "description": "descrição teste",
        "file": "1739660474057-Desafio Solasstec.pdf",
        "createdAt": "2025-02-15T23:01:14.067Z",
        "departmentId": 7,
        "number": "66",
        "sectorShipping": "Departamento de Contabilidade",
        "dateTimeSubmission": "2/15/2025, 7:01:14 PM",
        "ReceivingSector": "Recursos Humanos",
        "dateTimeReceived": "2/15/2025, 7:01:14 PM",
        "isSend": true,
        "isReceived": true,
        "status": "Recebido"
    },
    {
        "id": 75,
        "type": "Planilha",
        "title": "Planilha de contas a pagar",
        "description": "Planilha de contas a pagar fevereiro",
        "file": "1739667528397-Desafio Solasstec.pdf",
        "createdAt": "2025-02-16T00:58:48.412Z",
        "departmentId": 5,
        "number": "75",
        "sectorShipping": "Recursos Humanos",
        "dateTimeSubmission": "2/15/2025, 8:58:48 PM",
        "ReceivingSector": "Departamento de Contabilidade",
        "dateTimeReceived": "2/15/2025, 8:58:48 PM",
        "isSend": true,
        "isReceived": true,
        "status": "Recebido"
    },
    {
        "id": 2,
        "type": "Relatorio 2",
        "title": "Relatorio anual",
        "description": "descrição do relatorio...",
        "file": "1739385629068-ViniciusLima2.0.pdf",
        "createdAt": "2025-02-12T18:40:29.074Z",
        "departmentId": 1,
        "number": "2",
        "sectorShipping": "Tecnologia da Informação",
        "dateTimeSubmission": "2/12/2025, 2:40:29 PM",
        "ReceivingSector": "Interface do Usuário",
        "dateTimeReceived": "2/12/2025, 9:05:02 PM",
        "isSend": true,
        "isReceived": true,
        "status": "Recebido"
    },

]
```

Get History Document

```bash
GET => http://localhost:3333/documents/history

response:
[
    {
        "id": 66,
        "type": "Planilha",
        "title": "contas a pagar",
        "description": "descrição teste",
        "file": "1739660474057-Desafio Solasstec.pdf",
        "createdAt": "2025-02-15T23:01:14.067Z",
        "isReceived": true,
        "status": "Recebido",
        "history": [
            {
                "id": 66,
                "action": "Recebido pelo Setor Recursos Humanos",
                "date": "2025-02-15T23:04:13.442Z",
                "sendingDepartment": "Departamento de Contabilidade",
                "receivingDepartment": "Recursos Humanos"
            }
        ]
    },
    {
        "id": 75,
        "type": "Planilha",
        "title": "Planilha de contas a pagar",
        "description": "Planilha de contas a pagar fevereiro",
        "file": "1739667528397-Desafio Solasstec.pdf",
        "createdAt": "2025-02-16T00:58:48.412Z",
        "isReceived": true,
        "status": "Recebido",
        "history": [
            {
                "id": 75,
                "action": "Recebido pelo Setor Departamento de Contabilidade",
                "date": "2025-02-16T01:00:37.618Z",
                "sendingDepartment": "Recursos Humanos",
                "receivingDepartment": "Departamento de Contabilidade"
            }
        ]
    },
]


```

---

#### 🛠 Technologies.

   <img style="aling-itens: center" height="30" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJs">
  <img style="aling-itens: center" height="30" src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="ExpressJs">
  <img style="aling-itens: center" height="30" src="https://img.shields.io/badge/PRISMA_ORM-404D59?style=for-the-badge" alt="ExpressJs">
   <img style="aling-itens: center" height="30" src="https://img.shields.io/badge/POSTGRESQL-0201fc?style=for-the-badge" alt="postgresql">

---

### 👩‍💻 IDE

<div style="display: inline block"><br/>
   <img style="aling-itens: center" height="35" src="https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white" alt="VS-code">
</div>
