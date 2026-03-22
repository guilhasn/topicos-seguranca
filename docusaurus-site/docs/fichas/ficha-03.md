---
title: Ficha 03 - ProtocolSI e Threads
sidebar_position: 3
---

# Ficha 03 - ProtocolSI e Threads

## Materiais do aluno

- [Enunciado PDF](/fichas/ficha-03/TS-FichaPratica03.pdf)

## Objetivos

- Compreender o papel da biblioteca `ProtocolSI` em TCP.
- Implementar comunicacao Cliente/Servidor com mensagens tipadas.
- Permitir ligacao de varios clientes em paralelo ao servidor.
- Entender como usar `Thread` para tratar clientes em simultaneo.
- Perceber o ciclo de vida de uma ligacao (`DATA`, `ACK`, `EOT`).

## Cenario da ficha

- Servidor em Console Application, a escuta numa porta TCP.
- Um ou mais clientes (Windows Forms) enviam frases.
- O servidor mostra no terminal o que cada cliente envia.
- No fim da comunicacao, o cliente envia `EOT` e o servidor responde `ACK`.

## Conceitos essenciais de Threads (explicacao simples)

### Processo vs Thread

- `Processo`: programa em execucao (ex.: aplicacao servidor).
- `Thread`: "linha de trabalho" dentro do processo.

Um processo pode ter varias threads a correr ao mesmo tempo.

### Porque precisamos de Thread aqui?

Se o servidor tratar todos os clientes na mesma thread:
- um cliente lento bloqueia os restantes;
- o servidor deixa de responder de forma fluida.

Com uma thread por cliente:
- cada cliente e tratado em paralelo;
- a thread principal continua livre para aceitar novos clientes.

### Modelo mental rapido

- Thread principal do servidor:
- aceita clientes (`AcceptTcpClient`).
- Para cada cliente novo:
- cria `ClientHandler`.
- `ClientHandler` arranca uma `Thread`.
- Essa thread trata apenas aquele cliente.

## Codigo de referencia (esqueleto didatico)

### Servidor (estrutura principal)

```csharp
TcpListener listener = new TcpListener(new IPEndPoint(IPAddress.Any, 10000));
listener.Start();

while (true)
{
    TcpClient client = listener.AcceptTcpClient();
    ClientHandler handler = new ClientHandler(client);
    handler.Handle();
}
```

### Handler com Thread por cliente

```csharp
class ClientHandler
{
    private readonly TcpClient client;

    public ClientHandler(TcpClient client)
    {
        this.client = client;
    }

    public void Handle()
    {
        Thread t = new Thread(ThreadHandler);
        t.Start();
    }

    private void ThreadHandler()
    {
        NetworkStream stream = client.GetStream();
        ProtocolSI protocolSI = new ProtocolSI();

        while (protocolSI.GetCmdType() != ProtocolSICmdType.EOT)
        {
            int bytesRead = stream.Read(protocolSI.Buffer, 0, protocolSI.Buffer.Length);

            switch (protocolSI.GetCmdType())
            {
                case ProtocolSICmdType.DATA:
                    string msg = protocolSI.GetStringFromData();
                    Console.WriteLine(msg);
                    byte[] ack = protocolSI.Make(ProtocolSICmdType.ACK);
                    stream.Write(ack, 0, ack.Length);
                    break;

                case ProtocolSICmdType.EOT:
                    byte[] ackEot = protocolSI.Make(ProtocolSICmdType.ACK);
                    stream.Write(ackEot, 0, ackEot.Length);
                    break;
            }
        }

        stream.Close();
        client.Close();
    }
}
```

### Cliente (envio com ProtocolSI)

```csharp
ProtocolSI protocolSI = new ProtocolSI();
byte[] packet = protocolSI.Make(ProtocolSICmdType.DATA, msg);
networkStream.Write(packet, 0, packet.Length);

while (protocolSI.GetCmdType() != ProtocolSICmdType.ACK)
{
    networkStream.Read(protocolSI.Buffer, 0, protocolSI.Buffer.Length);
}
```

## Mapa de conceitos C# desta ficha

### Classe: `ProtocolSI`
- O que e: ajuda a criar e interpretar pacotes de comunicacao.
- Metodos principais:
- `Make(tipo, dados?)`: cria pacote para enviar.
- `GetCmdType()`: diz que tipo de comando foi recebido.
- `GetStringFromData()`: extrai string do pacote recebido.
- Propriedade:
- `Buffer`: zona de memoria para receber pacote.

### Enum: `ProtocolSICmdType`
- O que e: lista de tipos de mensagem do protocolo.
- Tipos usados nesta ficha:
- `DATA` (mensagem normal)
- `ACK` (confirmacao)
- `EOT` (fim da transmissao)

### Classe: `Thread`
- O que e: representa uma thread de execucao.
- Metodos usados:
- `new Thread(ThreadStart)`: cria thread.
- `Start()`: arranca thread.

### Classe: `TcpListener`
- O que e: servidor TCP a escuta.
- Metodos principais:
- `Start()`: inicia escuta.
- `AcceptTcpClient()`: aceita cliente.

### Classe: `TcpClient`
- O que e: ligacao TCP de um cliente.
- Metodo relevante:
- `GetStream()`: devolve `NetworkStream` para comunicar.

### Classe: `NetworkStream`
- O que e: stream para enviar/receber bytes na rede.
- Metodos usados:
- `Read(...)`: recebe dados.
- `Write(...)`: envia dados.
- `Close()`: fecha stream.

## Fluxo de comunicacao (aluno deve entender)

1. Cliente liga ao servidor.
2. Cliente envia pacote `DATA`.
3. Servidor le, interpreta e apresenta mensagem.
4. Servidor responde com `ACK`.
5. Cliente envia nova mensagem ou termina com `EOT`.
6. Servidor responde `ACK` ao `EOT` e fecha ligacao.

## Pontos de seguranca

- Validar dados recebidos antes de processar.
- Definir timeouts para evitar bloqueios permanentes.
- Garantir `Close()` em streams e sockets no final.
- Limitar numero de clientes concorrentes em cenarios reais.
- Evitar logar dados sensiveis sem necessidade.

## Erros comuns

- Esquecer `ACK` e ficar com cliente bloqueado a espera.
- Ler do stream sem verificar bytes recebidos.
- Criar handler sem `Thread` e bloquear novos clientes.
- Usar o mesmo `ProtocolSI` partilhado por varias threads.
- Nao fechar ligacao no `EOT`.

## Mini desafio

1. Identificar cada cliente por nome e mostrar "cliente X: mensagem".
2. Adicionar timestamp a cada mensagem no servidor.
3. Fazer broadcast: servidor envia a mensagem recebida para todos os clientes ligados.
4. Trocar `Thread` por `Task` e comparar o modelo de concorrencia.
