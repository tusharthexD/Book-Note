function editBook(id) {
  document.querySelector(".book" + id).style.display = "none";
  document.querySelector(".edit" + id).style.display = "flex";
}
function closeEdit(id) {
  document.querySelector(".book" + id).style.display = "flex";
  document.querySelector(".edit" + id).style.display = "none";
}

async function fetchapi(event) {
  document.querySelector(".listSec").innerHTML = "";
  document.querySelector(".loader").style.display = "block";
  document.getElementById("dropdown").style.display = "block";
  let search = document.getElementById("search").value;


  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${search}&limit=10`
    );

    const data = await response.json();
    document.querySelector(".loader").style.display = "none";

    if (data.docs.length > 0) {
      data.docs.forEach((e) => {
        let isbn = e.isbn[0];
        const author = e.author_name.toString();

        const img = document.createElement("img");
        img.src = `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`;

        const title = document.createElement("h3");
        title.innerText = e.title.substring(0,15)+'..';

        const ISBN = document.createElement("p");
        ISBN.innerHTML = "<i class='material-icons'>bookmark</i>:" + isbn;

        const writer = document.createElement("p");
        if (author.length > 15) {
          writer.innerHTML =
            "<i class='material-icons'>person</i> " +
            author.substring(0, 15) +
            "...";
        } else {
          writer.innerHTML = "<i class='material-icons'>person</i> " + author;
        }

        const btn = document.createElement("button");
        btn.classList.add("searchInbtn");
        btn.innerHTML = `<a href="/add/${isbn}"><i class='material-icons'>add</i></a>`;

        const div = document.createElement("div");
        div.appendChild(title);
        div.appendChild(ISBN);
        div.appendChild(writer);
        div.appendChild(btn)

        const list = document.createElement("li");
        list.appendChild(img);
        list.appendChild(div);

        document.querySelector(".listSec").appendChild(list);
      });
    } else {
      const title = document.createElement("H3");
      title.classList.add("noresult");
      title.innerHTML =
        "No result <i class='material-icons'>sentiment_dissatisfied</i>";

      document.querySelector(".listSec").appendChild(title);
    }
  } catch (error) {
    const title = document.createElement("H3");
    title.classList.add("noresult");
    title.innerHTML = "API server is down";
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".listSec").appendChild(title);
  }
}

function closeDropdown() {
  document.getElementById("dropdown").style.display = "none";
}
