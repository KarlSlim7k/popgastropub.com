<?php

namespace App\Http\Controllers;

abstract class Controller
{
    /**
     * Escape a value for safe inclusion in a CSV cell, preventing
     * formula injection in spreadsheet apps (Excel, Sheets, etc).
     */
    protected function csvSafe(mixed $value): string
    {
        $value = (string) ($value ?? '');

        return preg_match('/^[=+\-@\t\r]/', $value) ? "'" . $value : $value;
    }
}
