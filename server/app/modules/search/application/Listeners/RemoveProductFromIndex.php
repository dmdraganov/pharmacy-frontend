<?php

namespace App\Modules\Search\Application\Listeners;

use App\Modules\Catalog\Domain\Events\ProductDeleted;
use Elasticsearch\Client;

class RemoveProductFromIndex
{
    private Client $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function handle(ProductDeleted $event): void
    {
        $this->client->delete([
            'index' => 'products',
            'id' => $event->product->id,
        ]);
    }
}
