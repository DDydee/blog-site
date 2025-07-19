const trachcan = document.querySelector("a.delete");
trachcan.addEventListener("click", (e) => {
  const endpoint = `/blogs/${trachcan.dataset.doc}`;

  fetch(endpoint, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => (window.location.href = data.redirect))
    .catch((err) => console.log(err));
});
