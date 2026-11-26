<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Storage;

class SiteSettingMediaService
{
    /**
     * Mengonversi seluruh string data:image/...;base64,... di dalam payload (baik string langsung
     * maupun bersarang di dalam array/JSON) menjadi file fisik di storage/app/public/settings/.
     */
    public function convertBase64Fields(array $data): array
    {
        $converted = [];

        foreach ($data as $key => $value) {
            $prefix = is_string($key) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $key) : 'setting';
            $converted[$key] = $this->convertBase64Recursive($value, $prefix ?: 'setting');
        }

        return $converted;
    }

    /**
     * Memeriksa seluruh atribut SiteSetting di database; jika masih ada string data:image/
     * (langsung maupun di dalam JSON array), konversi ke file fisik dan perbarui DB.
     */
    public function normalizeStoredBase64Images(SiteSetting $settings): SiteSetting
    {
        $dirty = [];

        foreach ($settings->getAttributes() as $field => $rawValue) {
            if (in_array($field, ['id', 'created_at', 'updated_at'], true)) {
                continue;
            }

            $value = $settings->getAttribute($field);

            if (is_string($value) && str_contains($value, 'data:image/')) {
                $converted = $this->convertBase64Recursive($value, $field);
                if ($converted !== $value) {
                    $dirty[$field] = $converted;
                }
            } elseif (is_array($value)) {
                $converted = $this->convertBase64Recursive($value, $field);
                if ($converted !== $value) {
                    $dirty[$field] = $converted;
                }
            }
        }

        if ($dirty !== []) {
            $settings->update($dirty);
            return $settings->fresh() ?? $settings;
        }

        return $settings;
    }

    /**
     * Rekursif memindai string atau array untuk mengonversi data:image/...;base64,...
     */
    protected function convertBase64Recursive(mixed $value, string $prefix): mixed
    {
        if (is_string($value)) {
            if (str_starts_with(ltrim($value), 'data:image/')) {
                $storedUrl = $this->storeBase64Image($value, $prefix);
                return $storedUrl ?? $value;
            }
            return $value;
        }

        if (is_array($value)) {
            $result = [];
            foreach ($value as $k => $v) {
                $childPrefix = is_string($k) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $k) : $prefix;
                $result[$k] = $this->convertBase64Recursive($v, $childPrefix ?: $prefix);
            }
            return $result;
        }

        return $value;
    }

    /**
     * Menyimpan satu string data:image/...;base64,... ke disk public/settings dan mengembalikan URL /storage/settings/...
     */
    protected function storeBase64Image(string $value, string $prefix): ?string
    {
        if (! preg_match('/^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/s', trim($value), $matches)) {
            return null;
        }

        $mimeSub = strtolower($matches[1]);
        $extension = match ($mimeSub) {
            'jpeg', 'jpg' => 'jpg',
            'png' => 'png',
            'webp' => 'webp',
            'gif' => 'gif',
            'svg+xml', 'svg' => 'svg',
            'x-icon', 'vnd.microsoft.icon', 'ico' => 'ico',
            default => 'png',
        };

        $binary = base64_decode(str_replace(' ', '+', $matches[2]), true);
        if ($binary === false || $binary === '') {
            return null;
        }

        $safePrefix = substr(preg_replace('/[^a-zA-Z0-9_-]/', '', $prefix) ?: 'setting', 0, 32);
        $hash = substr(sha1($binary), 0, 12);
        $relativePath = "settings/{$safePrefix}_{$hash}.{$extension}";

        if (! Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->put($relativePath, $binary);
        }

        return '/storage/' . $relativePath;
    }
}
