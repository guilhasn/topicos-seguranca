---
sidebar_position: 3
---

# Fundamentos C# para as fichas

Esta pagina serve para leres codigo C# com confianca.
Objetivo: perceber rapidamente o que e classe, metodo, propriedade e funcao.

## Como usar esta pagina

Para cada linha de codigo, faz sempre estas 3 perguntas:
1. O que e isto? (classe, metodo, propriedade, variavel)
2. Que dados entram?
3. O que sai (ou que efeito acontece)?

## 1) Classe

Uma `classe` e um molde.
Define estrutura (dados) e comportamento (acoes).

Exemplos nas fichas:
- `FileStream`
- `TcpClient`
- `TcpListener`
- `NetworkStream`

Pergunta-chave: "Esta palavra representa um tipo de coisa?"

## 2) Objeto

Um `objeto` e uma instancia concreta de uma classe.
E algo que existe em memoria enquanto o programa corre.

```csharp
TcpClient cliente = new TcpClient();
```

- `TcpClient` e a classe
- `cliente` e o objeto criado

## 3) Metodo

Um `metodo` e uma acao que um objeto (ou classe) executa.
Reconheces quase sempre pelos parentesis `()`.

Exemplos:
- `Connect(...)`
- `Read(...)`
- `Write(...)`
- `Close()`

## 4) Propriedade

Uma `propriedade` e um valor associado ao objeto.
Nao leva parentesis.

Exemplos:
- `labelCopyMessage.Text`
- `labelCopyMessage.Visible`
- `tcpClient.ReceiveBufferSize`

## 5) Funcao

No contexto das fichas, chama "funcao" a um metodo que devolve valor.
Tecnicamente continua a ser um metodo em C#.

Exemplo:

```csharp
private string EnviarDados(string message, string ipAddress, string ipPort)
{
    return "OK";
}
```

Aqui `EnviarDados` devolve `string`, por isso funciona como "funcao".

## 6) Parametros e argumentos

- `parametros`: nomes declarados no metodo.
- `argumentos`: valores enviados na chamada real.

Exemplo:

```csharp
int bytesRead = stream.Read(buffer, 0, buffer.Length);
```

- Parametros de `Read`: `buffer`, `offset`, `count`
- Argumentos usados: `buffer`, `0`, `buffer.Length`

## 7) Exemplo completo: classe + propriedade + metodo + funcao

```csharp
public class ClienteTcp
{
    public string Nome { get; set; }   // propriedade
    public int Porta { get; set; }     // propriedade

    public void Ligar(string ip)       // metodo (nao devolve valor)
    {
        // ...
    }

    public string Enviar(string msg)   // "funcao" (devolve valor)
    {
        return "OK";
    }
}
```

Leitura rapida:
- `ClienteTcp` -> classe
- `Nome` e `Porta` -> propriedades
- `Ligar` -> metodo
- `Enviar` -> metodo que devolve valor (funcao)

## 8) APIs mais usadas nas Fichas 1 e 2

### Ficha 1 (ficheiros)

- `File.Exists(path)`: verifica se o ficheiro existe.
- `File.Delete(path)`: apaga o ficheiro.
- `new FileStream(path, mode, access)`: abre/cria ficheiro em stream.
- `Read(...)`: le bytes para um buffer.
- `Write(...)`: escreve bytes do buffer para o ficheiro.
- `StreamWriter.WriteLine(...)`: escreve texto no log.

### Ficha 2 (rede TCP)

- `new TcpListener(endPoint)`: cria servidor.
- `Start()`: coloca servidor a escuta.
- `AcceptTcpClient()`: espera ligacao de cliente.
- `new TcpClient()`: cria cliente.
- `Connect(endPoint)`: cliente liga ao servidor.
- `GetStream()`: obtem canal de comunicacao.
- `Encoding.UTF8.GetBytes(texto)`: texto -> bytes.
- `Encoding.UTF8.GetString(bytes, 0, n)`: bytes -> texto.

## 9) Como ler uma linha de codigo sem te perder

Exemplo real:

```csharp
int bytesRead = networkStream.Read(buffer, 0, buffer.Length);
```

Como interpretar:
1. `int` -> tipo de dados de saida.
2. `bytesRead` -> variavel que guarda o resultado.
3. `networkStream` -> objeto.
4. `Read(...)` -> metodo chamado no objeto.
5. Argumentos -> `buffer`, `0`, `buffer.Length`.
6. Resultado -> numero de bytes lidos.

Quando encontrares uma linha de codigo, pergunta:
1. Isto e classe, metodo ou propriedade?
2. Qual e o tipo de dados que entra?
3. Qual e o tipo de dados que sai?
4. O que pode falhar aqui?
5. Este recurso precisa de `Close()`/`Dispose()`?

## 10) Erros tipicos de iniciacao

- Confundir `buffer.Length` com `bytesRead`.
- Esquecer fechar streams/sockets.
- Usar `int.Parse` sem validar entrada.
- Misturar codificacoes (UTF8 de um lado, outra do outro lado).

## 11) Checklist de estudo para cada exercicio

Antes de dizeres "ja percebi", confirma:
1. Consigo apontar as classes usadas neste exercicio.
2. Sei que metodos sao chamados e com que argumentos.
3. Sei que propriedades sao lidas/alteradas.
4. Sei que funcoes devolvem valor e de que tipo.
5. Sei onde pode acontecer erro e como tratar.
