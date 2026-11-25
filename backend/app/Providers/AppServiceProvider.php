<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Rate limiter khusus login: berbasis kombinasi email + IP agar aman dari brute force
        // namun tidak memblokir pengguna lain di jaringan/Wi-Fi yang sama.
        RateLimiter::for('login', function (Request $request) {
            $email = Str::transliterate(Str::lower((string) $request->input('email')));
            $key = ($email !== '' ? $email : 'guest') . '|' . $request->ip();

            return Limit::perMinute(5)
                ->by($key)
                ->response(function (Request $request, array $headers) {
                    $retryAfter = (int) ($headers['Retry-After'] ?? 60);

                    return response()->json([
                        'success'     => false,
                        'message'     => "Terlalu banyak percobaan login. Silakan tunggu {$retryAfter} detik sebelum mencoba lagi.",
                        'retry_after' => $retryAfter,
                    ], 429, $headers);
                });
        });

        // Rate limiter umum API: cukup longgar untuk navigasi SPA normal
        RateLimiter::for('api', function (Request $request) {
            $key = $request->user()?->id ? 'user:' . $request->user()->id : 'ip:' . $request->ip();

            return Limit::perMinute(120)
                ->by($key)
                ->response(function (Request $request, array $headers) {
                    $retryAfter = (int) ($headers['Retry-After'] ?? 60);

                    return response()->json([
                        'success'     => false,
                        'message'     => "Permintaan terlalu cepat. Silakan tunggu {$retryAfter} detik.",
                        'retry_after' => $retryAfter,
                    ], 429, $headers);
                });
        });
    }
}
