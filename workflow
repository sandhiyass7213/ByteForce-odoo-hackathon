Act as a Senior Next.js Developer. Update `src/app/admin/dashboard/page.tsx` so that sidebar menu items ("HR Analytics", "Leave Approvals", "Employee Directory", "Admin Governance") behave as SEPARATE VIEWS/PAGES rather than rendering all sections stacked on a single long page.

Implement Tab-based Section Switching:
1. Create an active tab state: `const [activeTab, setActiveTab] = useState<'analytics' | 'approvals' | 'directory' | 'governance'>('analytics');`

2. Update Sidebar Navigation Buttons:
   - "HR Analytics" -> sets activeTab to 'analytics'
   - "Leave Approvals" -> sets activeTab to 'approvals'
   - "Employee Directory" -> sets activeTab to 'directory'
   - "Admin Governance" -> sets activeTab to 'governance'
   - Apply active background styling to highlight the currently selected sidebar tab.

3. Render Isolated Views (Show ONLY the selected section):
   - IF activeTab === 'analytics': Show ONLY Header cards (Total Staff: 48, Present Today: 43, Pending: 2, Approved: 3) and High-level HR charts/metrics.
   - IF activeTab === 'approvals': Show ONLY the Leave Requests Approval Table with working 'Approve' and 'Reject' status buttons.
   - IF activeTab === 'directory': Show ONLY the full Employee Directory table (Search bar, Staff photos, Roles, Email, and Department details).
   - IF activeTab === 'governance': Show ONLY Admin privileges, system logs, role permissions management, and access controls.

4. Fix Interactivity:
   - Ensure clicking 'Approve' or 'Reject' on any leave request updates the row state in real-time.
   - Ensure 'use client' directive is present at the top.
