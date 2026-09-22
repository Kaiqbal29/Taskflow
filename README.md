# Taskflow

Taskflow adalah aplikasi workspace manajemen proyek untuk membantu tim mengatur proyek, task Kanban, deadline, prioritas, anggota, komentar, dan activity log dalam satu tempat.

## Cara menggunakan

### Demo publik

Buka aplikasi lalu pilih **Preview demo workspace**. Demo menyediakan workspace contoh dengan project, task, komentar, anggota, dark mode, dan drag-and-drop Kanban.

Akun demo backend:

```text
Email: demo@taskflow.test
Password: password123
```

### Menjalankan fullstack secara lokal

Kebutuhan: Node.js, PHP 8.2+, Composer, dan MySQL.

Backend Laravel:

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=0.0.0.0 --port=8000
```

Frontend React:

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port=5173
```

Frontend menggunakan proxy `/api` ke Laravel pada port `8000`. Untuk API production terpisah, isi `VITE_API_URL` berdasarkan `frontend/.env.example`.

## Struktur proyek

```text
Taskflow/
├── frontend/   React + Vite + Tailwind CSS + Lucide React
│   └── src/    Auth, dashboard, Kanban, project, team, dan komentar
├── backend/    Laravel API + Sanctum + MySQL
│   ├── app/    Model dan controller API
│   ├── database/ migrations dan seed data demo
│   └── routes/ endpoint API versi v1
└── README.md
```

## Fitur utama

- Workspace dan anggota tim
- Project management
- Kanban task dengan status, prioritas, assignee, dan deadline
- Drag-and-drop status task
- Komentar dan activity log
- Dashboard statistik
- Dark mode dan light mode
- Responsive layout untuk desktop dan mobile
- Login dan register berbasis Laravel Sanctum
