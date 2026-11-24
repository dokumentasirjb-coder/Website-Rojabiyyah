<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::first();

        $announcements = [
            [
                'title'      => 'Jadwal Kajian Rutin Malam Ahad: Kitab Riyadhus Shalihin',
                'content'    => 'Diberitahukan kepada segenap jamaah, kajian rutin malam Ahad ba\'da Isya akan membahas bab Istiqamah dalam kitab Riyadhus Shalihin. Terbuka untuk umum, ikhwan dan akhwat.',
                'event_date' => now()->addDays(5)->toDateString(),
                'event_time' => '19:30:00',
                'location'   => 'Masjid Jami Rojabiyyah',
                'type'       => Announcement::TYPE_AGENDA,
                'is_active'  => true,
                'is_pinned'  => true,
                'user_id'    => $admin->id,
            ],
            [
                'title'      => 'Kerja Bakti Kebersihan Lingkungan dan Persiapan Ramadhan',
                'content'    => 'Mari bersama-sama merawat kebersihan tempat ibadah dan asrama. Diharapkan membawa peralatan kebersihan masing-masing mulai pukul 07.00 WIB.',
                'event_date' => now()->addDays(12)->toDateString(),
                'event_time' => '07:00:00',
                'location'   => 'Area Kompleks Rojabiyyah',
                'type'       => Announcement::TYPE_EVENT,
                'is_active'  => true,
                'is_pinned'  => false,
                'user_id'    => $admin->id,
            ],
            [
                'title'      => 'Pemberitahuan Penyesuaian Jam Operasional Sekretariat',
                'content'    => 'Selama periode renovasi ringan, pelayanan administrasi dan surat-menyurat di kantor sekretariat dibuka setiap hari Senin hingga Kamis pukul 09.00 - 15.00 WIB.',
                'event_date' => null,
                'event_time' => null,
                'location'   => 'Kantor Sekretariat',
                'type'       => Announcement::TYPE_ANNOUNCEMENT,
                'is_active'  => true,
                'is_pinned'  => false,
                'user_id'    => $admin->id,
            ],
        ];

        foreach ($announcements as $item) {
            Announcement::create($item);
        }
    }
}
