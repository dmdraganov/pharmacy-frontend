<?php

namespace App\Modules\Users\Infrastructure\Persistence\Eloquent;

use App\Modules\Users\Domain\Role;
use App\Modules\Users\Domain\RoleRepositoryContract;

class RoleRepository implements RoleRepositoryContract
{
    public function find(int $id): ?Role
    {
        $roleModel = RoleModel::find($id);
        if (! $roleModel) {
            return null;
        }

        return $this->toDomain($roleModel);
    }

    public function findByName(string $name): ?Role
    {
        $roleModel = RoleModel::where('name', $name)->first();
        if (! $roleModel) {
            return null;
        }

        return $this->toDomain($roleModel);
    }

    private function toDomain(RoleModel $roleModel): Role
    {
        return new Role(
            id: $roleModel->id,
            name: $roleModel->name
        );
    }
}
