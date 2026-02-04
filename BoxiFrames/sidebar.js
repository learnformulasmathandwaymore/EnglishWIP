async function loadSidebar() {
    const response = await fetch(".");
    const text = await response.text();

    // Parse the directory listing
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    // Find all links ending in "iframe.html"
    const links = [...doc.querySelectorAll("a")]
        .map(a => a.getAttribute("href"))
        .filter(href => href && href.endsWith("iframe.html"));

    // Convert filenames into display names
    const games = links.map(file => {
        const name = file.replace("iframe.html", "");
        const display = name.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        return {
            name: display,
            url: file,
            thumbnail: `../Thumbnails/${name}.png`
        };
    });

    // Shuffle and pick 5
    const selected = games.sort(() => Math.random() - 0.5).slice(0, 5);

    // Render sidebar
    const container = document.getElementById("sidebar");
    container.innerHTML = "";

    selected.forEach(game => {
        const item = document.createElement("div");
        item.className = "sidebar-item";

        item.innerHTML = `
            <img src="${game.thumbnail}" onerror="this.style.display='none'">
            <span>${game.name}</span>
        `;

        item.onclick = () => window.location.href = game.url;
        container.appendChild(item);
    });
}

