function likePost(blogId, btn) {
  fetch(`/blogs/${blogId}/like`, { method: `POST` })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      btn.querySelector("span").textContent = data.likes;
    });
}

function loadMore(btn) {
  const page = parseInt(btn.dataset.page);
  const urlParams = new URLSearchParams(window.location.search);
  const queryText = urlParams.get("query");
  const isQuery = queryText ? `&query=${queryText}` : "";

  fetch(`/blogs/page?page=${page}${isQuery}`)
    .then((res) => res.text())
    .then((html) => {
      document.querySelector(".blogs").insertAdjacentHTML("beforeend", html);
      window.history.replaceState({}, "", `/blogs?page=${page}${isQuery}`);
      btn.dataset.page = `${page + 1}`;
    });
}
