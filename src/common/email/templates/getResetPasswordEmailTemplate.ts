export function getResetPasswordEmailTemplate(code: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 4px;
        }
        .code {
          display: inline-block;
          padding: 10px 15px;
          margin: 10px 0;
          font-size: 18px;
          border: 1px solid #ddd;
          background-color: #f3f3f3;
          color: #333;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Recuperação de senha</h1>
        <p>Você solicitou a recuperação de senha. Seu código de 6 dígitos é:</p>
        <div class="code">${code}</div>
        <p>Por favor, insira este código na nossa plataforma para prosseguir com a alteração da sua senha.</p>
        <p>Se você não solicitou a recuperação de senha, ignore este e-mail.</p>
      </div>
    </body>
    </html>
  `;
}
