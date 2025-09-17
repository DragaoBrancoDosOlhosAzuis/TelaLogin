document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginContainer = document.querySelector(".login-container");
  const registerContainer = document.querySelector(".register-container");
  const showRegister = document.getElementById("showRegister");
  const showLogin = document.getElementById("showLogin");
  const messageDiv = document.getElementById("message");

  // Alternar entre login e cadastro
  showRegister.addEventListener("click", function (e) {
    e.preventDefault();
    loginContainer.classList.add("hidden");
    registerContainer.classList.remove("hidden");
    hideMessage();
  });

  showLogin.addEventListener("click", function (e) {
    e.preventDefault();
    registerContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
    hideMessage();
  });

  // Login form
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    };

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showMessage(data.message, "success");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        showMessage(data.message, "error");
      }
    } catch (error) {
      showMessage("Erro de conexão", "error");
    }
  });

  // Register form
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      username: document.getElementById("regUsername").value,
      password: document.getElementById("regPassword").value,
      confirm_password: document.getElementById("regConfirmPassword").value,
    };

    if (formData.password !== formData.confirm_password) {
      showMessage("As senhas não coincidem", "error");
      return;
    }

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showMessage(data.message, "success");
        // Voltar para o login após cadastro bem-sucedido
        setTimeout(() => {
          registerContainer.classList.add("hidden");
          loginContainer.classList.remove("hidden");
          hideMessage();
          registerForm.reset();
        }, 2000);
      } else {
        showMessage(data.message, "error");
      }
    } catch (error) {
      showMessage("Erro de conexão", "error");
    }
  });

  function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove("hidden");
  }

  function hideMessage() {
    messageDiv.classList.add("hidden");
  }
});
