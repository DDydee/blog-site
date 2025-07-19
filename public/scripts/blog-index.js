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
  fetch(`/blogs/page?page=${page}`)
    .then((res) => res.text())
    .then((html) => {
      document.querySelector(".blogs").insertAdjacentHTML("beforeend", html);
      btn.dataset.page = `${page + 1}`;
    });
}
