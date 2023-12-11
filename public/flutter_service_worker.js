'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "063f71ffb19fba5d8a0e17bbb5ef72ee",
"assets/AssetManifest.json": "98160a9bb5c27572484ff9b20027a604",
"assets/assets/icons/css.png": "362c50a50f29e1ab1b352659a9477ec5",
"assets/assets/icons/html.png": "be0148a9f42653d0c9d6ea570a4b8613",
"assets/assets/icons/js.png": "633446e6bc694399d3a8ba41d60f6bba",
"assets/assets/icons/python.png": "2f4770a19bd74aedcd840a6aa29f0168",
"assets/assets/images/1.png": "0f39f10433f13b73cf03d58311828415",
"assets/assets/images/al.png": "c48a62dbe2eef4605d873388b3af3a27",
"assets/assets/images/alp.png": "aad05ab4666c2b63e177dac5edf4bd05",
"assets/assets/images/fon2.png": "d99c557c4269a7db2603e249e722cb5a",
"assets/assets/images/fon3.png": "98916d2d194ca400d6ccf50d92f8f431",
"assets/assets/images/fon5.jpg": "d11888b7deaceaa750b8b142e332422d",
"assets/assets/images/fondo.png": "2aa19508441bcff46989e7173eab358a",
"assets/assets/images/imgback.jpeg": "7c72b2d885026d871163cc182eff2d52",
"assets/assets/images/lab.png": "bae3a3960bea0f679abc0e70585a0aec",
"assets/assets/images/lo4.png": "fa9d2a4414fd3c2ef4608a475b05bd8a",
"assets/assets/images/log.png": "834014fe840e6e21eca9fe120c316c87",
"assets/assets/images/logg.png": "6975b8765fcdd1306779d3d4ba2a5b6a",
"assets/assets/images/Logo-vertical.png": "f872f77ec70acbf40899a105bb8d4542",
"assets/assets/images/nos3.jpeg": "9c85fd0c52c745d62ac854ce5123475d",
"assets/assets/images/nose.jpeg": "89adf36aeea620885743b087c77ab4e0",
"assets/assets/images/nose2.jpeg": "019c3063bf86352876ec3de5a2abaf28",
"assets/assets/images/server.png": "4029bb07e8541be559713f65ec67439b",
"assets/assets/images/sumaq.png": "add8105d9f3d4dbca6907ecb2a8283b6",
"assets/assets/images/sumaqc.png": "cc3521951d6829a08fd7a6316f5e26ea",
"assets/assets/images/sumaqre.png": "8e28aa7bbdf0e806ff34738160b11fd5",
"assets/assets/images/ubuntu.png": "303f9b713114dcb712acf1463693e9ed",
"assets/assets/images/verde.jpg": "576209a2b58a41f2c7b2c29f68088cbd",
"assets/assets/images/windows.png": "a025efd8f5de7ed38d2cc2741c271f4f",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/fonts/MaterialIcons-Regular.otf": "663a182beb3bf53349354ad24105f288",
"assets/NOTICES": "92ceb04eb21b359a343e167e4bc283aa",
"assets/packages/awesome_snackbar_content/assets/back.svg": "ba1c3aebba280f23f5509bd42dab958d",
"assets/packages/awesome_snackbar_content/assets/bubbles.svg": "1df6817bf509ee4e615fe821bc6dabd9",
"assets/packages/awesome_snackbar_content/assets/types/failure.svg": "cb9e759ee55687836e9c1f20480dd9c8",
"assets/packages/awesome_snackbar_content/assets/types/help.svg": "7fb350b5c30bde7deeb3160f591461ff",
"assets/packages/awesome_snackbar_content/assets/types/success.svg": "6e273a8f41cd45839b2e3a36747189ac",
"assets/packages/awesome_snackbar_content/assets/types/warning.svg": "cfcc5fcb570129febe890f2e117615e0",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "f25e8e701660fb45e2a81ff3f43c6d5c",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "a5d7457fda15b7622c14f432ba63039a",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "636cd7217a6274a06906d256e99f198f",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "bbf39143dfd758d8d847453b120c8ebb",
"canvaskit/canvaskit.wasm": "42df12e09ecc0d5a4a34a69d7ee44314",
"canvaskit/chromium/canvaskit.js": "96ae916cd2d1b7320fff853ee22aebb0",
"canvaskit/chromium/canvaskit.wasm": "be0e3b33510f5b7b0cc76cc4d3e50048",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/skwasm.wasm": "1a074e8452fe5e0d02b112e22cdcf455",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15",
"favicon.png": "82451d0c72cc0e62c866da5be2fdf561",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "b925c1e0a63d646c077021c353a690f7",
"icons/Icon-512.png": "7c1ba011a506afa30ddb934e0959baf9",
"icons/Icon-maskable-192.png": "b925c1e0a63d646c077021c353a690f7",
"icons/Icon-maskable-512.png": "7c1ba011a506afa30ddb934e0959baf9",
"icons/logg.png": "6975b8765fcdd1306779d3d4ba2a5b6a",
"index.html": "5d01cab1a946a83642f9f1a9d2fbb3a1",
"/": "5d01cab1a946a83642f9f1a9d2fbb3a1",
"logg.png": "6975b8765fcdd1306779d3d4ba2a5b6a",
"main.dart.js": "9f1d8cec20d1a14f078ad9c7545204a7",
"manifest.json": "df1bf24f0bd7fd634b19f250cdfe9f83",
"version.json": "d6ce06b344fa64015340ed58a478758a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
