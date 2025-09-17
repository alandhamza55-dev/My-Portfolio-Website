document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Your message has been sent!");
    this.reset();
});
