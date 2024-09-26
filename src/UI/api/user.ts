import { backendFetch, backendQueryClient } from '@/lib/backend-fetch';
import { User } from '@/types/types';

export async function getUserBySlug(slug: string) {
    return backendQueryClient.fetchQuery({
        queryKey: ['user', slug],
        queryFn: () => backendFetch<User, undefined>('/user/slug/' + slug),
    });
}
