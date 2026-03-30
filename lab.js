/**
 * The Lab - Search and Filter functionality
 */

(function() {
    'use strict';

    const searchInput = document.getElementById('lab-search-input');
    const searchClear = document.getElementById('search-clear');
    const searchResults = document.getElementById('search-results');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const entries = document.querySelectorAll('.lab-entry');

    let currentFilter = 'all';

    // Search functionality
    function performSearch(query) {
        const normalizedQuery = query.toLowerCase().trim();
        let visibleCount = 0;

        entries.forEach(entry => {
            // Get searchable content
            const title = entry.querySelector('.entry-title')?.textContent.toLowerCase() || '';
            const summary = entry.querySelector('.entry-summary p')?.textContent.toLowerCase() || '';
            const details = entry.querySelector('.entry-details')?.textContent.toLowerCase() || '';
            const tools = Array.from(entry.querySelectorAll('.tools-list li')).map(li => li.textContent.toLowerCase()).join(' ');
            const category = entry.querySelector('.entry-category')?.textContent.toLowerCase() || '';
            
            // Combine all searchable text
            const searchContent = `${title} ${summary} ${details} ${tools} ${category}`;
            
            // Check filter
            const entryCategory = entry.querySelector('.entry-category')?.textContent.trim() || '';
            const matchesFilter = currentFilter === 'all' || entryCategory === currentFilter;
            
            // Check search
            const matchesSearch = !normalizedQuery || searchContent.includes(normalizedQuery);
            
            // Show/hide entry
            if (matchesFilter && matchesSearch) {
                entry.style.display = '';
                entry.classList.add('search-match');
                visibleCount++;
            } else {
                entry.style.display = 'none';
                entry.classList.remove('search-match');
            }
        });

        // Update results text
        if (normalizedQuery) {
            searchResults.textContent = `${visibleCount} result${visibleCount !== 1 ? 's' : ''} for "${query}"`;
        } else if (currentFilter !== 'all') {
            searchResults.textContent = `${visibleCount} ${currentFilter.toLowerCase()} experiment${visibleCount !== 1 ? 's' : ''}`;
        } else {
            searchResults.textContent = '';
        }

        // Show/hide clear button
        searchClear.style.display = query ? 'flex' : 'none';

        // Show "no results" message if needed
        const noResults = document.querySelector('.no-results');
        if (noResults) noResults.remove();

        if (visibleCount === 0) {
            const container = document.querySelector('.lab-feed .container');
            const message = document.createElement('div');
            message.className = 'no-results';
            message.innerHTML = `
                <div class="no-results-content">
                    <span class="no-results-icon">🔍</span>
                    <h3>No experiments found</h3>
                    <p>Try a different search term or browse all entries.</p>
                    <button class="btn btn-outline" onclick="document.getElementById('lab-search-input').value='';document.getElementById('lab-search-input').dispatchEvent(new Event('input'))">
                        Clear Search
                    </button>
                </div>
            `;
            container.appendChild(message);
        }
    }

    // Filter functionality
    function applyFilter(filter) {
        currentFilter = filter;
        
        // Update button states
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        // Re-run search with current query
        performSearch(searchInput.value);
    }

    // Event listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                performSearch('');
                searchInput.blur();
            }
        });
    }

    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            performSearch('');
            searchInput.focus();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            applyFilter(btn.dataset.filter);
        });
    });

    // Initialize
    performSearch('');

})();
