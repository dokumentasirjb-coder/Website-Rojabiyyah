<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name'        => 'Kabar Kegiatan',
                'slug'        => 'kabar-kegiatan',
                'description' => 'Liputan dokumentasi dan warta pelaksanaan kegiatan rutin maupun khusus di lingkungan Rojabiyyah.',
                'color'       => '#16a34a',
                'icon'        => 'calendar',
                'sort_order'  => 1,
            ],
            [
                'name'        => 'Kajian & Tausiyah',
                'slug'        => 'kajian-tausiyah',
                'description' => 'Artikel nasihat keagamaan, ringkasan pengajian kitab, dan wawasan keilmuan.',
                'color'       => '#0284c7',
                'icon'        => 'book-open',
                'sort_order'  => 2,
            ],
            [
                'name'        => 'Sosial & Kemasyarakatan',
                'slug'        => 'sosial-kemasyarakatan',
                'description' => 'Warta bakti sosial, gotong royong, santunan anak yatim, dan kepedulian lingkungan.',
                'color'       => '#d97706',
                'icon'        => 'heart-handshake',
                'sort_order'  => 3,
            ],
            [
                'name'        => 'Pendidikan & Kepemudaan',
                'slug'        => 'pendidikan-kepemudaan',
                'description' => 'Aktivitas santri, pelatihan remaja masjid, dan program pembinaan generasi muda.',
                'color'       => '#7c3aed',
                'icon'        => 'graduation-cap',
                'sort_order'  => 4,
            ],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['slug' => $cat['slug']],
                $cat
            );
        }
    }
}
