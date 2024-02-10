export default function checkTokenExists(): boolean {
    // Attempt to retrieve the token from localStorage
    var token = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
    }
    return token !== null;
  }
  