<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    /**
     * Return a successful API response.
     */
    public static function success(
        string $message = 'Request successful.',
        mixed $data = null,
        int $status = 200
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    /**
     * Return an error API response.
     */
    public static function error(
        string $message = 'Something went wrong.',
        mixed $errors = null,
        int $status = 400
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    /**
     * Return a validation error response.
     */
    public static function validation(
        mixed $errors,
        string $message = 'Validation failed.'
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], 422);
    }

    /**
     * Return an unauthorized response.
     */
    public static function unauthorized(
        string $message = 'Unauthorized.'
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => null,
        ], 401);
    }

    /**
     * Return a forbidden response.
     */
    public static function forbidden(
        string $message = 'Forbidden.'
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => null,
        ], 403);
    }

    /**
     * Return a not found response.
     */
    public static function notFound(
        string $message = 'Resource not found.'
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => null,
        ], 404);
    }
}