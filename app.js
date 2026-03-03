let user = {
    level: 1,
    xp: 0,
    STR: 0,
    INT: 0,
    STA: 0
};

let quests = [];

const achievements = [
    { id: "str_50", title: "Gücünü Artır", type: "STR", target: 50 },
    { id: "int_50", title: "Bilge Ol", type: "INT", target: 50 },
    { id: "sta_100", title: "Tempoya Devam", type: "STA", target: 100 },
    { id: "lvl_5", title: "Maceracı", type: "LEVEL", target: 5 }
];

function gorevOlustur(text, xp, stat, statValue) {
    return {
        id: Date.now(),
        text: text,
        xp: Number(xp),
        stat: stat,
        statValue: Number(statValue),
        completed: false
    };
}

function kaydet() {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("quests", JSON.stringify(quests));
}

function yukle() {
    const kayitliUser = localStorage.getItem("user");
    if (kayitliUser) user = JSON.parse(kayitliUser);

    const kayitliQuests = localStorage.getItem("quests");
    if (kayitliQuests) quests = JSON.parse(kayitliQuests);
}

function arayuzuGuncelle() {
    document.getElementById("level").textContent = user.level;
    document.getElementById("xp").textContent = user.xp;
    document.getElementById("strStat").textContent = user.STR;
    document.getElementById("intStat").textContent = user.INT;
    document.getElementById("staStat").textContent = user.STA;

    const bar = document.querySelector(".xpFill");
    bar.style.width = Math.min(user.xp, 100) + "%";
}

function xpKazan(gorevXp) {
    user.xp += gorevXp;
    seviyeKontrolEt();
    arayuzuGuncelle();
}

function seviyeKontrolEt() {
    while (user.xp >= 100) {
        user.level += 1;
        user.xp -= 100;
    }
}

function statKazan(stat, miktar) {
    if (user[stat] === undefined) {
        user[stat] = 0;
    }
    user[stat] += miktar;
}

function gorevleriYazdir() {
    const liste = document.querySelector(".questList");
    liste.innerHTML = "";

    quests.forEach((gorev) => {
        const kart = document.createElement("div");
        kart.classList.add("questItem");

        const yazi = document.createElement("span");
        yazi.textContent = `${gorev.text} | +${gorev.xp} XP | ${gorev.stat} +${gorev.statValue}`;

        const actions = document.createElement("div");
        actions.classList.add("questActions");

        const btn = document.createElement("button");
        btn.classList.add("btn", "btn-success");
        btn.textContent = "Tamamla";

        btn.addEventListener("click", function () {
            if (gorev.completed) return;
            gorev.completed = true;

            xpKazan(gorev.xp);
            statKazan(gorev.stat, gorev.statValue);

            kaydet();
            gorevleriYazdir();
            arayuzuGuncelle();
            basarimlariYazdir();
        });

        const btnSil = document.createElement("button");
        btnSil.textContent = "Sil";
        btnSil.classList.add("btn", "btn-danger");

        btnSil.addEventListener("click", function (event) {
            event.stopPropagation();
            quests = quests.filter((q) => q.id !== gorev.id);

            kaydet();
            gorevleriYazdir();
            arayuzuGuncelle();
            basarimlariYazdir();
        });

        if (gorev.completed === true) {
            yazi.classList.add("completed");
            btn.disabled = true;
            btn.textContent = "Tamamlandı";
            kart.classList.add("questCompleted");
        }

        actions.appendChild(btn);
        actions.appendChild(btnSil);

        kart.appendChild(yazi);
        kart.appendChild(actions);

        liste.appendChild(kart);
    });
}

function mevcutDeger(ach) {
    switch (ach.type) {
        case "STR":
            return user.STR;
        case "INT":
            return user.INT;
        case "STA":
            return user.STA;
        case "LEVEL":
            return user.level;
        case "QUESTS_DONE":
            return quests.filter((q) => q.completed).length;
        default:
            return 0;
    }
}

function basarimlariYazdir() {
    const liste = document.querySelector(".achievementsList");
    if (!liste) return;

    liste.innerHTML = "";

    achievements.forEach((ach) => {
        const kart = document.createElement("div");
        kart.classList.add("achievementItem");

        const baslik = document.createElement("div");
        baslik.textContent = ach.title;

        const progressText = document.createElement("div");
        const mevcut = mevcutDeger(ach);
        const gosterilecek = Math.min(mevcut, ach.target);
        progressText.textContent = `${gosterilecek} / ${ach.target}`;

        const barWrapper = document.createElement("div");
        barWrapper.classList.add("achBar");

        const barFill = document.createElement("div");
        barFill.classList.add("achFill");

        const yuzde = Math.min((mevcut / ach.target) * 100, 100);
        barFill.style.width = yuzde + "%";

        barWrapper.appendChild(barFill);


        kart.appendChild(baslik);
        kart.appendChild(barWrapper);
        kart.appendChild(progressText);

        liste.appendChild(kart);
    });
}

function init() {
    yukle();
    arayuzuGuncelle();
    gorevleriYazdir();
    basarimlariYazdir();

    const addButton = document.getElementById("addBtn");

    addButton.addEventListener("click", function () {
        const text = document.getElementById("questInput").value;
        const xp = document.getElementById("xpInput").value;
        const stat = document.getElementById("statInput").value;
        const statValue = document.getElementById("statValueInput").value;

        if (text.trim() === "") return;

        const yeniGorev = gorevOlustur(text, xp, stat, statValue);

        quests.push(yeniGorev);
        kaydet();
        gorevleriYazdir();
        basarimlariYazdir();

        document.getElementById("questInput").value = "";
    });
}

init();