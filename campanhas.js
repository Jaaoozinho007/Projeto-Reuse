const form = document.getElementById("form-criar");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("criar-titulo").value;
    const desc = document.getElementById("descricao").value;

    const camp = {
        titulo: title,
        descricao: desc
    };

    localStorage.setItem("publicacao", JSON.stringify([camp]));
});