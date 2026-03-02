window.initializeBurgerMenu = function () {
    var burgerMenu = document.getElementById('burger-menu');
    var closeMenu = document.getElementById('close-menu');
    var sidebar = document.getElementById('side-bars');

    // Check if mobile
    function isMobile() {
        return window.innerWidth >= 768;
    }

    burgerMenu.onclick = function () {
        sidebar.classList.add("odc:block");
        sidebar.classList.remove("odc:hidden");
        burgerMenu.style.display = "none";
        closeMenu.style.display = "flex";
    };
    closeMenu.onclick = function () {
        sidebar.classList.remove("odc:block");
        sidebar.classList.add("odc:hidden");
        burgerMenu.style.display = "flex";
        closeMenu.style.display = "none";
    };

    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            if (!isMobile()) {
                // Reset to desktop view
                sidebar.classList.remove("odc:block");
                sidebar.classList.add("odc:hidden");
            } else {
                // Reset to mobile closed state
                sidebar.classList.remove("odc:hidden");
                sidebar.classList.add("odc:block");
            }
        }, 250);
    });

    if (!isMobile()) {
        // Reset to desktop view
        sidebar.classList.remove("odc:block");
        sidebar.classList.add("odc:hidden");
    } else {
        // Reset to mobile closed state
        sidebar.classList.remove("odc:hidden");
        sidebar.classList.add("odc:block");
    }
}