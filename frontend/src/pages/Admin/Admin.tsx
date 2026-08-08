import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiActivity, FiCheckCircle, FiClock, FiLayers, FiPlus, FiShield, FiUsers, FiClipboard } from 'react-icons/fi';
import { AdminFilters } from '../../components/admin/AdminFilters';
import { CreateOfficerModal } from '../../components/admin/CreateOfficerModal';
import { useAuth } from '../../context/AuthContext';
import {
  adminData,
  defaultAdminFilters,
  fetchAdminOverview,
  filterAdminData,
  updateUserRole,
} from '../../services/adminService';
import { assignOfficerToReport } from '../../services/reportManagementService';
import type { AdminFilters as Filters, AdminTab } from '../../types/admin';
import './Admin.css';

const tabs: AdminTab[] = ['Users', 'Officers', 'Departments', 'Reports', 'Audit Logs', 'Settings'];

interface RowProp {
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

const renderTable = (headers: string[], rows: React.ReactNode[][], rowProps?: RowProp[]) => (
  <div className="admin-table__scroll">
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const props = rowProps?.[index];
          return (
            <tr
              key={index}
              onClick={props?.onClick}
              className={props?.className}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export const Admin = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tab, setTab] = useState<AdminTab>('Users');
  const [filters, setFilters] = useState<Filters>(defaultAdminFilters);
  const [page, setPage] = useState(0);
  const [notice, setNotice] = useState('');
  const [dataState, setDataState] = useState(adminData);
  const [loading, setLoading] = useState(true);
  const [isCreateOfficerModalOpen, setIsCreateOfficerModalOpen] = useState(false);
  const [roleUpdatingId, setRoleUpdatingId] = useState<string | null>(null);
  const [assigningReportId, setAssigningReportId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const overview = await fetchAdminOverview();
      setDataState(overview);
    } catch (error) {
      setNotice('Unable to load admin data from the backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const data = useMemo(() => filterAdminData(dataState, filters), [dataState, filters]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 4000);
  };

  const handleRoleChange = async (userId: string, targetRole: 'USER' | 'OFFICER' | 'ADMIN') => {
    try {
      setRoleUpdatingId(userId);
      await updateUserRole(userId, targetRole);
      showNotice(`Role updated successfully.`);
      await loadData();
    } catch (err: any) {
      showNotice(err.message || 'Failed to update user role.');
    } finally {
      setRoleUpdatingId(null);
    }
  };

  const mapDisplayRoleToBackend = (displayRole: string): 'USER' | 'OFFICER' | 'ADMIN' => {
    if (displayRole === 'Administrator') return 'ADMIN';
    if (displayRole === 'Officer') return 'OFFICER';
    return 'USER';
  };

  const renderTabContent = () => {
    if (tab === 'Users') {
      const users = data.users.slice(page * 10, page * 10 + 10);
      return (
        <section className="admin-table">
          <header className="admin-table__header">
            <div>
              <h2>User Directory & Access Control</h2>
              <p>Manage system users, view details, and configure role authorizations.</p>
            </div>
          </header>
          {renderTable(
            ['User ID', 'Name', 'Email', 'Role Authorization', 'Status', 'Created Date', 'Role Action'],
            users.map((user) => {
              const isSelf = currentUser && (currentUser.id === user.id || currentUser.email === user.email);
              const currentBackendRole = mapDisplayRoleToBackend(user.role);

              return [
                <code key="id" className="admin-code">{user.id.slice(0, 8)}...</code>,
                user.name,
                user.email,
                <b key="role" className={`admin-role admin-role--${currentBackendRole.toLowerCase()}`}>
                  {user.role}
                </b>,
                <b key="status" className={`admin-status admin-status--${user.status.toLowerCase()}`}>
                  {user.status}
                </b>,
                user.createdAt,
                isSelf ? (
                  <span key="action" className="admin-self-tag" title="You cannot change your own role">
                    Current Admin (Self)
                  </span>
                ) : (
                  <div key="action" className="admin-actions">
                    <select
                      className="admin-role-select"
                      value={currentBackendRole}
                      disabled={roleUpdatingId === user.id}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value as 'USER' | 'OFFICER' | 'ADMIN')
                      }
                    >
                      <option value="USER">Citizen (USER)</option>
                      <option value="OFFICER">Officer (OFFICER)</option>
                      <option value="ADMIN">Admin (ADMIN)</option>
                    </select>
                  </div>
                ),
              ];
            })
          )}
          <footer>
            <span>Showing {users.length} of {data.users.length} users</span>
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <button disabled={(page + 1) * 10 >= data.users.length} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </footer>
        </section>
      );
    }

    if (tab === 'Officers') {
      const officers = data.officers.slice(page * 10, page * 10 + 10);
      return (
        <section className="admin-table">
          <header className="admin-table__header">
            <div>
              <h2>Officer Management</h2>
              <p>View registered municipal officers, badge credentials, and departmental status.</p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={() => setIsCreateOfficerModalOpen(true)}
            >
              <FiPlus /> Create Officer Account
            </button>
          </header>

          {data.officers.length === 0 ? (
            <div className="admin-empty-state">
              <FiShield className="admin-empty-state__icon" />
              <h3>No Officers Found</h3>
              <p>There are currently no officer accounts provisioned in the system.</p>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={() => setIsCreateOfficerModalOpen(true)}
              >
                <FiPlus /> Create First Officer Account
              </button>
            </div>
          ) : (
            renderTable(
              ['Badge #', 'Officer Name', 'Email Address', 'Department', 'Status', 'Availability'],
              officers.map((officer) => [
                <code key="badge" className="admin-code">{officer.badgeNumber || 'N/A'}</code>,
                officer.name,
                officer.email || 'N/A',
                officer.department,
                <b key="status" className="admin-status admin-status--active">
                  {officer.status}
                </b>,
                <b key="avail" className="admin-status admin-status--active">
                  {officer.availability}
                </b>,
              ])
            )
          )}

          <footer>
            <span>Showing {officers.length} of {data.officers.length} officers</span>
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <button disabled={(page + 1) * 10 >= data.officers.length} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </footer>
        </section>
      );
    }

    if (tab === 'Departments') {
      return (
        <section className="admin-departments">
          {data.departments.map((department) => (
            <article key={department.name}>
              <span>DEPARTMENT</span>
              <h2>{department.name}</h2>
              <dl>
                <div>
                  <dt>Officers</dt>
                  <dd>{department.officers}</dd>
                </div>
                <div>
                  <dt>Pending cases</dt>
                  <dd>{department.pending}</dd>
                </div>
                <div>
                  <dt>Resolved cases</dt>
                  <dd>{department.resolved}</dd>
                </div>
              </dl>
              <strong>{department.performance}% performance</strong>
              <i>
                <b className={`admin-departments__progress admin-departments__progress--${department.performance}`} />
              </i>
            </article>
          ))}
        </section>
      );
    }

    if (tab === 'Reports') {
      const reports = data.reports.slice(page * 10, page * 10 + 10);
      return (
        <section className="admin-table">
          <header className="admin-table__header">
            <div>
              <h2>Report Management</h2>
              <p>Monitor submitted road safety incidents and dispatch resolutions.</p>
            </div>
          </header>
          {data.reports.length === 0 ? (
            <div className="admin-empty-state">
              <FiClipboard className="admin-empty-state__icon" />
              <h3>No Reports Found</h3>
              <p>There are currently no reports submitted matching the selected filters.</p>
            </div>
          ) : (
            renderTable(
              ['Report ID', 'Title', 'Severity', 'City', 'Assigned Officer', 'Status', 'Verification', 'Action'],
              reports.map((report) => [
                <Link
                  key="id"
                  to={`/report/${report.id}`}
                  className="admin-code-link"
                  title="View details"
                  onClick={(e) => e.stopPropagation()}
                >
                  <code className="admin-code">{report.id.slice(0, 8)}...</code>
                </Link>,
                <Link
                  key="title"
                  to={`/report/${report.id}`}
                  className="admin-title-link"
                  title="View details"
                  onClick={(e) => e.stopPropagation()}
                >
                  {report.title}
                </Link>,
                report.severity,
                report.city,
                <div key="assign" className="admin-actions" onClick={(e) => e.stopPropagation()}>
                  <select
                    className="admin-role-select"
                    value={report.officerId || ''}
                    disabled={assigningReportId === report.id}
                    onChange={async (e) => {
                      const selectedOfficerId = e.target.value;
                      if (!selectedOfficerId) return;
                      try {
                        setAssigningReportId(report.id);
                        await assignOfficerToReport(report.id, selectedOfficerId);
                        showNotice('Officer assigned successfully.');
                        await loadData();
                      } catch (err: any) {
                        showNotice(err.message || 'Failed to assign officer.');
                      } finally {
                        setAssigningReportId(null);
                      }
                    }}
                  >
                    <option value="">
                      {report.assignedOfficer ? `Assigned: ${report.assignedOfficer}` : '-- Assign Officer --'}
                    </option>
                    {dataState.officers.map((officer) => (
                      <option key={officer.id || officer.name} value={officer.id}>
                        {officer.name} {officer.badgeNumber ? `[${officer.badgeNumber}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>,
                <b key="status" className={`admin-status admin-status--${report.status.toLowerCase().replace(' ', '-')}`}>
                  {report.status}
                </b>,
                report.verificationStatus || 'Pending',
                <Link
                  key="manage"
                  to={`/report/${report.id}`}
                  className="admin-btn admin-btn--secondary"
                  style={{ textDecoration: 'none', padding: '4px 10px', fontSize: '11px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Manage
                </Link>,
              ]),
              reports.map((report) => ({
                onClick: () => navigate(`/report/${report.id}`),
                className: 'admin-table__row admin-table__row--clickable',
              }))
            )
          )}
          <footer>
            <span>Showing {reports.length} of {data.reports.length} reports</span>
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <button disabled={(page + 1) * 10 >= data.reports.length} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </footer>
        </section>
      );
    }

    if (tab === 'Audit Logs') {
      return (
        <section className="admin-audits">
          <h2>Administrative Audit Logs</h2>
          {data.audits.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>No audit events logged yet.</p>
          ) : (
            data.audits.map((audit) => (
              <article key={audit.id}>
                <i>
                  <FiActivity />
                </i>
                <div>
                  <strong>{audit.action}</strong>
                  <p>{audit.detail}</p>
                  <span>
                    {audit.actor} · {new Date(audit.date).toLocaleString('en-IN')}
                  </span>
                </div>
              </article>
            ))
          )}
        </section>
      );
    }

    return (
      <section className="admin-settings">
        {['General', 'Notifications', 'Security', 'Map', 'AI Configuration'].map((setting, index) => (
          <article key={setting}>
            <h2>{setting}</h2>
            <p>Manage {setting.toLowerCase()} preferences for SafeRoad.</p>
            <label>
              <input type="checkbox" defaultChecked={index % 2 === 0} /> Enable operational configuration
            </label>
            <button type="button" disabled>
              Save changes
            </button>
          </article>
        ))}
      </section>
    );
  };

  const kpis = [
    { label: 'Total Users', value: dataState.users.length, icon: FiUsers },
    { label: 'Active Officers', value: dataState.officers.length, icon: FiShield },
    { label: 'Pending Reports', value: dataState.reports.filter((r) => r.status !== 'Completed').length, icon: FiClock },
    { label: 'Resolved Today', value: dataState.reports.filter((r) => r.status === 'Completed').length, icon: FiCheckCircle },
    { label: 'Departments', value: dataState.departments.length, icon: FiLayers },
    { label: 'Average Resolution', value: '1.8 days', icon: FiActivity },
  ];

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <span>CONTROL CENTRE</span>
          <h1>Admin Portal</h1>
          <p>Manage SafeRoad users, officer accounts, operations, and governance.</p>
        </div>
      </header>

      <AdminFilters
        filters={filters}
        departments={dataState.departments.map((d) => d.name)}
        onChange={(value) => {
          setFilters(value);
          setPage(0);
        }}
        onReset={() => setFilters(defaultAdminFilters)}
      />

      <section className="admin-kpis" aria-label="Administration key performance indicators">
        {kpis.map(({ label, value, icon: Icon }) => (
          <article key={label}>
            <Icon />
            <span>{label}</span>
            <strong>{value}</strong>
            <small>Operational overview</small>
          </article>
        ))}
      </section>

      {loading ? <p style={{ padding: '0 16px 16px' }}>Loading administration data…</p> : null}

      <nav className="admin-tabs" aria-label="Admin portal sections">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? 'admin-tabs__active' : ''}
            type="button"
            onClick={() => {
              setTab(item);
              setPage(0);
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      {renderTabContent()}

      {notice && (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      )}

      <CreateOfficerModal
        isOpen={isCreateOfficerModalOpen}
        onClose={() => setIsCreateOfficerModalOpen(false)}
        onSuccess={() => {
          showNotice('Officer account created successfully.');
          void loadData();
        }}
        departments={dataState.departments.map((d) => d.name)}
      />
    </main>
  );
};
