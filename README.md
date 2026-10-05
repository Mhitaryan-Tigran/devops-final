# devops-final

Итоговая работа по DevOps (IThub, Мхитарян Тигран): Node.js-приложение с метриками, Docker, мониторинг, CI/CD и развёртывание через Ansible.

| Часть | Файлы |
|---|---|
| Приложение: `GET /` → «DevOps Final Project», `GET /health` → `{"status":"ok"}`, `GET /metrics` — prom-client (`collectDefaultMetrics`, `http_requests_total`) | `src/app.js`, `tests/app.test.js` |
| Контейнер и стек: app, prometheus, grafana (порт 3001) | `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `prometheus.yml`, `grafana/datasources.yml` |
| CI/CD: lint → test (postgres service) → build-and-push в ghcr.io с тегами `latest` и SHA, только при пуше в `main` | `.github/workflows/ci-cd.yml` |
| Развёртывание: установка Docker при отсутствии, `/opt/devops-final`, копирование конфигов, `docker compose up -d` | `ansible/deploy.yml`, `ansible/inventory.ini` |

```
docker compose up -d
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
```
