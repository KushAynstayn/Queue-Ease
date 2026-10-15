<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceCounter extends Model
{
    protected $table = 'service_counters';

    protected $fillable = [
        'service_id',
        'counter_number',
        'name',
        'status',
        'assigned_staff_id',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function assignedStaff(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'assigned_staff_id'
        );
    }

    public function queueTransactions(): HasMany
    {
        return $this->hasMany(
            QueueTransaction::class,
            'counter_id'
        );
    }
}