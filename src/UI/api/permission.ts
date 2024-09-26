import { backendFetch, backendQueryClient } from '@/lib/backend-fetch';
import { Permission } from '@/types/types';

export async function getPermissionByName(name: string) {
    return backendQueryClient.fetchQuery({
        queryKey: ['permission', name],
        queryFn: () => backendFetch<Permission, undefined>('/permission/name/' + name),
    });
}
