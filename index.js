import "https://unpkg.com/navigo";
import { adjustForMissingHash, loadHtml, renderTemplate, setActiveLink } from "./utils.js";

import {initRiders, load} from "./pages/riders/riders.js";
import {initDeleteRider} from "./pages/deleterider/deleterider.js";
import {initEditRider} from "./pages/editrider/editrider.js";
import {initAddRider} from "./pages/addrider/addrider.js";
import {initTeams} from "./pages/teams/teams.js";

window.addEventListener("load", async () => {
    const templateHome = await loadHtml("./pages/home/home.html");
    const templateNotFound = await loadHtml("./pages/notFound/notFound.html");
    const templateRiders = await loadHtml("./pages/riders/riders.html");
    const templateDeleteRider = await loadHtml("./pages/deleterider/deleterider.html");
    const templateEditRider = await loadHtml("./pages/editrider/editrider.html");
    const templateAddRider = await loadHtml("./pages/addrider/addrider.html");
    const templateTeams = await loadHtml("./pages/teams/teams.html");
    adjustForMissingHash();

    const router = new Navigo("/", { hash: true });
    window.router = router;

    router
        .hooks({
            before(done, match) {
                setActiveLink("menu", match.url);
                done();
            },
        })
        .on({
            "/": () => {
                renderTemplate(templateHome, "content");
            },
            "/teams": () => {
                renderTemplate(templateTeams, "content");
                initTeams();
            },
            "/deleterider": () => {
                renderTemplate(templateRiders, "content");
                initDeleteRider();
            },
            "/editrider": () => {
                renderTemplate(templateEditRider, "content");
                initEditRider();
            },
            "/addrider": () => {
                renderTemplate(templateAddRider, "content");
                initAddRider();
            },
            "/riders": (match) => {
                renderTemplate(templateRiders, "content");
                load(1, match);
                initRiders();
            },
        })
        .notFound(() => {
            renderTemplate(templateNotFound, "content");
        })
        .resolve();
});
