import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { User, UserFormData } from './types/user.types';
import { UserList } from './components/UserList/UserList';
import { CreateUserModal } from './components/UserForms/CreateUserModal';
import { EditUserModal } from './components/UserForms/EditUserModal';
import { DeleteDialog } from './components/Dialogs/DeleteDialog';
import { RestoreDialog } from './components/Dialogs/RestoreDialog';
import { queryClient } from './lib/query-client';
import './App.css';

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  const handleCreate = (data: UserFormData) => {
    console.log('Create user:', data);
    // TODO: API integration
  };

  const handleUpdate = (data: UserFormData) => {
    console.log('Update user:', selectedUser?.id, data);
    // TODO: API integration
  };

  const handleConfirmDelete = () => {
    console.log('Delete user:', selectedUser?.id);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    // TODO: API integration
  };

  const handleConfirmRestore = () => {
    console.log('Restore user:', selectedUser?.id);
    setIsRestoreDialogOpen(false);
    setSelectedUser(null);
    // TODO: API integration
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
