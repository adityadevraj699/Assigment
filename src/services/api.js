// ════════════════════════════════════════════
// CACHE SYSTEM — localStorage based
// ════════════════════════════════════════════
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const cache = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      const { data, ts } = JSON.parse(raw);

      // expired?
      if (Date.now() - ts > CACHE_TTL) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  },

  set(key, data) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({ data, ts: Date.now() })
      );
    } catch (e) {
      console.warn("Cache full, clearing...");
      localStorage.clear();
    }
  },
};

// ════════════════════════════════════════════
// BASE FETCH — cache + API
// ════════════════════════════════════════════
const fetchData = async (path) => {
  const cacheKey = `imdb_${path}`;

  // 1. cache check
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`⚡ CACHE HIT: ${path}`);
    return cached;
  }

  // 2. API call (Vite proxy use ho raha hai)
  console.log(`🌐 API CALL: ${path}`);

  const res = await fetch(`/api${path}`);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();

  // 3. cache store
  cache.set(cacheKey, data);

  return data;
};

// ════════════════════════════════════════════
// API FUNCTIONS
// ════════════════════════════════════════════

// 📺 Titles list
export const fetchTitles = (pageToken = null, type = null) => {
  const params = new URLSearchParams();

  if (type) params.append("types", type);
  if (pageToken) params.append("pageToken", pageToken);

  params.append("sortBy", "SORT_BY_POPULARITY");
  params.append("sortOrder", "ASC");

  return fetchData(`/titles?${params.toString()}`);
};

// 🔍 Search
export const searchTitles = (query) => {
  if (!query?.trim()) {
    return Promise.resolve({ titles: [] });
  }

  const params = new URLSearchParams({
    query,
    limit: 10,
  });

  return fetchData(`/search/titles?${params.toString()}`);
};

// 🎬 Single title
export const fetchTitleById = (id) => {
  return fetchData(`/titles/${id}`);
};