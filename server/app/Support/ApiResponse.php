<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    private function ok(mixed $data = null, ?array $meta = null, string $message = 'Success', int $status = 200): JsonResponse
    {
        $payload = [
            'data' => $data,
            'message' => $message,
        ];

        if ($meta !== null) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $status);
    }

    private function created(mixed $data = null, string $message = 'Created'): JsonResponse
    {
        return $this->ok($data, null, $message, 201);
    }

    private function noContent(): JsonResponse
    {
        return response()->json(null, 204);
    }
}
