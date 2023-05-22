export function getResetPasswordEmailTemplate(code: string, to: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

        body {
          font-family: 'Roboto', sans-serif;
          background: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 4px;
          box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
          line-height: 1.6;
        }
        .code {
          display: inline-block;
          margin: 20px auto;
          font-size: 24px;
          letter-spacing: 5px;
          padding: 10px 15px;
          border: 1px solid #ddd;
          background-color: #f3f3f3;
          color: #333;
          border-radius: 4px;
        }
        .button {
          display: inline-block;
          margin: 20px auto;
          color: #ffffff;  /* Alterada a cor do texto do botão para branco */
          background-color: #800080;
          padding: 10px 20px;
          text-decoration: none;
          font-size: 16px;
          border-radius: 4px;
        }
        .button:hover {
          background-color: #993399;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Recuperação de senha</h1>
        <p>Você solicitou a recuperação de senha. Seu código de 6 dígitos é:</p>
        <div class="code">${code}</div>
        <p>Por favor, insira este código na nossa plataforma para prosseguir com a alteração da sua senha.</p>
        <a href="${process.env.URL_FRONT}/reset-password/${to}" class="button" style="color: #ffffff;">Resetar Senha</a>
        <p>Se você não solicitou a recuperação de senha, ignore este e-mail.</p>
      </div>
    </body>
    </html>
  `;
}
