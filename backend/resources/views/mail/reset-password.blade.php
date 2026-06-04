<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña — POP Perote</title>
</head>
<body style="margin:0; padding:0; background-color:#0D0D0D; font-family: 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0D0D0D; padding:40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background-color:#1a1a1a; border-radius:12px; overflow:hidden; border:1px solid #333;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #732817 0%, #D96725 100%); padding:32px 40px; text-align:center;">
                            <h1 style="margin:0; color:#F2C777; font-size:28px; font-weight:800; letter-spacing:2px;">POP PEROTE</h1>
                            <p style="margin:8px 0 0; color:#F2C894; font-size:13px; letter-spacing:1px;">GASTROPUB</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:40px;">
                            <h2 style="margin:0 0 16px; color:#F2C777; font-size:20px; font-weight:700;">Restablecer tu contraseña</h2>
                            <p style="margin:0 0 24px; color:#e0e0e0; font-size:15px; line-height:1.6;">
                                Hola <strong style="color:#F2C894;">{{ $userName }}</strong>,
                            </p>
                            <p style="margin:0 0 24px; color:#e0e0e0; font-size:15px; line-height:1.6;">
                                Recibimos una solicitud para restablecer la contraseña de tu cuenta. Usa el siguiente código:
                            </p>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="padding:20px 0;">
                                        <div style="background-color:#0D0D0D; border:2px dashed #D96725; border-radius:12px; padding:24px 32px; display:inline-block;">
                                            <span style="font-size:36px; font-weight:800; letter-spacing:12px; color:#F2C777; font-family: 'Courier New', monospace;">{{ $code }}</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:0 0 16px; color:#999; font-size:13px; line-height:1.6;">
                                Este código expira en <strong style="color:#D96725;">15 minutos</strong>.
                            </p>
                            <p style="margin:0; color:#999; font-size:13px; line-height:1.6;">
                                Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña permanecerá sin cambios.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#111; padding:20px 40px; text-align:center; border-top:1px solid #333;">
                            <p style="margin:0; color:#666; font-size:11px; letter-spacing:0.5px;">
                                POP Perote — Justo Sierra No. 11, Col. Amado Nervo, Perote, Veracruz
                            </p>
                            <p style="margin:8px 0 0; color:#555; font-size:10px;">
                                Este correo fue enviado automáticamente. No respondas a este mensaje.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
