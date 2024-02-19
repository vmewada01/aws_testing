if ("serviceWorker" in navigator) {
  console.log("serviceWorker is supported");
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw_cached_page.js")
      .then((registration) =>
        console.log(
          "Service Worker registration successful with scope: ",
          registration
        )
      )
      .catch((err) => console.log("Service Worker registration"));
  });
}
