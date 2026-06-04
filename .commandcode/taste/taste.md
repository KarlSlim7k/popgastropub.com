# Deployment
- Preferir despliegue automático vía push al repositorio; NO hacer despliegues manuales directos al VPS. Confidence: 0.85
- Flujo de despliegue: push al repo → Dokploy detecta automáticamente → esperar 90-120 segundos para verificación. Confidence: 0.80
- Cuando el usuario indique "no hagas commit y push, yo me encargo", respetar y no realizar commits ni pushes. Confidence: 0.75

# VPS Access
- Usar sshpass para acceso autónomo al VPS sin esperar contraseña: sshpass -p '7q&ZQKkuMoem+65NQHsf' ssh root@76.13.123.24. Confidence: 0.70

# Communication
- Cuando se solicite verificar funcionalidad o hacer tareas de revisión: NO generar documentación markdown, responder brevemente con lo realizado. Confidence: 0.75
