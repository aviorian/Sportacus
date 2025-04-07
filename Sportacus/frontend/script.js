function loginUser(event) {
    event.preventDefault();

    // Kullanıcı adı ve şifreyi al
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Basit kontrol (Gerçek projelerde backend ile kontrol edilir)
    if (username === "admin" && password === "1234") {
        alert("Giriş başarılı! Anasayfaya yönlendiriliyorsunuz.");
        window.location.href = "index.html"; // Ana sayfaya yönlendirme
    } else {
        errorMessage.textContent = "Hatalı kullanıcı adı veya şifre!";
    }
}
