export default function authHeader() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.token) {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.token,
      }
      return headers;
    } else {
      return {};
    }
  }