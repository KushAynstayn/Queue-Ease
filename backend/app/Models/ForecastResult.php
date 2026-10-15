<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ForecastResult extends Model
{
    protected $table = 'forecast_results';

    protected $fillable = [
        'service_id',
        'forecast_date',
        'predicted_transactions',
        'predicted_wait_minutes',
        'predicted_peak_hour',
        'model_name',
        'model_version',
        'confidence_score',
    ];

    protected function casts(): array
    {
        return [
            'forecast_date' => 'date',
            'predicted_transactions' => 'integer',
            'predicted_wait_minutes' => 'decimal:2',
            'predicted_peak_hour' => 'integer',
            'confidence_score' => 'decimal:2',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}