<?php

namespace App\Enum;

enum PermissionEnum: string
{
    case SHOW_USERS = 'Permission to view users';
    case UPDATE_USERS = 'Permission to create/update/delete users';
    case SHOW_PERMISSIONS = 'Permission to view permissions';
    case UPDATE_PERMISSIONS = 'Permission to create/update/delete permissions';
    case MANAGE_PERMISSIONS = 'Permission to manage user permissions';

    public static function all(): array
    {
        return [
            self::SHOW_USERS->name => self::SHOW_USERS->value,
            self::UPDATE_USERS->name => self::UPDATE_USERS->value,
            self::SHOW_PERMISSIONS->name => self::SHOW_PERMISSIONS->value,
            self::UPDATE_PERMISSIONS->name => self::UPDATE_PERMISSIONS->value,
            self::MANAGE_PERMISSIONS->name => self::MANAGE_PERMISSIONS->value,
        ];
    }

    public static function keys(): array
    {
        return [
            self::SHOW_USERS->name,
            self::UPDATE_USERS->name,
            self::SHOW_PERMISSIONS->name,
            self::UPDATE_PERMISSIONS->name,
            self::MANAGE_PERMISSIONS->name,
        ];
    }
}
