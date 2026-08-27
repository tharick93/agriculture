/* ==========================================================================
   STACKLY AGRICULTURE WEBSITE - AUTHENTICATION SYSTEMS
   ========================================================================== */

// Default credentials databases
const DEFAULT_USER = {
    fullName: "John Doe",
    email: "user@stackly.com",
    phone: "+1 555-0199",
    password: "user123",
    location: "California, USA",
    userType: "user"
};

const DEFAULT_ADMIN = {
    fullName: "Stackly Admin",
    email: "admin@stackly.com",
    password: "admin123",
    userType: "admin"
};

// Initialize default databases in localStorage if not exist
if (!localStorage.getItem('stackly_users')) {
    localStorage.setItem('stackly_users', JSON.stringify([DEFAULT_USER]));
}

/**
 * Registration Handler
 */
function registerUser(userData) {
    const users = JSON.parse(localStorage.getItem('stackly_users')) || [];
    
    // Check if email already registered
    const emailExists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (emailExists || userData.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase()) {
        return { success: false, message: "Email is already registered." };
    }
    
    // Add user to local database
    users.push(userData);
    localStorage.setItem('stackly_users', JSON.stringify(users));
    
    return { success: true, message: "Account created successfully!" };
}

function loginUser(email, password, roleType) {
    const emailClean = email.trim().toLowerCase();
    
    if (roleType === 'admin') {
        // Accept any admin credentials, redirect to admin dashboard
        const session = {
            fullName: "Admin User",
            email: emailClean,
            role: 'admin',
            loginTime: new Date().getTime()
        };
        localStorage.setItem('stackly_session', JSON.stringify(session));
        return { success: true, redirect: 'admin-dashboard.html' };
    } else {
        // Accept any user/farmer credentials, redirect to user dashboard
        // Check if there is an actual registered user with this email first
        const users = JSON.parse(localStorage.getItem('stackly_users')) || [];
        const registeredUser = users.find(u => u.email.toLowerCase() === emailClean);
        
        const session = {
            fullName: registeredUser ? registeredUser.fullName : "Demo Farmer",
            email: emailClean,
            role: registeredUser ? registeredUser.userType : "farmer", // Default to farmer if not registered
            location: registeredUser ? registeredUser.location : "California, USA",
            phone: registeredUser ? registeredUser.phone : "+1 555-0199",
            loginTime: new Date().getTime()
        };
        localStorage.setItem('stackly_session', JSON.stringify(session));
        return { success: true, redirect: 'user-dashboard.html' };
    }
}

/**
 * Check if session exists and is authorized for a page
 */
function checkAuthGuard(requiredRole) {
    const sessionStr = localStorage.getItem('stackly_session');
    
    if (!sessionStr) {
        window.location.href = 'login.html';
        return null;
    }
    
    const session = JSON.parse(sessionStr);
    
    // Check role matches
    if (requiredRole === 'admin' && session.role !== 'admin') {
        window.location.href = 'login.html?error=unauthorized';
        return null;
    }
    
    if (requiredRole === 'user' && session.role !== 'user' && session.role !== 'farmer') {
        window.location.href = 'login.html?error=unauthorized';
        return null;
    }
    
    return session;
}

/**
 * Sign Out Handler
 */
function signOutUser() {
    localStorage.removeItem('stackly_session');
    window.location.href = 'login.html';
}

// Attach logout listeners dynamically to logout buttons and update navbar
document.addEventListener('DOMContentLoaded', () => {
    // 1. Update navigation menu for logged in users
    const navAuthActions = document.getElementById('nav-auth-actions');
    const sessionStr = localStorage.getItem('stackly_session');
    if (navAuthActions && sessionStr) {
        const session = JSON.parse(sessionStr);
        const dashboardUrl = session.role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
        navAuthActions.innerHTML = `
            <a href="${dashboardUrl}" class="btn-nav-login"><i class="fa-solid fa-chart-line"></i> Dashboard</a>
            <a href="#" id="logout-btn" class="btn btn-secondary btn-nav-signup">Sign Out</a>
        `;
    }

    // 2. Bind logout click handlers
    const logoutBtns = document.querySelectorAll('#logout-btn, .logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            signOutUser();
        });
    });
});
