self.addEventListener("install", () => {
  console.log("Shift-X Installed");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
  );
});