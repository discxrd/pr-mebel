export default function getYandexClientID() {
  const fromCookie = document.cookie.match(/_ym_uid=([^;]+)/)?.[1];
  const fromStorage = localStorage.getItem("ym_uid");

  return fromStorage || fromCookie || "";
}
