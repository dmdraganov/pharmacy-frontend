<?php

namespace App\Modules\Catalog\Domain\Events;

use App\Modules\Catalog\Domain\Product;
use App\Shared\Domain\DomainEvent;

class ProductUpdated implements DomainEvent
{
    public function __construct(public readonly Product $product) {}
}
