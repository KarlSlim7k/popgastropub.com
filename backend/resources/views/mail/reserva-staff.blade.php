<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva reservación — POP Perote</title>
</head>
<body style="margin:0; padding:0; background-color:#0D0D0D; font-family: 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0D0D0D; padding:40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background-color:#1a1a1a; border-radius:12px; overflow:hidden; border:1px solid #333;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #732817 0%, #D96725 100%); padding:32px 40px; text-align:center;">
                            <h1 style="margin:0; color:#F2C777; font-size:28px; font-weight:800; letter-spacing:2px;">POP PEROTE</h1>
                            <p style="margin:8px 0 0; color:#F2C894; font-size:13px; letter-spacing:1px;">NUEVA RESERVACIÓN</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:40px;">
                            <p style="margin:0 0 24px; color:#e0e0e0; font-size:15px; line-height:1.6;">
                                Se registró una nueva reservación con estado <strong style="color:#F2C777;">{{ ucfirst($reserva->estado) }}</strong>:
                            </p>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                                <tr>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#999; font-size:13px;">Nombre</td>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#fff; font-size:13px; text-align:right; font-weight:700;">{{ $reserva->nombre }}</td>
                                </tr>
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
                                <tr>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#999; font-size:13px;">Email</td>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#fff; font-size:13px; text-align:right; font-weight:700;">{{ $reserva->email ?: '—' }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#999; font-size:13px;">Teléfono</td>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#fff; font-size:13px; text-align:right; font-weight:700;">{{ $reserva->telefono ?: '—' }}</td>
                                </tr>
                                @if($reserva->notas)
                                <tr>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#999; font-size:13px; vertical-align:top;">Notas</td>
                                    <td style="padding:10px 0; border-bottom:1px solid #333; color:#fff; font-size:13px; text-align:right;">{{ $reserva->notas }}</td>
                                </tr>
                                @endif
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#111; padding:20px 40px; text-align:center; border-top:1px solid #333;">
                            <p style="margin:0; color:#666; font-size:11px; letter-spacing:0.5px;">
                                Gestiona esta reservación desde el panel de administración o staff de POP Perote.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
