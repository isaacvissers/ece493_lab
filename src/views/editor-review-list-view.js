function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
}

export function createEditorReviewListView() {
  const container = createElement('section', 'card');
  const title = createElement('h2');
  title.textContent = 'Editor reviews';

  const list = document.createElement('ul');
  list.id = 'editor-review-list';

  container.append(title, list);

  return {
    element: container,
    setReviews(reviews = []) {
      list.innerHTML = '';
      reviews.forEach((review) => {
        const item = document.createElement('li');
        item.textContent = `Review ${review.reviewId}`;
        list.appendChild(item);
      });
    },
  };
}
