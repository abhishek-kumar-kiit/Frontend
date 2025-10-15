// src/components/EditRoleModal.tsx

import React, { useState } from 'react';
import type { User } from '../types';
import Modal from './Modal';
import Button from './Button';

interface EditRoleModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, newRole: 'Student' | 'Instructor') => Promise<void>;
  isSaving: boolean;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({ user, isOpen, onClose, onSave, isSaving }) => {
  if (!isOpen || !user) return null;

  const [selectedRole, setSelectedRole] = useState<'Student' | 'Instructor'>(user.role as 'Student' | 'Instructor');

  const handleSave = async () => {
    await onSave(user._id, selectedRole);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Role for ${user.name}`}>
      <div className="space-y-4">
        <p>Current Role: <span className="font-semibold">{user.role}</span></p>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">New Role</label>
          <select
            id="role"
            name="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as 'Student' | 'Instructor')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300">
            Cancel
          </button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditRoleModal;