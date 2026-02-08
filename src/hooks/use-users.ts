import {
  userService,
  type AdminUser,
  type ICreateUser,
  type PaginatedUsers,
} from "@/services/user-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type UserType = "ADMIN" | "AGENT" | "BASIC";

export function generateUsersQueryKeys(userType: UserType) {
  const scope = userType.toLowerCase();
  return {
    listKey: [scope, "list"] as const,
    itemKey: [scope, "details"] as const,
  };
}

export function useFetchUser(userType: UserType) {
  const queryKey = generateUsersQueryKeys(userType);
  const { data, isLoading, refetch } = useQuery<PaginatedUsers>({
    queryKey: queryKey.listKey,
    queryFn: async () => userService.getUsers(userType),
  });

  return {
    list: data,
    isLoading,
    refetch,
  };
}

export function useGetUser(userType: UserType, id?: string) {
  const queryKey = generateUsersQueryKeys(userType);

  return useQuery<AdminUser>({
    queryKey: [...queryKey.itemKey, id],
    queryFn: () => userService.getUser(id as string),
    enabled: Boolean(id),
  });
}

export type UpdateUserStatusInput = {
  id: string;
  status: "SUSPENDED" | "ACTIVE";
};

export type CreateUserOptions = {
  onSuccess?: (user: AdminUser) => void;
  onError?: (error: unknown) => void;
};

export function useCreateUser(userType: UserType, options?: CreateUserOptions) {
  const queryClient = useQueryClient();
  const queryKey = generateUsersQueryKeys(userType);

  return useMutation({
    mutationFn: (payload: ICreateUser) =>
      userService.createUser({
        ...payload,
        type: userType,
      }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: queryKey.listKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey.itemKey, created.id] });
      options?.onSuccess?.(created);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}

export function useUpdateUser(userType: UserType) {
  const queryClient = useQueryClient();
  const queryKey = generateUsersQueryKeys(userType);

  return useMutation({
    mutationFn: ({ id, status }: UpdateUserStatusInput) =>
      userService.updateAdminStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKey.listKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey.itemKey, updated.id] });
    },
  });
}
