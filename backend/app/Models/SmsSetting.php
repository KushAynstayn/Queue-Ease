<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SmsSetting extends Model
{
    protected $table = 'sms_settings';

    protected $fillable = [
        'enabled',
        'queue_confirmation_enabled',
        'queue_update_enabled',
        'now_serving_enabled',
        'service_delay_enabled',
        'alert_threshold_minutes',
        'sender_name',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'enabled' => 'boolean',
            'queue_confirmation_enabled' => 'boolean',
            'queue_update_enabled' => 'boolean',
            'now_serving_enabled' => 'boolean',
            'service_delay_enabled' => 'boolean',
            'alert_threshold_minutes' => 'integer',
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