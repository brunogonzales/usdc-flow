export default function ({ $axios }, inject) {
  const CIRCLE_SECRET =
    "QVBJX0tFWTowMjI2YjJlODExMDlhNGQwMjE5ZGRhNjRjNTY3MDRhODozZjJlNDVjYzIzZTc0MTA2NjU1NzRkZjg2YTkxYTVkNw==";
  $axios.setHeader("Authorization", `Bearer ${CIRCLE_SECRET}`);
  $axios.setHeader("Content-Type", "application/json");
}
