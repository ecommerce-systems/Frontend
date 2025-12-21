import './style.css';
import axiosInstance, { setAccessToken, getAccessToken } from './api';

const app = document.querySelector('#app');

function renderAuthPage() {
  app.innerHTML = `
    <h1>Auth Operations</h1>
    <div class="container">
      <!-- Sign Up -->
      <div class="card">
        <h2>Sign Up</h2>
        <form id="signup-form">
          <input type="text" id="signup-username" placeholder="Username" required />
          <input type="password" id="signup-password" placeholder="Password" required />
          <input type="text" id="signup-name" placeholder="Name" required />
          <button type="submit">Sign Up</button>
        </form>
        <div id="signup-result"></div>
      </div>

      <!-- Log In -->
      <div class="card">
        <h2>Log In</h2>
        <form id="login-form">
          <input type="text" id="login-username" placeholder="Username" required />
          <input type="password" id="login-password" placeholder="Password" required />
          <button type="submit">Log In</button>
        </form>
        <div id="login-result"></div>
      </div>

      <!-- Refresh Token -->
      <div class="card">
        <h2>Refresh Token</h2>
        <button id="refresh-button">Refresh Token</button>
        <div id="refresh-result"></div>
      </div>

      <!-- Log Out -->
      <div class="card">
        <h2>Log Out</h2>
        <button id="logout-button">Log Out</button>
        <div id="logout-result"></div>
      </div>
    </div>
  `;

  // --- Event Listeners ---

  // Sign Up
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const name = document.getElementById('signup-name').value;
    const resultDiv = document.getElementById('signup-result');

    try {
      const res = await axiosInstance.post('/auth/signup', { username, password, name });
      resultDiv.innerHTML = `<p>✅ Signup successful for ${username}</p><pre>${JSON.stringify(res.data, null, 2)}</pre>`;
    } catch (error) {
      resultDiv.innerHTML = `<p>❌ Signup failed: ${error.response?.data?.message || error.message}</p>`;
    }
  });

  // Log In
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const resultDiv = document.getElementById('login-result');

    try {
      const res = await axiosInstance.post('/auth/login', { username, password });
      const { accessToken, refreshToken } = res.data;
      setAccessToken(accessToken);
      // In a real app, you would store the refresh token securely (e.g., in an HttpOnly cookie)
      // For this example, we'll just log it.
      resultDiv.innerHTML = `<p>✅ Login successful for ${username}</p><p>Access Token: ${accessToken}</p><p>Refresh Token: (see console)</p>`;
      console.log('Refresh Token:', refreshToken);
    } catch (error) {
      resultDiv.innerHTML = `<p>❌ Login failed: ${error.response?.data?.message || error.message}</p>`;
    }
  });

  // Refresh Token
  document.getElementById('refresh-button').addEventListener('click', async () => {
    const resultDiv = document.getElementById('refresh-result');
    try {
      // The interceptor in api.js handles the refresh logic automatically
      // This button is for demonstrating the refresh mechanism manually if needed,
      // or to trigger an API call that would require a refresh.
      // We'll call a protected route to test it.
      const res = await axiosInstance.post('/auth/refresh');
      const newAccessToken = res.data.access;
      setAccessToken(newAccessToken);
      resultDiv.innerHTML = `<p>🔄 Access token refreshed!</p><p>New Access Token: ${newAccessToken}</p>`;
    } catch (error) {
      resultDiv.innerHTML = `<p>❌ Failed to refresh token: ${error.response?.data?.message || error.message}</p>`;
    }
  });

  // Log Out
  document.getElementById('logout-button').addEventListener('click', async () => {
    const resultDiv = document.getElementById('logout-result');
    try {
      await axiosInstance.post('/auth/logout');
      setAccessToken(null);
      resultDiv.innerHTML = '<p>👋 Logout successful</p>';
    } catch (error) {
      resultDiv.innerHTML = `<p>❌ Logout failed: ${error.response?.data?.message || error.message}</p>`;
    }
  });
}

renderAuthPage();