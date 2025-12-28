<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
<<<<<<< HEAD
        'name',
        'username',
        'email',
        'password',
        'role',
    ];

=======
    'name',
    'email',
    'password',
    'is_admin'
  ];
  
  protected $casts = [
    'email_verified_at' => 'datetime',
    'password' => 'hashed',
    'is_admin' => 'boolean',
];
>>>>>>> e606a7b (liason ouverture de session et autres)
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
 
}
