import { motion } from 'framer-motion';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import { getProfile, userHasAccess } from '@/api/auth.ts';
import { getUserList } from '@/api/user.ts';
import usePaginatedResult from '@/components/hooks/use-paginated-result.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import UserEntity from '@/components/ui/entity/user-entity.tsx';
import { Input } from '@/components/ui/input';
import { OrderToggle } from '@/components/ui/order-toggle.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { SimplePagination } from '@/components/ui/simple-pagination.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { denormalizeParams } from '@/lib/backend-fetch.ts';
import {PaginatedResult, Permission, User} from '@/types/types';
import {getPermissionList} from "@/api/permission.ts";

// @ts-expect-error Request is any by react-router dom
export async function userListLoader({ request }) {
  const params = denormalizeParams(new URL(request.url).searchParams);

  await userHasAccess(['SHOW_USERS']);
  const user = await getProfile();
  const userData = await getUserList(params);
  const permissions = await getPermissionList();

  return { user, userData, permissions };
}

export default function ListUsersPage() {
  const { userData } = useLoaderData() as {
    user: User;
    userData: PaginatedResult<User>;
    permissions: PaginatedResult<Permission>
  };

  const {
    data,
    count,
    handleChange,
    filters,
    order,
    handleOrder,
    pageSize,
    setPageSize,
    page,
    setPage,
  } = usePaginatedResult(userData);

  const [search, setSearch] = useState(filters.search ?? '');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPermission, setNewPermission] = useState<Permission | null>(null);

  const toggleRowExpansion = (userId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(userId)) {
      newExpandedRows.delete(userId);
    } else {
      newExpandedRows.add(userId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleSearch = () => {
    handleChange({ filters: { ...filters, search }, page: 1 });
  };

  // const handleAddPermission = () => {
  //   if (selectedUser && newPermission) {
  //     const updatedUser = {
  //       ...selectedUser,
  //       permissions: [
  //         ...selectedUser.permissions,
  //         { id: Date.now(), ...newPermission, users: [] },
  //       ],
  //     };
  //     setUsers(
  //       users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
  //     );
  //     setSelectedUser(updatedUser);
  //     setNewPermission({ name: '', description: '' });
  //   }
  // };
  //
  // const handleDeletePermission = (permissionId: number) => {
  //   if (selectedUser) {
  //     const updatedUser = {
  //       ...selectedUser,
  //       permissions: selectedUser.permissions.filter(
  //         (p) => p.id !== permissionId,
  //       ),
  //     };
  //     setUsers(
  //       users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
  //     );
  //     setSelectedUser(updatedUser);
  //   }
  // };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <Input
          className="flex-grow"
          placeholder="Search users..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <ScrollArea className="overflow-x-auto h-[76vh]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]"></TableHead>
              <TableHead className="w-[60px]">
                <OrderToggle
                  name="ID"
                  state={order.id}
                  onChange={() => handleOrder('id')}
                />
              </TableHead>
              <TableHead className="w-[300px]">
                <OrderToggle
                  name="Name"
                  state={order.full_name}
                  onChange={() => handleOrder('full_name')}
                />
              </TableHead>
              <TableHead className="w-[300px]">
                <OrderToggle
                  name="Email"
                  state={order.email}
                  onChange={() => handleOrder('email')}
                />
              </TableHead>
              <TableHead className="w-[60px]">
                <OrderToggle
                  name="Active"
                  state={order.is_active}
                  onChange={() => handleOrder('is_active')}
                />
              </TableHead>
              <TableHead className="w-[60px]">
                <OrderToggle
                  name="Disabled"
                  state={order.is_disabled}
                  onChange={() => handleOrder('is_disabled')}
                />
              </TableHead>
              <TableHead className={'w-[120px]'}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user: User) => (
              <React.Fragment key={user.id}>
                <TableRow>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleRowExpansion(user.id)}
                    >
                      <motion.div
                        animate={{
                          rotate: expandedRows.has(user.id) ? -180 : 0,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="w-full flex flex-row justify-center">
                      <Badge variant={user.is_active ? 'success' : 'error'}>
                        {user.is_active ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-full flex flex-row justify-center">
                      <Badge variant={user.is_disabled ? 'error' : 'success'}>
                        {user.is_disabled ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row justify-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedUser(user)}
                          >
                            Manage Permissions
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>
                              Manage Permissions for {user.full_name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {/*<div className="grid grid-cols-4 items-center gap-4">*/}
                            {/*  <Label className="text-right" htmlFor="name">*/}
                            {/*    Name*/}
                            {/*  </Label>*/}
                            {/*  <Input*/}
                            {/*    className="col-span-3"*/}
                            {/*    id="name"*/}
                            {/*    value={newPermission.name}*/}
                            {/*    onChange={(e) =>*/}
                            {/*      setNewPermission({*/}
                            {/*        ...newPermission,*/}
                            {/*        name: e.target.value,*/}
                            {/*      })*/}
                            {/*    }*/}
                            {/*  />*/}
                            {/*</div>*/}
                            {/*<div className="grid grid-cols-4 items-center gap-4">*/}
                            {/*  <Label*/}
                            {/*    className="text-right"*/}
                            {/*    htmlFor="description"*/}
                            {/*  >*/}
                            {/*    Description*/}
                            {/*  </Label>*/}
                            {/*  <Input*/}
                            {/*    className="col-span-3"*/}
                            {/*    id="description"*/}
                            {/*    value={newPermission.description}*/}
                            {/*    onChange={(e) =>*/}
                            {/*      setNewPermission({*/}
                            {/*        ...newPermission,*/}
                            {/*        description: e.target.value,*/}
                            {/*      })*/}
                            {/*    }*/}
                            {/*  />*/}
                            {/*</div>*/}
                            <Button
                              className="ml-auto"
                              // onClick={handleAddPermission}
                            >
                              <Plus className="mr-2 h-4 w-4" /> Add Permission
                            </Button>
                          </div>
                          <div className="mt-4">
                            <h3 className="font-semibold mb-2">
                              Current Permissions
                            </h3>
                            <ul className="space-y-2">
                              {selectedUser?.permissions.map((permission) => (
                                <li
                                  key={permission.id}
                                  className="flex justify-between items-center"
                                >
                                  <span>
                                    {permission.name} - {permission.description}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    // onClick={() =>
                                    //   handleDeletePermission(permission.id)
                                    // }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedRows.has(user.id) && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <UserEntity showStatuses={false} user={user} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="mt-4">
        <SimplePagination
          page={page}
          pageSize={pageSize}
          total={count}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
