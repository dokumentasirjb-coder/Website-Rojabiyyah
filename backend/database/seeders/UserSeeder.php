<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin Utama
        User::firstOrCreate(
            ['email' => 'admin@rojabiyyah.id'],
            [
                'name'              => 'Administrator Rojabiyyah',
                'password'          => Hash::make('password123'),
                'role'              => 'admin',
                'bio'               => 'Pengelola utama sistem informasi dan portal web Rojabiyyah.',
                'email_verified_at' => now(),
            ]
        );

        // Editor Konten
        User::firstOrCreate(
            ['email' => 'editor@rojabiyyah.id'],
            [
                'name'              => 'Ustadz Ahmad Fauzi, M.Pd.',
                'password'          => Hash::make('password123'),
                'role'              => 'editor',
                'bio'               => 'Redaktur warta kegiatan, artikel kajian, dan keilmuan Rojabiyyah.',
                'email_verified_at' => now(),
            ]
        );

        // Editor Dokumentasi
        User::firstOrCreate(
            ['email' => 'dokumentasi@rojabiyyah.id'],
            [
                'name'              => 'Siti Rahmawati, S.Kom.',
                'password'          => Hash::make('password123'),
                'role'              => 'editor',
                'bio'               => 'Jurnalis lapangan dan pengelola media publikasi Rojabiyyah.',
                'email_verified_at' => now(),
            ]
        );
    }
}
