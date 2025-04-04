function calculateBMI() {
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value) / 100;
    const goal = document.getElementById("goal").value;
    
    if (!weight || !height) {
        document.getElementById("result").innerHTML = "Lütfen tüm alanları doldurun.";
        return;
    }

    const bmi = weight / (height * height);
    let plan = "";

    if (goal === "gain") {
        plan = "✅ **Yüksek protein tüket, ağırlık kaldır!** 🍗💪";
    } else if (goal === "lose") {
        plan = "🔥 **Düşük karbonhidratlı diyet ve kardiyo yap!** 🏃🥗";
    } else {
        plan = "⚖️ **Dengeli beslen ve aktif kal!** 🍎💃";
    }

    document.getElementById("result").innerHTML = `
        <p>BMI: <strong>${bmi.toFixed(2)}</strong></p>
        <p>${plan}</p>
    `;
}
