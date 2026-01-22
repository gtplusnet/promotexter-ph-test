import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { User } from './types/user.types';
import { UserList } from './components/UserList/UserList';
import { CreateUserModal } from './components/UserForms/CreateUserModal';
import { EditUserModal } from './components/UserForms/EditUserModal';
import { DeleteDialog } from './components/Dialogs/DeleteDialog';
import { RestoreDialog } from './components/Dialogs/RestoreDialog';
import { queryClient } from './lib/query-client';
import { useDeleteUser, useRestoreUser } from './hooks/useUserMutations';
import './App.css';

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const deleteUserMutation = useDeleteUser();
  const restoreUserMutation = useRestoreUser();

  const handleCreateUser = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleRestoreUser = (user: User) => {
    setSelectedUser(user);
    setIsRestoreDialogOpen(true);
  };

  const handleCreate = () => {
    // Modal handles the API call via useCreateUser
    // This callback is for closing the modal after success
    setIsCreateModalOpen(false);
  };

  const handleUpdate = () => {
    // Modal handles the API call via useUpdateUser
    // This callback is for closing the modal after success
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedUser) return;

    deleteUserMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
      },
      onError: (error) => {
        console.error('Delete failed:', error);
        // Optionally keep dialog open and show error
      },
    });
  };

  const handleConfirmRestore = () => {
    if (!selectedUser) return;

    restoreUserMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        setIsRestoreDialogOpen(false);
        setSelectedUser(null);
      },
      onError: (error) => {
        console.error('Restore failed:', error);
        // Optionally keep dialog open and show error
      },
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <UserList
          onCreateUser={handleCreateUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onRestoreUser={handleRestoreUser}
        />

        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreate}
        />

        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUpdate}
          user={selectedUser}
        />

        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleConfirmDelete}
          user={selectedUser}
        />

        <RestoreDialog
          isOpen={isRestoreDialogOpen}
          onClose={() => {
            setIsRestoreDialogOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleConfirmRestore}
          user={selectedUser}
        />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
