<?php

return [
    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI', rtrim(env('APP_URL', 'https://popgastropub.com'), '/').'/api/auth/social/google/callback'),
    ],

    'facebook' => [
        'client_id' => env('FACEBOOK_CLIENT_ID'),
        'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
        'redirect' => env('FACEBOOK_REDIRECT_URI', rtrim(env('APP_URL', 'https://popgastropub.com'), '/').'/api/auth/social/facebook/callback'),
    ],

    'x' => [
        'client_id' => env('X_CLIENT_ID', env('TWITTER_CLIENT_ID')),
        'client_secret' => env('X_CLIENT_SECRET', env('TWITTER_CLIENT_SECRET')),
        'redirect' => env('X_REDIRECT_URI', env('TWITTER_REDIRECT_URI', rtrim(env('APP_URL', 'https://popgastropub.com'), '/').'/api/auth/social/x/callback')),
    ],
];
