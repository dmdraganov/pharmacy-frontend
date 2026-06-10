<?php

namespace App\Support;

use Illuminate\Http\Request;

trait PaginatesArrays
{
    private function paginateArray(array $items, Request $request): array
    {
        $page = max((int) $request->query('page', 1), 1);
        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $total = count($items);

        return [
            'data' => array_slice($items, ($page - 1) * $perPage, $perPage),
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => max((int) ceil($total / $perPage), 1),
            ],
        ];
    }
}
