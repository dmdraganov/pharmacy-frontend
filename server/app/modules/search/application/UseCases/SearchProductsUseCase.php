<?php

namespace App\Modules\Search\Application\UseCases;

use App\Shared\Application\UseCase;
use Elasticsearch\Client;

class SearchProductsUseCase implements UseCase
{
    private Client $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function __invoke(string $query): array
    {
        $params = [
            'index' => 'products',
            'body' => [
                'query' => [
                    'multi_match' => [
                        'query' => $query,
                        'fields' => ['name', 'description'],
                    ],
                ],
            ],
        ];

        $response = $this->client->search($params);

        return $response['hits']['hits'];
    }
}
