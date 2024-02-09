export default function checkTokenExists(): boolean {
    // Attempt to retrieve the token from localStorage
    const token = localStorage.getItem('token');
  
    // Check if the token is not null (which means it exists)
    return token !== null;
  }
  