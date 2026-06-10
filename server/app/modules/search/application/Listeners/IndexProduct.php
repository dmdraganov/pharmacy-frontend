<?php

namespace App\Modules\Search\Application\Listeners;

use App\Modules\Catalog\Domain\Events\ProductCreated;
use App\Modules\Catalog\Domain\Events\ProductUpdated;
use Elasticsearch\Client;

class IndexProduct
{
    private Client $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function handle(ProductCreated|ProductUpdated $event): void
    {
        $this->client->index([
            'index' => 'products',
            'id' => $event->product->id,
            'body' => [
                'name' => $event->product->name,
                'slug' => $event->product->slug,
                'description' => $event->product->description,
                'price' => $event->product->price,
                'is_prescription' => $event->product->isPrescription,
                'category_id' => $event->product->categoryId,
                'brand_id' => $event->product->brandId,
                'manufacturer_id' => $event->product->manufacturerId,
            ],
        ]);
    }
}
