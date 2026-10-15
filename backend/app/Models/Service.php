<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $table = 'services';

    protected $fillable = [
        'name',
        'code',
        'description',
        'estimated_service_minutes',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'estimated_service_minutes' => 'integer',
        ];
    }


    public function counters(): HasMany
    {
        return $this->hasMany(ServiceCounter::class);
    }

    public function queueTransactions(): HasMany
    {
        return $this->hasMany(QueueTransaction::class);
    }

    public function forecastingData(): HasMany
    {
        return $this->hasMany(ForecastingData::class);
    }

    public function forecastResults(): HasMany
    {
        return $this->hasMany(ForecastResult::class);
    }
}