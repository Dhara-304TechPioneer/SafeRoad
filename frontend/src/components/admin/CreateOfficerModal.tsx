import { useState, type FormEvent } from 'react';
import { FiAlertCircle, FiBriefcase, FiCheckCircle, FiLock, FiMail, FiShield, FiUser, FiX } from 'react-icons/fi';
import { createOfficer } from '../../services/adminService';
import type { CreateOfficerInput } from '../../types/admin';

interface CreateOfficerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  departments?: string[];
}

export const CreateOfficerModal = ({ isOpen, onClose, onSuccess, departments = [] }: CreateOfficerModalProps) => {
  const [formData, setFormData] = useState<CreateOfficerInput>({
    fullName: '',
    email: '',
    password: '',
    departmentName: 'Road Maintenance',
    badgeNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleChange = (field: keyof CreateOfficerInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client validation
    if (!formData.fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('A valid email address is required.');
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setLoading(true);
      const payload: CreateOfficerInput = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        departmentName: formData.departmentName?.trim() || 'Road Maintenance',
        badgeNumber: formData.badgeNumber?.trim() || undefined,
      };

      await createOfficer(payload);
      setSuccess(`Officer account created successfully for ${formData.email}!`);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        departmentName: 'Road Maintenance',
        badgeNumber: '',
      });

      setTimeout(() => {
        setSuccess('');
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create officer account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="create-officer-title">
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <header className="admin-modal__header">
          <div>
            <span className="admin-modal__tag"><FiShield /> MUNICIPAL GOVERNANCE</span>
            <h2 id="create-officer-title">Create Officer Account</h2>
            <p>Provision credentials and badge authorization for field officers.</p>
          </div>
          <button type="button" className="admin-modal__close" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="admin-modal__form">
          {error && (
            <div className="admin-modal__banner admin-modal__banner--error" role="alert">
              <FiAlertCircle /> <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="admin-modal__banner admin-modal__banner--success" role="status">
              <FiCheckCircle /> <span>{success}</span>
            </div>
          )}

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="officer-fullname">
                <FiUser /> Full Name *
              </label>
              <input
                id="officer-fullname"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. Officer Rajesh Kumar"
                disabled={loading}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="officer-email">
                <FiMail /> Email Address *
              </label>
              <input
                id="officer-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="officer.rajesh@roads.gov.in"
                disabled={loading}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="officer-password">
                <FiLock /> Temporary Password *
              </label>
              <input
                id="officer-password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="At least 8 characters"
                disabled={loading}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="officer-badge">
                <FiShield /> Badge Number
              </label>
              <input
                id="officer-badge"
                type="text"
                value={formData.badgeNumber}
                onChange={(e) => handleChange('badgeNumber', e.target.value)}
                placeholder="e.g. OFF-40291 (Auto-generated if empty)"
                disabled={loading}
              />
            </div>

            <div className="admin-form-group admin-form-group--full">
              <label htmlFor="officer-department">
                <FiBriefcase /> Department
              </label>
              <input
                id="officer-department"
                type="text"
                list="department-suggestions"
                value={formData.departmentName}
                onChange={(e) => handleChange('departmentName', e.target.value)}
                placeholder="e.g. Road Maintenance, Traffic Control"
                disabled={loading}
              />
              <datalist id="department-suggestions">
                {departments.map((dept) => (
                  <option key={dept} value={dept} />
                ))}
                <option value="Road Maintenance" />
                <option value="Traffic Control" />
                <option value="Public Works" />
                <option value="Infrastructure & Safety" />
              </datalist>
            </div>
          </div>

          <footer className="admin-modal__footer">
            <button type="button" className="admin-btn admin-btn--secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
              {loading ? 'Creating Officer...' : 'Create Officer Account'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};
