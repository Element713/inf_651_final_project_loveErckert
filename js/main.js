function createElemWithText(
    elementType = "p",
    textContent = "",
    className = ""
  ) {
    const element = document.createElement(elementType);
    element.textContent = textContent;
    if (className) {
      element.className = className;
    }
    return element;
  }
  
  function createSelectOptions(users) {
    if (!users) {
      return undefined;
    }
    let optionsArray = [];
    users.forEach((user) => {
      let option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.name;
      optionsArray.push(option);
    });
    return optionsArray;
  }
  
  function toggleCommentSection(postId) {
    if (!postId) return undefined;
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (section) {
      section.classList.toggle("hide");
    }
    return section;
  }
  
  function toggleCommentButton(postId) {
    if (!postId) return undefined;
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (button) {
      button.textContent =
        button.textContent === "Show Comments"
          ? "Hide Comments"
          : "Show Comments";
    }
    return button;
  }
  
  function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) {
      return undefined;
    }
  
    let child = parentElement.lastElementChild;
  
    while (child) {
      parentElement.removeChild(child);
      child = parentElement.lastElementChild;
    }
  
    return parentElement;
  }
  function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
  
    if (buttons.length > 0) {
      buttons.forEach((button) => {
        const postId = button.dataset.postId;
  
        if (postId) {
          button.addEventListener("click", (event) => {
            toggleComments(event, postId);
          });
        }
      });
    }
  
    return buttons;
  }
  
  function toggleComments(event, postId) {
    console.log("toggleComments called for postId:", postId);
  }
  function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
  
    buttons.forEach((button) => {
      const postId = button.dataset.id;
  
      if (postId) {
        const eventListenerFunction = function (event) {
          toggleComments(event, postId);
        };
  
        button.removeEventListener("click", eventListenerFunction);
      }
    });
  
    return buttons;
  }
  
  function createComments(comments) {
    if (!comments) {
      return undefined;
    }
    const fragment = document.createDocumentFragment();
    comments.forEach((comment) => {
      const article = document.createElement("article");
      const h3 = createElemWithText("h3", comment.name);
      const bodyPara = createElemWithText("p", comment.body);
      const emailPara = createElemWithText("p", `From: ${comment.email}`);
      article.appendChild(h3);
      article.appendChild(bodyPara);
      article.appendChild(emailPara);
  
      fragment.appendChild(article);
    });
  
    return fragment;
  }
  
  function populateSelectMenu(usersData) {
    if (!usersData) return undefined;
    const selectMenu = document.getElementById("selectMenu");
    const options = createSelectOptions(usersData);
    options.forEach((option) => {
      selectMenu.appendChild(option);
    });
    return selectMenu;
  }
  
  async function getUsers() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users data");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  }
  async function getUserPosts(userId) {
    if (!userId) {
      return undefined;
    }
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch posts for user ${userId}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return null;
    }
  }
  async function getUser(userId) {
    if (!userId) {
      return undefined;
    }
  
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch data for user ${userId}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }
  async function getPostComments(postId) {
    if (!postId) {
      return undefined;
    }
  
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch comments for post ${postId}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching post comments:", error);
      return null;
    }
  }
  async function displayComments(postId) {
    if (!postId) {
      return undefined;
    }
  
    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.appendChild(fragment);
    return section;
  }
  async function createPosts(posts) {
    if (!posts) {
      return undefined;
    }
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const article = document.createElement("article");
      const h2 = createElemWithText("h2", post.title);
      const pBody = createElemWithText("p", post.body);
      const pPostId = createElemWithText("p", `Post ID: ${post.id}`);
      const author = await getUser(post.userId);
      const pAuthor = createElemWithText(
        "p",
        `Author: ${author.name} with ${author.company.name}`
      );
      const pCatchPhrase = createElemWithText("p", author.company.catchPhrase);
      const button = createElemWithText("button", "Show Comments");
      button.dataset.postId = post.id;
  
      article.appendChild(h2);
      article.appendChild(pBody);
      article.appendChild(pPostId);
      article.appendChild(pAuthor);
      article.appendChild(pCatchPhrase);
      article.appendChild(button);
  
      const section = await displayComments(post.id);
      if (section) {
        article.appendChild(section);
      }
      fragment.appendChild(article);
    }
    return fragment;
  }
  async function displayPosts(posts) {
    const main = document.querySelector("main");
  
    const element =
      posts && posts.length > 0
        ? await createPosts(posts)
        : createElemWithText("p", "Select an Employee to display their posts.");
  
    if (!posts || posts.length === 0) {
      element.classList.add("default-text");
    }
  
    main.appendChild(element);
  
    return element;
  }
   function toggleComments(event, postId) {
    if (!event || !postId) {
      return undefined;
    }
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
  }
  
  async function refreshPosts(posts) {
    if (!posts) {
      return undefined;
    }
    const removeButtons = removeButtonListeners();
  
    const main = document.querySelector("main");
    deleteChildElements(main);
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    return [removeButtons, main, fragment, addButtons];
  }
  
  //19 start
  async function selectMenuChangeEventHandler(event) {
    if (!event) {
      return undefined;
    }
  
    const selectMenu = event.target;
  
    selectMenu.disabled = true;
  
    const userId = selectMenu.value || 1;
  
    try {
      const posts = await getUserPosts(userId);
  
      const refreshPostsArray = await refreshPosts(posts);
  
      selectMenu.disabled = false;
  
      return [userId, posts, refreshPostsArray];
    } catch (error) {
      console.error("Error fetching posts or refreshing posts:", error);
  
      selectMenu.disabled = false;
  
      return undefined;
    }
  }
  
  // 19 ends above
  
  async function initPage() {
    try {
      const users = await getUsers();
      const select = populateSelectMenu(users);
      return [users, select];
    } catch (error) {
      console.error("Error initializing page:", error);
      return [];
    }
  }
  
  function initApp() {
    initPage().then(([users, select]) => {
      const selectMenu = document.getElementById("selectMenu");
      selectMenu.addEventListener("change", selectMenuChangeEventHandler);
    });
  }
  
  document.addEventListener("DOMContentLoaded", initApp);
  