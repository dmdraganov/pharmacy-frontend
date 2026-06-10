<?php

return [
    'hosts' => explode(',', env('ELASTICSEARCH_HOSTS', 'http://localhost:9200')),
];
