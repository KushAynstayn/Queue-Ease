<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Setting extends Model
{
    protected $table = 'settings';

    protected $fillable = [
        'system_name',
        'organization_name',
        'queue_prefix',
        'academic_year',
        'estimated_service_minutes',
        'daily_queue_reset',
        'maximum_queue_capacity',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'estimated_service_minutes' => 'integer',
            'daily_queue_reset' => 'boolean',
            'maximum_queue_capacity' => 'integer',
        ];
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'updated_by'
        );
    }
}