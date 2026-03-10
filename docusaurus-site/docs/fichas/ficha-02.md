---
title: Ficha 02 - Sockets TCP
tags: [tcp, sockets, client-server]
sidebar_position: 2
---

# Ficha 02 - Sockets TCP

## Materiais do aluno

- [Enunciado PDF](/fichas/ficha-02/TS-FichaPratica02.pdf)

## Objetivos

- Criar arquitetura Cliente/Servidor com TCP.
- Implementar um cliente Windows Forms.
- Implementar 3 servidores Console em portas diferentes.
- Enviar e receber dados com `NetworkStream`.
- Serializar texto para bytes com `Encoding.UTF8`.

## Cenario da ficha

- Cliente (Windows Forms) envia pedidos para:
1. Servidor 1 (`50001`): recebe inteiro `x` e devolve `(x+2)*3`.
2. Servidor 2 (`50002`): recebe string e devolve numero de caracteres.
3. Servidor 3 (`50003`): recebe string cifrada (Cesar) e devolve texto decifrado.

## Estrutura sugerida de projetos

1. Solucao `Ficha2-Client` (Windows Forms).
2. Solucao `Ficha2-Servers` com:
- `Ficha2-Server1` (Console)
- `Ficha2-Server2` (Console)
- `Ficha2-Server3` (Console)

## Cliente - esqueleto recomendado

```csharp
private string EnviarDados(string message, string ipAddress, string ipPort)
{
    TcpClient tcpClient = null;
    NetworkStream networkStream = null;

    try
    {
        IPEndPoint endPoint = new IPEndPoint(IPAddress.Parse(ipAddress), int.Parse(ipPort));
        tcpClient = new TcpClient();
        tcpClient.Connect(endPoint);

        networkStream = tcpClient.GetStream();

        byte[] msgBytes = Encoding.UTF8.GetBytes(message);
        networkStream.Write(msgBytes, 0, msgBytes.Length);

        byte[] responseBuffer = new byte[tcpClient.ReceiveBufferSize];
        int bytesRead = networkStream.Read(responseBuffer, 0, responseBuffer.Length);

        return Encoding.UTF8.GetString(responseBuffer, 0, bytesRead);
    }
    catch
    {
        return "ERRO";
    }
    finally
    {
        if (networkStream != null) networkStream.Close();
        if (tcpClient != null) tcpClient.Close();
    }
}
```

## Servidor - esqueleto base

```csharp
TcpListener tcpListener = null;
TcpClient tcpClient = null;
NetworkStream networkStream = null;

while (true)
{
    try
    {
        IPEndPoint endPoint = new IPEndPoint(IPAddress.Loopback, 50001); // mudar por servidor
        tcpListener = new TcpListener(endPoint);
        tcpListener.Start();

        tcpClient = tcpListener.AcceptTcpClient();
        networkStream = tcpClient.GetStream();

        byte[] buffer = new byte[tcpClient.ReceiveBufferSize];
        int bytesRead = networkStream.Read(buffer, 0, buffer.Length);

        string request = Encoding.UTF8.GetString(buffer, 0, bytesRead);

        // TODO: logica especifica de cada servidor
        string response = "TODO";

        byte[] ack = Encoding.UTF8.GetBytes(response);
        networkStream.Write(ack, 0, ack.Length);
    }
    finally
    {
        if (networkStream != null) networkStream.Close();
        if (tcpClient != null) tcpClient.Close();
        if (tcpListener != null) tcpListener.Stop();
    }
}
```

## Mapa de conceitos C# desta ficha

### Classe: `TcpClient` (cliente)
- O que e: representa a ligacao TCP do lado do cliente.
- Metodos principais:
- `Connect(endPoint)`: liga ao servidor.
- `GetStream()`: obtem `NetworkStream` para enviar/receber dados.
- `Close()`: fecha a ligacao.
- Propriedade util:
- `ReceiveBufferSize`: tamanho do buffer de rececao.

### Classe: `TcpListener` (servidor)
- O que e: coloca o servidor a escuta numa porta.
- Metodos principais:
- `Start()`: inicia escuta.
- `AcceptTcpClient()`: aceita uma nova ligacao.
- `Stop()`: para escuta.

### Classe: `NetworkStream`
- O que e: canal de bytes entre cliente e servidor.
- Metodos principais:
- `Read(buffer, offset, count)`: recebe bytes da rede.
- `Write(buffer, offset, count)`: envia bytes para a rede.
- `Close()`: fecha stream.

### Classe: `IPEndPoint`
- O que e: combinacao de IP + porto.
- Exemplo: `new IPEndPoint(IPAddress.Loopback, 50001)`.

### Classe: `Encoding.UTF8`
- O que e: converte texto <-> bytes.
- Metodos usados:
- `GetBytes(texto)`: string para bytes.
- `GetString(bytes, 0, n)`: bytes para string.

### Funcao/metodo: `EnviarDados(...)`
- Tipo: metodo que devolve `string`.
- Parametros: mensagem, IP e porto.
- Responsabilidade: abrir ligacao, enviar mensagem, ler resposta e devolver texto.

### Outras funcoes (metodos com retorno) importantes
- `IPAddress.Parse(ipAddress)` devolve um `IPAddress`.
- `int.Parse(ipPort)` devolve um `int`.
- `networkStream.Read(...)` devolve `int` (bytes lidos).
- `Encoding.UTF8.GetString(...)` devolve `string`.

## O que cada servidor deve fazer (sem solucao detalhada)

1. `Server1`:
- converter pedido para inteiro;
- calcular `(x + 2) * 3`;
- devolver texto com resultado.

2. `Server2`:
- contar caracteres da mensagem recebida;
- devolver texto "Recebi N caracteres".

3. `Server3`:
- aplicar decifragem Cesar com chave partilhada `N`;
- devolver mensagem decifrada.

## Checklist de validacao

- Cliente liga ao IP e porta corretos.
- `bytesRead > 0` antes de interpretar resposta.
- Todas as streams/clients sao fechadas no `finally`.
- Cada servidor usa a porta correta (`50001/50002/50003`).
- Testar localmente com `127.0.0.1` (`IPAddress.Loopback`).

## Pontos de seguranca

- Validar entrada no cliente e no servidor (`int.Parse` pode falhar).
- Nao confiar no tamanho da mensagem recebida.
- Definir timeout de socket para evitar bloqueios indefinidos.
- Evitar expor servicos em `IPAddress.Any` sem firewall/regras.
- Registar erros sem expor informacao sensivel ao cliente.

## Erros comuns

- Abrir `TcpListener` dentro do loop de forma ineficiente.
- Escrever `response.Length` em vez de `ack.Length` no `Write`.
- Usar `Encoding` diferente no cliente e no servidor.
- Tentar ler de `NetworkStream` sem haver dados.
- Confundir `Loopback` com IP externo da maquina.

## Mini desafio

1. Adicionar timeout configuravel no cliente.
2. Criar protocolo simples com prefixo de tamanho da mensagem.
3. No Server3, suportar letras maiusculas/minusculas e preservar espacos.
4. Mostrar no cliente tempo de ida-e-volta (latencia) por pedido.
