async function loadSidebar() {
    try {
        // Fetch the current directory listing (BoxiFrames folder)
        const response = await fetch(".");
        const text = await response.text();

        // Parse the HTML returned by GitHub Pages
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        // Find all links ending in "iframe.html"
        const iframeFiles = [...doc.querySelectorAll("a")]
            .map(a => a.getAttribute("href"))
            .filter(href =>
                href &&
                href.endsWith("iframe.html") &&
                !href.startsWith("http") // ignore GitHub help link
            );

        // Convert iframe filenames into sidebar entries
        const games = iframeFiles.map(file => {
            const base = file.replace("iframe.html", ""); // "retrobowliframe" -> "retrobowl"
            const cleanName = base
                .replace(/iframe$/i, "") // remove trailing "iframe"
                .replace(/-/g, " ")      // replace dashes with spaces
                .replace(/\b\w/g, c => c.toUpperCase()); // capitalize words

            return {
                name: cleanName,
                url: file,
                thumbnail: `../Thumbnails/${base}.png`
            };
        });

        // Shuffle and pick 5 random games
        const selected = games.sort(() => Math.random() - 0.5).slice(0, 5);

        // Render the sidebar
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

    } catch (err) {
        console.error("Sidebar load error:", err);
    }
}

// Run on page load
loadSidebar();

