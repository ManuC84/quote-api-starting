const fetchAllButton = document.getElementById("fetch-quotes");
const fetchRandomButton = document.getElementById("fetch-random");
const fetchByAuthorButton = document.getElementById("fetch-by-author");

const quoteContainer = document.getElementById("quote-container");
const buttonContainer = document.getElementById("button-container");
const singleQuote = document.querySelector(".single-quote");
const quoteText = document.querySelector(".quote");
const attributionText = document.querySelector(".attribution");
const navItem = document.querySelectorAll(".nav-item");

const resetQuotes = () => {
  quoteContainer.innerHTML = "";
};

const renderError = (response) => {
  quoteContainer.innerHTML = `<p>Your request returned an error from the server: </p>
<p>Code: ${response.status}</p>
<p>${response.statusText}</p>`;
};

const editQuoteClick = (index) => {
  document.querySelectorAll(".single-quote")[index].style.display = "none";
  document.querySelectorAll(".edit-quote-container")[index].style.display =
    "flex";
  document.querySelectorAll(".individual-update-buttons")[index].style.display =
    "none";
};

const closeEditQuoteClick = (index) => {
  document.querySelectorAll(".single-quote")[index].style.display = "block";
  document.querySelectorAll(".edit-quote-container")[index].style.display =
    "none";
  document.querySelectorAll(".individual-update-buttons")[index].style.display =
    "block";
};

const editFetch = (index, id) => {
  const quote = document.querySelectorAll("#quote")[index].value;
  const person = document.querySelectorAll("#person")[index].value;

  fetch(`/api/quotes/${id}?quote=${quote}&person=${person}`, {
    method: "PUT",
  })
    .then((response) => response.json())
    .then(({ quote }) => {
      closeEditQuoteClick(index);
      document.querySelectorAll(".single-quote")[
        index
      ].innerHTML = `<div class="quote-text">${quote.editedQuote}</div>
    <div class="attribution">- ${quote.editedPerson}</div>`;
    });
};

const deleteFetch = (index, id, data) => {
  if (confirm("Are you sure you want to delete this quote?")) {
    fetch(`/api/quotes/${id}`, {
      method: "DELETE",
    });
    document.querySelectorAll(".quote-button-container")[index].style.display =
      "none";
  }
};

const renderQuotes = (quotes = []) => {
  console.log(quotes);
  resetQuotes();
  if (quotes.length > 0) {
    document.querySelector(".hover-info").style.display = "block";
    quotes.forEach((quote, index) => {
      const newQuote = document.createElement("div");
      newQuote.className = "single-quote";
      newQuote.innerHTML = `<div class="quote-text">${quote.quote}</div>
      <div class="attribution">- ${quote.person}</div>`;
      const editQuoteInput = document.createElement("div");
      editQuoteInput.className = "edit-quote";
      editQuoteInput.innerHTML = `<div class="edit-quote-container" style="display: none;">
        <button onclick="closeEditQuoteClick(${index})"><i class="material-icons">close</i></button>
          <div class="edit-form">  
            <label class="edit-label" for="quote">Edit Quote</label>
            <textarea id="quote" name="quote" rows="4" cols="50">${quote.quote}</textarea>
            <label class="edit-label" for="author">Edit Author</label>
            <textarea id="person" name="person">${quote.person}</textarea>
            <button onclick="editFetch(${index}, ${quote.id})">Submit</button>
          </div>  
        </div>`;
      const editButtons = document.createElement("div");
      editButtons.className = "update-buttons";
      editButtons.innerHTML = `<div class="individual-update-buttons">
      <button onclick="editQuoteClick(${index}, ${quote.id})"><i class="material-icons">create</i>
      </button>
      <button onclick="deleteFetch(${index}, ${quote.id})"><i class="material-icons">delete</i></button>
    </div>`;
      const quoteButtonContainer = document.createElement("div");
      quoteButtonContainer.className = "quote-button-container";
      quoteButtonContainer.appendChild(newQuote);
      quoteButtonContainer.appendChild(editButtons);
      quoteButtonContainer.appendChild(editQuoteInput);
      quoteContainer.appendChild(quoteButtonContainer);
    });
  } else {
    quoteContainer.innerHTML = "<p>Your request returned no quotes.</p>";
    document.querySelector(".hover-info").style.display = "none";
  }
};

fetchAllButton.addEventListener("click", () => {
  fetch("/api/quotes")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      renderQuotes(response);
    });
});

fetchRandomButton.addEventListener("click", () => {
  fetch("/api/quotes/random")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      renderQuotes([response.quote]);
    });
});

fetchByAuthorButton.addEventListener("click", () => {
  const author = document.getElementById("author").value;
  fetch(`/api/quotes?person=${author}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      renderQuotes(response.quotes);
    });
});
