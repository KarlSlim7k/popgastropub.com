<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tu reservación — POP Perote</title>
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
                            <p style="margin:0 0 24px; color:#e0e0e0; font-size:15px; line-height:1.6;">
                                Hola <strong style="color:#F2C894;">{{ $reserva->nombre }}</strong>,
                            </p>

                            @if($estado === 'pendiente')
                                <h2 style="margin:0 0 16px; color:#F2C777; font-size:20px; font-weight:700;">Recibimos tu reservación</h2>
                                <p style="margin:0 0 24px; color:#e0e0e0; font-size:15px; line-height:1.6;">
                                    Nuestro equipo la revisará y te confirmaremos por este medio en cuanto quede lista tu mesa.
                                </p>
                            @elseif($estado === 'confirmada')
                                <h2 style="margin:0 0 16px; color:#F2C777; font-size:20px; font-weight:700;">✅ Tu reservación está confirmada</h2>
                                <p style="margin:0 0 24px; color:#e0e0e0; font-size:15px; line-height:1.6;">
                                    ¡Te esperamos! Tu mesa está reservada con los siguientes datos:
                                </p>
                            @else
                                <h2 style="margin:0 0 16px; color:#F2C777; font-size:20px; font-weight:700;">Tu reservación fue cancelada</h2>
                                <p style="margin:0 0 24px; color:#e0e0e0; font-size:15px; line-height:1.6;">
                                    Si fue un error o quieres reservar para otra fecha, puedes hacer una nueva reservación en cualquier momento.
                                </p>
                            @endif

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                                <tr>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#999; font-size:13px;">Fecha</td>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#fff; font-size:13px; text-align:right; font-weight:700;">{{ \Carbon\Carbon::parse($reserva->fecha)->locale('es')->isoFormat('dddd D [de] MMMM') }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#999; font-size:13px;">Hora</td>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#fff; font-size:13px; text-align:right; font-weight:700;">{{ \Carbon\Carbon::parse($reserva->hora)->format('H:i') }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#999; font-size:13px;">Personas</td>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#fff; font-size:13px; text-align:right; font-weight:700;">{{ $reserva->personas }}</td>
                                </tr>
                            </table>

                            <p style="margin:24px 0 0; color:#999; font-size:13px; line-height:1.6;">
                                ¿Necesitas hacer cambios? Responde a este correo o contáctanos al
                                <a href="https://wa.me/522821278014" style="color:#D96725;">WhatsApp</a>.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#111; padding:20px 40px; text-align:center; border-top:1px solid #333;">
                            <p style="margin:0; color:#666; font-size:11px; letter-spacing:0.5px;">
                                POP Perote — Justo Sierra No. 11, Col. Amado Nervo, Perote, Veracruz
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
