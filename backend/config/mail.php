<?php

return [
    'default' => env('MAIL_MAILER', 'smtp'),

    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'scheme' => env('MAIL_SCHEME', 'tls'),
            'host' => env('MAIL_HOST', 'mail.popgastropub.com'),
            'port' => env('MAIL_PORT', 587),
            'auto_tls' => env('MAIL_AUTO_TLS', true),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => 15,
            'verify_peer' => env('MAIL_VERIFY_PEER', false),
            'local_domain' => env('MAIL_EHLO_DOMAIN', parse_url(env('APP_URL', 'https://api.popgastropub.com'), PHP_URL_HOST)),
        ],
        'log' => [
            'transport' => 'log',
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],
        'array' => [
            'transport' => 'array',
        ],
    ],

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'noreply@popgastropub.com'),
        'name' => env('MAIL_FROM_NAME', 'POP Perote'),
    ],

    'facturacion' => [
        'address' => env('FACTURACION_EMAIL', 'facturacion@popgastropub.com'),
    ],
];
