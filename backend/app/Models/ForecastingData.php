<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ForecastingData extends Model
{
    protected $table = 'forecasting_data';

    protected $fillable = [
        'service_id',
        'forecast_date',
        'day_of_week',
        'total_transactions',
        'completed_transactions',
        'average_wait_minutes',
        'average_service_minutes',
        'peak_hour',
    ];

    protected function casts(): array
    {
        return [
            'forecast_date' => 'date',
            'total_transactions' => 'integer',
            'completed_transactions' => 'integer',
            'average_wait_minutes' => 'decimal:2',
            'average_service_minutes' => 'decimal:2',
            'peak_hour' => 'integer',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}