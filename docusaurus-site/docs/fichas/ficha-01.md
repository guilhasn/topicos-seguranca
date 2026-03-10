---
title: Ficha 01 - Ficheiros Binarios
sidebar_position: 1
---

# Ficha 01 - Ficheiros Binarios

## Materiais originais

- [Enunciado PDF](/fichas/ficha-01/TS_FichaPratica01.pdf)
- [Guiao PDF](/fichas/ficha-01/GuiaoFichaPratica1.pdf)

## Enunciado resumido

Nesta ficha os alunos criam uma aplicacao Windows Forms (.NET Framework) para copiar uma imagem (`security.jpg`) para `copy_security.jpg` em blocos de bytes (N=20480), usando `FileStream`.

Extras pedidos:
- mostrar progresso de copia com `ProgressBar`;
- registar copias num `log.txt`.

## Objetivos

- Manipular ficheiros binarios em C#.
- Ler e escrever dados em blocos com `FileStream`.
- Entender a diferenca entre `bufferSize` e `bytesRead`.
- Aplicar libertacao correta de recursos com `using`.
- (Extra) Atualizar progresso e guardar logs.

## Setup da UI (Windows Forms)

- `Button` para iniciar copia.
- `Label` com nome `labelCopyMessage` e `Visible = false`.
- (Extra) `ProgressBar` com nome `progressBarCopyFile`.

## Codigo de referencia (versao base)

```csharp
using System;
using System.IO;
using System.Windows.Forms;

private void buttonCopyFile_Click(object sender, EventArgs e)
{
    int bufferSize = 20480;
    byte[] buffer = new byte[bufferSize];
    int bytesRead = 0;

    string originalFilePath = Path.Combine(Application.StartupPath, "security.jpg");
    string copyFilePath = Path.Combine(Application.StartupPath, "copy_security.jpg");

    if (!File.Exists(originalFilePath))
    {
        labelCopyMessage.Text = "security.jpg nao foi encontrado.";
        labelCopyMessage.Visible = true;
        return;
    }

    if (File.Exists(copyFilePath))
    {
        File.Delete(copyFilePath);
    }

    using (FileStream originalFileStream = new FileStream(originalFilePath, FileMode.Open, FileAccess.Read))
    using (FileStream copyFileStream = new FileStream(copyFilePath, FileMode.CreateNew, FileAccess.Write))
    {
        while ((bytesRead = originalFileStream.Read(buffer, 0, bufferSize)) > 0)
        {
            copyFileStream.Write(buffer, 0, bytesRead);
        }

        string msg = "File Copied [" + originalFileStream.Length + " bytes]";
        labelCopyMessage.Text = msg;
        labelCopyMessage.Visible = true;
    }
}
```

## Explicacao linha a linha

1. `bufferSize = 20480`: define o tamanho maximo de cada bloco lido.
2. `byte[] buffer`: reserva memoria para guardar temporariamente os bytes.
3. `bytesRead`: guarda quantos bytes foram realmente lidos em cada iteracao.
4. `Path.Combine(Application.StartupPath, ...)`: usa caminhos relativos ao executavel.
5. `File.Exists(originalFilePath)`: valida que a imagem existe antes da copia.
6. `File.Delete(copyFilePath)`: remove copia antiga para evitar conflitos.
7. `new FileStream(..., FileMode.Open, FileAccess.Read)`: abre o original em leitura.
8. `new FileStream(..., FileMode.CreateNew, FileAccess.Write)`: cria novo ficheiro de destino.
9. `Read(...) > 0`: ciclo continua enquanto houver bytes por ler.
10. `Write(buffer, 0, bytesRead)`: escreve apenas bytes validos lidos nessa iteracao.
11. `originalFileStream.Length`: mostra tamanho total do ficheiro copiado.
12. `using (...)`: garante `Close/Dispose` mesmo em caso de erro.

## Extra 1 - ProgressBar

```csharp
progressBarCopyFile.Minimum = 0;
progressBarCopyFile.Maximum = (int)originalFileStream.Length;

int copiedBytes = 0;

while ((bytesRead = originalFileStream.Read(buffer, 0, bufferSize)) > 0)
{
    copyFileStream.Write(buffer, 0, bytesRead);
    copiedBytes += bytesRead;
    progressBarCopyFile.Value = Math.Min(copiedBytes, progressBarCopyFile.Maximum);
}
```

Nota: atualizar com `copiedBytes` evita erros na ultima iteracao, que pode ler menos bytes que `bufferSize`.

## Extra 2 - Ficheiro log

```csharp
string logFilePath = Path.Combine(Application.StartupPath, "log.txt");

using (StreamWriter logStreamWriter = new StreamWriter(logFilePath, true))
{
    string msg = "File Copied [" + originalFileStream.Length + " bytes]";
    logStreamWriter.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " - " + msg);
}
```

## Pontos de seguranca

- Validar existencia do ficheiro antes de abrir.
- Evitar caminhos hardcoded para nao depender da maquina.
- Libertar recursos sempre (`using`) para evitar file locks.
- Tratar excecoes (`try/catch`) se quiseres feedback mais robusto.
- Em contexto real, validar extensao/tipo de ficheiro para evitar ficheiros maliciosos.

## Erros comuns

- Usar `Write(buffer, 0, bufferSize)` em vez de `bytesRead`.
- Nao fechar streams, deixando ficheiros bloqueados.
- Erro de nome no controlo (`llabelCopyMessage` em vez de `labelCopyMessage`).
- Colocar `security.jpg` fora da pasta de output.
- Esquecer `Copy to Output Directory` para a imagem.

## Mini desafio

1. Mostrar percentagem de progresso numa segunda `Label`.
2. Calcular e mostrar tempo total de copia em ms.
3. Guardar no `log.txt` tambem o nome do utilizador (`Environment.UserName`).
4. Impedir copia se o ficheiro tiver tamanho superior a um limite definido.
