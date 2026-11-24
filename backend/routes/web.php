<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — Rojabiyyah Standalone RESTful API Backend
|--------------------------------------------------------------------------
| Menghapus ketergantungan pada view blade / Vite. Mengembalikan respons
| status JSON ketika endpoint root backend diakses langsung.
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'status'      => 'online',
        'service'     => 'Rojabiyyah Standalone RESTful API Backend',
        'version'     => '1.0.0',
        'environment' => config('app.env'),
        'timestamp'   => now()->toIso8601String(),
        'endpoints'   => [
            'home'          => url('/api/v1/home'),
            'articles'      => url('/api/v1/articles'),
            'announcements' => url('/api/v1/announcements'),
            'categories'    => url('/api/v1/categories'),
        ],
    ]);
});
