<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class ActivityLogService
{
    public function record(
        Request $request,
        string $action,
        string $module,
        string $description,
        ?Model $target = null
    ): void {
        try {
            $user = $request->user();

            ActivityLog::create([
                'user_id' => $user?->id,
                'action' => $action,
                'description' => $description,
                'module' => $module,
                'target_type' => $target
                    ? class_basename($target)
                    : null,
                'target_id' => $target?->getKey(),
                'ip_address' => $request->ip(),
                'created_at' => now(),
            ]);
        } catch (Throwable $exception) {
            Log::error('Queue Ease activity logging failed.', [
                'action' => $action,
                'module' => $module,
                'exception' => $exception->getMessage(),
            ]);
        }
    }
}