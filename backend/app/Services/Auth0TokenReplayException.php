<?php

namespace App\Services;

use RuntimeException;

/**
 * Un ID token válido, ya usado antes, se presenta de nuevo (recarga de página,
 * doble intento). Se distingue de un token inválido para que el llamador pueda
 * reaccionar distinto: revisar si la sesión ya quedó establecida en vez de
 * mostrar un error genérico.
 */
class Auth0TokenReplayException extends RuntimeException
{
}
