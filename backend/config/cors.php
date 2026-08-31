<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    'allowed_origins' => array_values(array_filter([
        'https://popgastropub.com',
        'https://www.popgastropub.com',
        env('CORS_EXTRA_ORIGIN'),
    ])),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-CSRF-TOKEN', 'X-XSRF-TOKEN'],
    'exposed_headers' => [],
    'max_age' => 86400,
    'supports_credentials' => true,
];
