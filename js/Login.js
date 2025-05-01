document.getElementById('login-form').addEventListener('submit', e => {
    const email = e.target.email.value.trim();
    const pwd = e.target.password.value;
    if (!email || !pwd) {
      alert('Please fill in your email and password');
      e.preventDefault();
    }
  });
  