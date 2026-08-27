/* ==========================================================================
   STACKLY AGRICULTURE WEBSITE - USER DASHBOARD SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Enforce Authentication Guard (Redirect if not user/farmer)
    const session = checkAuthGuard('user');
    if (!session) return; // Stop execution if redirected

    // 2. Populate User details in the dashboard
    const userRoleText = document.getElementById('user-role-text');
    const userWelcomeText = document.getElementById('user-welcome-name');
    const sidebarUserName = document.getElementById('sidebar-user-name');
    const sidebarUserRole = document.getElementById('sidebar-user-role');
    const userProfileName = document.getElementById('profile-name');

    if (userWelcomeText) userWelcomeText.innerText = session.fullName;
    if (sidebarUserName) sidebarUserName.innerText = session.fullName;
    if (sidebarUserRole) {
        sidebarUserRole.innerText = session.role.charAt(0).toUpperCase() + session.role.slice(1);
    }
    if (userRoleText) {
        userRoleText.innerText = session.role.toUpperCase();
    }
    if (userProfileName) userProfileName.innerText = session.fullName;

    // 3. Collapsible Sidebar Controls
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

    // 4. Initialize Interactive Charts (Chart.js CDN)
    if (typeof Chart !== 'undefined') {
        initCropPerformanceChart();
        initFarmActivityChart();
        initCropHealthChart();
    } else {
        console.warn("Chart.js library not loaded. Visual graphs will be unavailable.");
    }
});

/**
 * Line Chart: Crop Yield Performance
 */
function initCropPerformanceChart() {
    const ctx = document.getElementById('cropPerformanceChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
                {
                    label: 'Wheat Yield (tons)',
                    data: [12, 19, 15, 25, 22, 30, 28],
                    borderColor: '#1B5E20',
                    backgroundColor: 'rgba(27, 94, 32, 0.05)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Maize Yield (tons)',
                    data: [8, 12, 10, 18, 14, 23, 21],
                    borderColor: '#81C784',
                    backgroundColor: 'rgba(129, 199, 132, 0.05)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { family: 'Outfit', size: 12 }
                    }
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

/**
 * Bar Chart: Farm Tasks Completion
 */
function initFarmActivityChart() {
    const ctx = document.getElementById('farmActivityChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Tasks Completed',
                data: [5, 8, 4, 9, 6, 3, 2],
                backgroundColor: '#5D4037', // Soil Brown
                borderRadius: 6,
                borderWidth: 0,
                maxBarThickness: 30
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
                    ticks: { 
                        beginAtZero: true,
                        font: { family: 'Inter' } 
                    }
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
 * Doughnut Chart: Crop Health Status distribution
 */
function initCropHealthChart() {
    const ctx = document.getElementById('cropHealthChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Healthy', 'At Risk', 'Critical'],
            datasets: [{
                data: [75, 18, 7],
                backgroundColor: [
                    '#2E7D32', // Green
                    '#F57F17', // Orange/Gold
                    '#C62828'  // Red
                ],
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: { family: 'Outfit', size: 12 }
                    }
                }
            },
            cutout: '70%'
        }
    });
}
