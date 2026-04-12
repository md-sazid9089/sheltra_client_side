<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Skill Model
 * 
 * Represents skill catalog.
 */
class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'description',
    ];

    public function refugeeSkills()
    {
        return $this->hasMany(RefugeeSkill::class);
    }
}
