<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $eventDate = $this->event_date ? Carbon::parse($this->event_date)->locale('id') : null;
        $eventTime = $this->event_time ? Carbon::parse($this->event_time)->format('H:i') . ' WIB' : null;

        return [
            'id'                   => $this->id,
            'title'                => $this->title,
            'content'              => $this->content,
            'event_date'           => $this->event_date?->format('Y-m-d'),
            'event_date_formatted' => $eventDate?->translatedFormat('l, d F Y'),
            'event_time'           => $this->event_time,
            'event_time_formatted' => $eventTime,
            'location'             => $this->location,
            'type'                 => $this->type,
            'type_label'           => $this->type_label,
            'is_active'            => (bool) $this->is_active,
            'is_pinned'            => (bool) $this->is_pinned,
            'is_expired'           => $this->is_expired,
            'is_event_past'        => $this->is_event_past,
            'expires_at'           => $this->expires_at?->toIso8601String(),
            'created_at'           => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at ? Carbon::parse($this->created_at)->locale('id')->translatedFormat('d F Y') : null,

            // Author jika di-load
            'author'               => new AuthorResource($this->whenLoaded('author')),
        ];
    }
}
