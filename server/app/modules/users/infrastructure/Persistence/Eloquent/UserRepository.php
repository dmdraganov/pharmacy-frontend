<?php

namespace App\Modules\Users\Infrastructure\Persistence\Eloquent;

use App\Modules\Users\Domain\Role;
use App\Modules\Users\Domain\User;
use App\Modules\Users\Domain\UserRepositoryContract;
use Illuminate\Support\Facades\Hash;

class UserRepository implements UserRepositoryContract
{
    public function find(string $id): ?User
    {
        $userModel = UserModel::find($id);
        if (! $userModel) {
            return null;
        }

        return $this->toDomain($userModel);
    }

    public function findByEmail(string $email): ?User
    {
        $userModel = UserModel::where('email', $email)->first();
        if (! $userModel) {
            return null;
        }

        return $this->toDomain($userModel);
    }

    public function save(User $user): void
    {
        $userModel = UserModel::find($user->id) ?? new UserModel;
        $userModel->id = $user->id;
        $userModel->first_name = $user->firstName;
        $userModel->last_name = $user->lastName;
        $userModel->email = $user->email;
        $userModel->phone = $user->phone;

        if ($user->password) {
            $userModel->password = Hash::make($user->password);
        }

        $userModel->save();

        $roleIds = array_map(fn ($role) => $role->id, $user->roles);
        $userModel->roles()->sync($roleIds);
    }

    public function delete(User $user): void
    {
        UserModel::destroy($user->id);
    }

    private function toDomain(UserModel $userModel): User
    {
        $roles = $userModel->roles->map(fn ($roleModel) => new Role($roleModel->id, $roleModel->name))->all();

        return new User(
            id: $userModel->id,
            firstName: $userModel->first_name,
            lastName: $userModel->last_name,
            email: $userModel->email,
            phone: $userModel->phone,
            password: $userModel->password,
            createdAt: \DateTimeImmutable::createFromInterface($userModel->created_at),
            updatedAt: \DateTimeImmutable::createFromInterface($userModel->updated_at),
            roles: $roles
        );
    }
}
