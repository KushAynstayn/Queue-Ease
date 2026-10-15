<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SmsNotification extends Model
{
    protected $table = 'sms_notifications';

    protected $fillable = [
        'user_id',
        'queue_transaction_id',
        'recipient_number',
        'message_type',
        'message',
        'status',
        'provider',
        'provider_message_id',
        'sent_at',
        'delivered_at',
        'error_message',
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function queueTransaction(): BelongsTo
    {
        return $this->belongsTo(
            QueueTransaction::class,
            'queue_transaction_id'
        );
    }
}