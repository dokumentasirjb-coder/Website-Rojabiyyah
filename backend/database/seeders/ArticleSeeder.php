<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $editor = User::where('role', 'editor')->first() ?? User::first();
        $catKegiatan = Category::where('slug', 'kabar-kegiatan')->first();
        $catKajian = Category::where('slug', 'kajian-tausiyah')->first();
        $catSosial = Category::where('slug', 'sosial-kemasyarakatan')->first();
        $catPendidikan = Category::where('slug', 'pendidikan-kepemudaan')->first();

        $articles = [
            [
                'title'        => 'Peringatan Isra Miraj dan Pengajian Akbar Rojabiyyah Berlangsung Khidmat',
                'slug'         => 'peringatan-isra-miraj-dan-pengajian-akbar-rojabiyyah-berlangsung-khidmat',
                'excerpt'      => 'Ratusan jamaah memadati aula utama dalam rangka menyemarakkan peringatan Isra Miraj Nabi Muhammad SAW.',
                'content'      => '<p>Peringatan Isra Miraj Nabi Muhammad SAW yang diselenggarakan oleh keluarga besar Rojabiyyah pada akhir pekan lalu berlangsung dengan penuh khidmat dan semarak. Ratusan jamaah dari berbagai wilayah sekitar tampak antusias memadati lokasi sejak pagi hari.</p><p>Acara diawali dengan lantunan ayat suci Al-Quran yang dibawakan oleh santri tahfidz, dilanjutkan dengan sambutan panitia serta tausiyah utama yang mengajak seluruh hadirin untuk senantiasa memperkokoh tiang shalat dan ukhuwah islamiyah.</p>',
                'category_id'  => $catKegiatan->id,
                'user_id'      => $editor->id,
                'status'       => Article::STATUS_PUBLISHED,
                'is_featured'  => true,
                'published_at' => now()->subDays(2),
                'view_count'   => 245,
            ],
            [
                'title'        => 'Keutamaan Memakmurkan Majelis Ilmu di Era Digital',
                'slug'         => 'keutamaan-memakmurkan-majelis-ilmu-di-era-digital',
                'excerpt'      => 'Ulasan mendalam mengenai urgensi menuntut ilmu secara langsung di majelis serta adab-adabnya.',
                'content'      => '<p>Di tengah derasnya arus informasi digital, kehadiran fisik di majelis ilmu tetap memiliki keutamaan yang tak tergantikan. Ketenangan jiwa, keberkahan guru, serta naungan malaikat adalah anugerah yang hadir saat kita melangkahkan kaki ke majelis taklim.</p><p>Tulisan ini mengajak kita untuk merenungi kembali pentingnya sanad keilmuan dan menjaga niat ikhlas dalam setiap majelis yang kita hadiri.</p>',
                'category_id'  => $catKajian->id,
                'user_id'      => $editor->id,
                'status'       => Article::STATUS_PUBLISHED,
                'is_featured'  => true,
                'published_at' => now()->subDays(5),
                'view_count'   => 312,
            ],
            [
                'title'        => 'Penyaluran Santunan Bulanan dan Sembako bagi Warga Sekitar',
                'slug'         => 'penyaluran-santunan-bulanan-dan-sembako-bagi-warga-sekitar',
                'excerpt'      => 'Sebagai bentuk kepedulian sosial, panitia Rojabiyyah kembali menyalurkan puluhan paket bahan pokok.',
                'content'      => '<p>Alhamdulillah, tim bidang sosial kemasyarakatan Rojabiyyah telah menuntaskan agenda penyaluran santunan paket sembako kepada dhuafa dan anak yatim di lingkungan sekitar. Sebanyak 75 paket bantuan berhasil didistribusikan langsung ke rumah penerima manfaat.</p><p>Kami mengucapkan terima kasih sebesar-besarnya kepada para muhsinin dan donatur yang senantiasa menitipkan amanahnya melalui kami.</p>',
                'category_id'  => $catSosial->id,
                'user_id'      => $editor->id,
                'status'       => Article::STATUS_PUBLISHED,
                'is_featured'  => false,
                'published_at' => now()->subDays(8),
                'view_count'   => 189,
            ],
            [
                'title'        => 'Pembukaan Pendaftaran Kelas Tahsin dan Bahasa Arab Angkatan Baru',
                'slug'         => 'pembukaan-pendaftaran-kelas-tahsin-dan-bahasa-arab-angkatan-baru',
                'excerpt'      => 'Dibuka kesempatan belajar membaca Al-Quran berstandar tajwid dan tata bahasa Arab dasar bagi remaja dan dewasa.',
                'content'      => '<p>Bidang pendidikan Rojabiyyah kembali membuka pendaftaran kelas tahsin tilawah dan dasar bahasa Arab untuk angkatan ke-12. Program ini dirancang dengan kurikulum bertahap yang dibimbing langsung oleh asatidz berpengalaman.</p><p>Pendaftaran dibuka hingga akhir bulan ini dengan kuota terbatas guna menjaga efektivitas proses belajar mengajar.</p>',
                'category_id'  => $catPendidikan->id,
                'user_id'      => $editor->id,
                'status'       => Article::STATUS_PUBLISHED,
                'is_featured'  => false,
                'published_at' => now()->subDays(12),
                'view_count'   => 420,
            ],
        ];

        foreach ($articles as $art) {
            Article::firstOrCreate(
                ['slug' => $art['slug']],
                $art
            );
        }
    }
}
