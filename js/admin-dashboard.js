/* ==========================================================================
   STACKLY AGRICULTURE WEBSITE - ADMIN DASHBOARD SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Enforce Authentication Guard (Redirect if not admin)
    const session = checkAuthGuard('admin');
    if (!session) return; // Stop execution if redirected

    // Populate admin welcome
    const adminWelcomeText = document.getElementById('admin-welcome-name');
    const sidebarAdminName = document.getElementById('sidebar-user-name');
    
    if (adminWelcomeText) adminWelcomeText.innerText = session.fullName;
    if (sidebarAdminName) sidebarAdminName.innerText = session.fullName;

    // 2. Collapsible Sidebar Controls
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarToggleMobile = document.getElementById('sidebar-toggle-mobile');
    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    document.querySelector('.dashboard-wrapper').appendChild(sidebarOverlay);

    // Desktop Toggle (Collapse sidebar)
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-collapsed');
        });
    }

    // Mobile Toggle (Open sidebar drawer)
    if (sidebarToggleMobile) {
        sidebarToggleMobile.addEventListener('click', () => {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('open');
        });
    }

    // Close mobile sidebar on overlay click
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('open');
    });

    // Handle window resizing to clean sidebar states
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('open');
        }
    });

    // 3. User Management Modals
    const openModalBtn = document.getElementById('open-add-user-modal');
    const modal = document.getElementById('add-user-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const addUserForm = document.getElementById('add-user-form');

    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', () => {
            modal.classList.add('open');
        });
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('open');
        });
    }

    // Close modal on background click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });
    }

    // 4. CRUD Operations: User Management Table
    const userTableBody = document.getElementById('user-table-body');

    const renderUserTable = () => {
        if (!userTableBody) return;
        const users = JSON.parse(localStorage.getItem('stackly_users')) || [];
        userTableBody.innerHTML = '';

        users.forEach((u, index) => {
            const tr = document.createElement('tr');
            
            // Format status and badges
            const userRole = u.userType || 'user';
            const roleBadge = userRole === 'farmer' ? 'farmer' : 'user';
            const statusLabel = u.status || 'Active';
            const statusBadgeClass = statusLabel.toLowerCase() === 'active' ? 'active' : 'pending';

            tr.innerHTML = `
                <td>
                    <div class="table-user-cell">
                        <div class="table-user-img">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="${u.fullName}">
                        </div>
                        <div class="table-user-details">
                            <h4>${u.fullName || 'Anonymous'}</h4>
                            <p>${u.email || 'N/A'}</p>
                        </div>
                    </div>
                </td>
                <td>${u.phone || 'N/A'}</td>
                <td>${u.location || 'N/A'}</td>
                <td><span class="status-badge ${roleBadge}">${userRole.toUpperCase()}</span></td>
                <td><span class="status-badge ${statusBadgeClass}">${statusLabel}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="table-btn toggle-status" data-index="${index}" title="Toggle Active/Pending">
                            <i class="fa-solid fa-arrows-rotate"></i>
                        </button>
                        <button class="table-btn danger delete-user" data-index="${index}" title="Delete User">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            `;

            userTableBody.appendChild(tr);
        });

        // Update total metrics count on screen
        const totalUsersEl = document.getElementById('metric-total-users');
        const totalFarmersEl = document.getElementById('metric-total-farmers');
        if (totalUsersEl) {
            totalUsersEl.innerText = users.length;
        }
        if (totalFarmersEl) {
            const farmersCount = users.filter(u => u.userType === 'farmer').length;
            totalFarmersEl.innerText = farmersCount;
        }
    };

    // Form submission inside modal to register new user/farmer
    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('modal-fullname').value.trim();
            const email = document.getElementById('modal-email').value.trim();
            const phone = document.getElementById('modal-phone').value.trim();
            const location = document.getElementById('modal-location').value.trim();
            const userType = document.getElementById('modal-usertype').value;

            if (name && email) {
                const users = JSON.parse(localStorage.getItem('stackly_users')) || [];
                
                // Check duplicate
                if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                    alert("Email already exists.");
                    return;
                }

                users.push({
                    fullName: name,
                    email: email,
                    phone: phone,
                    location: location,
                    userType: userType,
                    password: 'password123', // default mock password
                    status: 'Active'
                });

                localStorage.setItem('stackly_users', JSON.stringify(users));
                renderUserTable();
                
                addUserForm.reset();
                modal.classList.remove('open');
            }
        });
    }

    // Delegate table button clicks (Delete / Toggle Status)
    if (userTableBody) {
        userTableBody.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const index = btn.getAttribute('data-index');
            const users = JSON.parse(localStorage.getItem('stackly_users')) || [];

            if (btn.classList.contains('delete-user')) {
                if (confirm(`Are you sure you want to delete ${users[index].fullName}?`)) {
                    users.splice(index, 1);
                    localStorage.setItem('stackly_users', JSON.stringify(users));
                    renderUserTable();
                }
            } else if (btn.classList.contains('toggle-status')) {
                const currentStatus = users[index].status || 'Active';
                users[index].status = currentStatus === 'Active' ? 'Pending' : 'Active';
                localStorage.setItem('stackly_users', JSON.stringify(users));
                renderUserTable();
            }
        });
    }

    // Render initial table data
    renderUserTable();

    // 5. Initialize Charts (Chart.js CDN)
    if (typeof Chart !== 'undefined') {
        initAdminRevenueChart();
        initAdminUserGrowthChart();
    } else {
        console.warn("Chart.js library not loaded. Visual graphs will be unavailable.");
    }
});

/**
 * Line Chart: Monthly Revenue
 */
function initAdminRevenueChart() {
    const ctx = document.getElementById('adminRevenueChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Revenue ($)',
                data: [14200, 18500, 16900, 24000, 29800, 35000],
                borderColor: '#1B5E20',
                backgroundColor: 'rgba(27, 94, 32, 0.05)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { font: { family: 'Inter' } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter' } }
                }
            }
        }
    });
}

/**
 * Bar Chart: User Growth
 */
function initAdminUserGrowthChart() {
    const ctx = document.getElementById('adminUserGrowthChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Farmers Registered',
                    data: [15, 22, 28, 35, 45, 52],
                    backgroundColor: '#1B5E20', // Green
                    borderRadius: 4
                },
                {
                    label: 'Regular Users',
                    data: [35, 48, 52, 60, 72, 85],
                    backgroundColor: '#5D4037', // Brown
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { family: 'Outfit', size: 12 } }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { font: { family: 'Inter' } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter' } }
                }
            }
        }
    });
}
