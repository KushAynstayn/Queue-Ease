<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QueueTransaction extends Model
{
    protected $table = 'queue_transactions';

    protected $fillable = [
        'client_id',
        'service_id',
        'counter_id',
        'queue_number',
        'queue_date',
        'status',
        'priority',
        'position_number',
        'estimated_wait_minutes',
        'actual_wait_minutes',
        'service_duration_minutes',
        'requested_at',
        'called_at',
        'serving_at',
        'completed_at',
        'served_by',
    ];

    protected function casts(): array
    {
        return [
            'queue_date' => 'date',
            'position_number' => 'integer',
            'estimated_wait_minutes' => 'integer',
            'actual_wait_minutes' => 'integer',
            'service_duration_minutes' => 'integer',
            'requested_at' => 'datetime',
            'called_at' => 'datetime',
            'serving_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function counter(): BelongsTo
    {
        return $this->belongsTo(
            ServiceCounter::class,
            'counter_id'
        );
    }

    public function servedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'served_by'
        );
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(
            QueueStatusHistory::class,
            'queue_transaction_id'
        );
    }

    public function smsNotifications(): HasMany
    {
        return $this->hasMany(
            SmsNotification::class,
            'queue_transaction_id'
        );
    }
}