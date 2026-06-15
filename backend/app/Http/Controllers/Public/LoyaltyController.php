<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyPointAction;
use App\Models\LoyaltyTier;

class LoyaltyController extends Controller
{
    public function tiers()
    {
        $tiers = LoyaltyTier::active()->ordered()->get();

        return response()->json($tiers->map(fn ($tier) => [
            'id' => $tier->id,
            'name' => $tier->name,
            'slug' => $tier->slug,
            'range' => $tier->max_points
                ? "{$tier->min_points} – {$tier->max_points} pts"
                : "{$tier->min_points}+ pts",
            'min_points' => (int) $tier->min_points,
            'max_points' => $tier->max_points !== null ? (int) $tier->max_points : null,
            'color' => $tier->color,
            'bg_color' => $tier->bg_color,
            'border_color' => $tier->border_color,
            'icon' => $tier->icon,
            'benefits' => $tier->benefits ?? [],
            'investment_text' => $tier->investment_text,
            'is_featured' => (bool) $tier->is_featured,
            'sort_order' => (int) $tier->sort_order,
        ]));
    }

    public function pointActions()
    {
        $actions = LoyaltyPointAction::active()->ordered()->get();

        return response()->json($actions->map(fn ($action) => [
            'id' => $action->id,
            'action' => $action->action,
            'slug' => $action->slug,
            'points' => (int) $action->points,
            'points_type' => $action->points_type,
            'icon' => $action->icon,
            'color' => $action->color,
            'description' => $action->description,
            'is_active' => (bool) $action->is_active,
            'sort_order' => (int) $action->sort_order,
        ]));
    }
}
