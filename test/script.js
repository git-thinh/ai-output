// script.js

/**
 * Hàm chính để thực hiện việc tải và hiển thị các component HTML
 */
async function loadComponents() {
    try {
        console.log("Fetching components...");

        // 1. Load Header content
        const headerResponse = await fetch('components/header.html');
        const headerHtml = await headerResponse.text();
        document.getElementById('header-container').innerHTML = headerHtml;
        console.log("Header loaded successfully.");

        // 2. Load Sidebar content
        const sidebarResponse = await fetch('components/sidebar.html');
        const sidebarHtml = await sidebarResponse.text();
        document.getElementById('sidebar-container').innerHTML = sidebarHtml;
        console.log("Sidebar loaded successfully.");

        // 3. Load Main Content content
        const mainResponse = await fetch('components/main.html');
        const mainHtml = await mainResponse.text();
        document.getElementById('main-content-container').innerHTML = mainHtml;
        console.log("Main content loaded successfully.");

    } catch (error) {
        console.error("Error loading one or more components:", error);
        document.getElementById('main-content-container').innerHTML = `
            <div class="p-6 bg-red-900 border border-red-600 rounded-xl shadow-lg text-red-300">
                <i class="bi bi-exclamation-triangle text-red-400 w-8 h-8 mb-3"></i>
                <p class="font-semibold mb-2">Failed to load required files.</p>
                <p class="text-sm">Please ensure all three component files (`header.html`, `sidebar.html`, `main.html`) are in the correct subfolder structure and accessible via HTTP requests.</p>
                <p class="mt-3 text-xs text-gray-500">Check your file paths!</p>
            </div>
        `;
    }
}

// Start the process when the page is fully loaded
document.addEventListener('DOMContentLoaded', loadComponents);
