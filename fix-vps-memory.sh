#!/bin/bash
# Script para agregar swap y reconstruir Docker en VPS con poca RAM
# Ejecutar como root en el VPS

set -e

echo "=== Diagnóstico de memoria ==="
free -m
echo ""

# Verificar si ya existe swap
if [ $(swapon --show | wc -l) -eq 0 ]; then
    echo "=== Creando 2GB de swap temporal ==="
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo "Swap activado:"
    free -m
else
    echo "Swap ya existe:"
    swapon --show
fi

echo ""
echo "=== Limpiando cache de Docker ==="
docker system prune -af --volumes

echo ""
echo "=== Deteniendo contenedores ==="
docker compose down

echo ""
echo "=== Reconstruyendo imágenes (sin cache) ==="
docker compose build --no-cache backend scheduler

echo ""
echo "=== Iniciando servicios ==="
docker compose up -d

echo ""
echo "=== Estado de contenedores ==="
docker compose ps

echo ""
echo "=== Verificando logs del backend ==="
docker compose logs --tail=50 backend

echo ""
echo "=== Completado ==="
echo "Si todo está bien, puedes eliminar el swap temporal con:"
echo "  swapoff /swapfile && rm /swapfile"
echo ""
echo "O hacerlo permanente agregando a /etc/fstab:"
echo "  /swapfile none swap sw 0 0"
