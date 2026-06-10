# Colaboración Multi-Agente con Git Worktrees

> Guía para coordinar múltiples agentes de IA trabajando en el mismo proyecto sin conflictos.

---

## Contexto

Cuando trabajas con varios agentes de IA simultáneamente (OpenCode, CommandCode, Codex, etc.), pueden surgir conflictos si modifican los mismos archivos. **Git Worktrees** permite que cada agente trabaje en su propio directorio y rama, eliminando interferencias.

---

## 1. Configuración Inicial

### Crear worktrees (una vez por agente)

```bash
# Desde el directorio principal del proyecto
cd pop_web/

# Crear worktree para cada agente
git worktree add ../pop_web-opencode -b feature/frontend-mejoras
git worktree add ../pop_web-commandcode -b feature/backend-api
git worktree add ../pop_web-codex -b feature/tests-y-docs
```

### Estructura resultante

```
~/web-dev/
├── pop_web/                    ← main (rama principal)
├── pop_web-opencode/           ← rama: feature/frontend-mejoras
├── pop_web-commandcode/        ← rama: feature/backend-api
└── pop_web-codex/              ← rama: feature/tests-y-docs
```

---

## 2. Flujo de Trabajo

### Durante el desarrollo

Cada agente **siempre** debe:
1. Abrir su propio directorio de trabajo
2. Crear su propia rama para tareas específicas
3. Nunca tocar archivos fuera de su ámbito

```bash
# Ejemplo: OpenCode trabajando en frontend
cd ../pop_web-opencode
git checkout -b feature/rediseño-hero
# ... hace cambios ...
git add .
git commit -m "feat(frontend): rediseño del hero section"
```

### Recomendación de ámbito por agente

| Agente | Ámbito | Ejemplo de rama |
|--------|--------|-----------------|
| **OpenCode** | Frontend (UI/UX, componentes, páginas) | `feature/mejoras-landing` |
| **CommandCode** | Backend (API, lógica, BD) | `feature/api-pedidos` |
| **Codex** | Tests, docs, análisis | `feature/unit-tests-auth` |

---

## 3. Integración de Cambios

### Merge secuencial (recomendado)

```bash
# Regresar al directorio principal
cd pop_web/

# Asegurarse de estar en main
git checkout main
git pull origin main

# Merge de cada rama (uno por uno)
git merge feature/frontend-mejoras --no-ff
git merge feature/backend-api --no-ff
git merge feature/tests-y-docs --no-ff

# Resolver conflictos si aparecen (raro si cada agente respetó su ámbito)

# Push a GitHub → Dokploy despliega automáticamente
git push origin main
```

### Ventajas del merge secuencial

- Puedes revisar cada rama antes del merge
- Si algo falla, descartas una rama sin afectar las otras
- Historial claro de qué cambió y quién lo hizo

---

## 4. Despliegue

El flujo de despliegue **no cambia**:

```bash
git push origin main
```

**Dokploy** detecta el push automáticamente:
1. Reconstruye containers con `docker-compose.yml`
2. Ejecuta migraciones de BD (Laravel)
3. Compila frontend (Next.js)
4. Traefik renueva SSL si es necesario

---

## 5. Comandos Útiles

### Ver worktrees activos

```bash
git worktree list
```

### Eliminar worktree (cuando terminas una tarea)

```bash
git worktree remove ../pop_web-opencode
git branch -d feature/frontend-mejoras  # eliminar rama si ya está merged
```

### Actualizar un worktree con cambios de main

```bash
# Desde el worktree del agente
cd ../pop_web-opencode
git merge main  # traer cambios de main a esta rama
```

---

## 6. Buenas Prácticas

### ✅ Hacer

- **Comunicar claramente el ámbito** a cada agente (frontend, backend, tests)
- **Crear ramas descriptivas** (`feature/pagina-pedidos`, `fix/api-login-error`)
- **Hacer commits frecuentes** con mensajes claros
- **Merge uno por uno** para detectar conflictos fácilmente

### ❌ Evitar

- Que dos agentes toquen el mismo módulo (ej: ambos editen `backend/routes/api.php`)
- Commits masivos sin descripción
- Olvidar hacer `git pull` antes de empezar (puede causar conflictos)

---

## 7. Ejemplo Completo

### Día 1: Tareas paralelas

**OpenCode** (en `pop_web-opencode`):
```bash
git checkout -b feature/rediseño-menu
# modifica frontend/app/menu/page.tsx
git add . && git commit -m "feat(frontend): nuevo diseño de página de menú"
```

**CommandCode** (en `pop_web-commandcode`):
```bash
git checkout -b feature/api-pedidos
# modifica backend/app/Http/Controllers/PedidoController.php
git add . && git commit -m "feat(api): endpoint de pedidos con validación"
```

**Codex** (en `pop_web-codex`):
```bash
git checkout -b feature/tests-pedidos
# crea tests en backend/tests/Feature/PedidoTest.php
git add . && git commit -m "test: cobertura completa para pedidos API"
```

### Día 2: Integración

```bash
cd pop_web/
git checkout main
git pull origin main

git merge feature/rediseño-menu --no-ff        # ✅
git merge feature/api-pedidos --no-ff          # ✅
git merge feature/tests-pedidos --no-ff        # ✅

git push origin main                           # 🚀 Dokploy despliega
```

---

## 8. Troubleshooting

### "No puedo cambiar de rama porque hay cambios sin commit"

```bash
git stash           # guardar cambios temporalmente
git checkout main
git stash pop       # recuperar cambios
```

### "Conflicto al hacer merge"

```bash
# Editar archivos en conflicto (resolver marcadores <<< === >>>)
git add .
git commit           # completar el merge
```

### "El worktree está desactualizado"

```bash
cd ../pop_web-opencode
git fetch origin
git merge origin/main
```

---

## Resumen

| Paso | Acción |
|------|--------|
| **1. Setup** | `git worktree add ../pop_web-agente -b rama-tarea` |
| **2. Trabajo** | Cada agente en su directorio, su rama, su ámbito |
| **3. Commit** | `git add . && git commit -m "mensaje claro"` |
| **4. Merge** | Desde `pop_web/`: `git merge rama-tarea --no-ff` |
| **5. Deploy** | `git push origin main` → Dokploy automático |

---

*Documento creado: Junio 2026*
