export function getConfirmationEmailTemplate(code: string) {
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
        /* Restante do CSS... */
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Bem-vindo à nossa aplicação teams!</h1>
        <p>Por favor, confirme seu endereço de email clicando no link abaixo:</p>
        <a href="${process.env.URL_FRONT}/auth/validation/email/${code}">Confirmar email</a>
      </div>
    </body>
    </html>
  `;
}
