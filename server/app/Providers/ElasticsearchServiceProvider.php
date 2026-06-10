<?php

namespace App\Providers;

use Elasticsearch\Client;
use Elasticsearch\ClientBuilder;
use Illuminate\Support\ServiceProvider;

class ElasticsearchServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(Client::class, function ($app) {
            return ClientBuilder::create()
                ->setHosts($app['config']->get('elasticsearch.hosts'))
                ->build();
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
