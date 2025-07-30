const CACHE_NAME = 'notebook-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/notebook.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;500;700&family=Source+Code+Pro:wght@400;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://static.wixstatic.com/media/173a41_7de514dafdc1441b81d482c8eb4e73a3~mv2.png/v1/crop/x_0,y_8,w_2121,h_2365/fill/w_270,h_301,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/KSP%20%E8%AD%A6%E5%AF%9F.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline notes
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle any background sync tasks
  console.log('Background sync triggered');
  return Promise.resolve();
} 
// DOM elements
const fullscreenBtn = document.getElementById('fullscreenBtn');
const modalContent = document.querySelector('.modal-content');

// 設定全螢幕切換按鈕事件
fullscreenBtn.addEventListener('click', () => {
  modalContent.classList.toggle('fullscreen');
  
  // 切換圖示
  const icon = fullscreenBtn.querySelector('i');
  if (modalContent.classList.contains('fullscreen')) {
    icon.classList.remove('fa-expand');
    icon.classList.add('fa-compress');
  } else {
    icon.classList.remove('fa-compress');
    icon.classList.add('fa-expand');
  }
  
  // 自動聚焦文字區
  noteContent.focus();
});

// 加入快捷鍵支援
document.addEventListener('keydown', (e) => {
  if (noteModal.classList.contains('show') && e.key === 'F11') {
    e.preventDefault();
    fullscreenBtn.click();
  }
});