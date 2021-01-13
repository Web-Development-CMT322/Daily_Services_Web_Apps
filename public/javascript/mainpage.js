var modal = document.getElementById('modal-wrapper');
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var modals = document.getElementById('modal-wrapper-sign-up');
window.onclick = function(event) {
    if (event.target == modals) {
        modals.style.display = "none";
    }
}
