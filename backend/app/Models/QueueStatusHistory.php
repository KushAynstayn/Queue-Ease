<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QueueStatusHistory extends Model
{
    protected $table = 'queue_status_history';

    protected $fillable = [
        'queue_transaction_id',
        'previous_status',
        'new_status',
        'changed_by',
        'notes',
    ];

    public function queueTransaction(): BelongsTo
    {
        return $this->belongsTo(
            QueueTransaction::class,
            'queue_transaction_id'
        );
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'changed_by'
        );
    }
}