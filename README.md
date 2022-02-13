# Awesome Todo Maintainer

Awesome TO-DO Maintainer Extension for Awesome Hackers; powered by NotionAPI. Manage your Notion TO-DOs Database right from VSCode.

[Website](https://awesometodomaintainerfor.study/) 👀

## Features

Do the basic CRUD operations right for your Notion Database which you're using to maintain your To-Dos with **Status** and **Priority**.

## Requirements

- [Notion A/C](https://www.notion.so/) 😎
  - [It will be awesome with this Notion Template](https://respected-adapter-2a7.notion.site/e8e86658d17f448f8378574b5678db7c?v=8713cd42c95144769c335866d301d69e) 😋
- [Visual Studio Code](https://code.visualstudio.com/) 💻
- [This Extension](https://marketplace.visualstudio.com/items?itemName=AwesomeTodoMaintainer.awesome-todo-maintainer) 🚀

## Inspiration

We often wanted to explore Notion APIs as well as since me and my teammates use Notion daily, maintaining a to-do table while switching windows was sometimes "ughh😒" so we came up with the idea of making an extension just to stay on VSCode undistracted.

## What it does

As mentioned, it does the **CRUD** commands as well as it lets you add **priority** and **status** making _your boring todo not so boring_.

- Ctrl+Shift+P -> Quick Pick

  **Commands mentioned:**

  - TODO: Add/Update Notion Database
  - TODO: Check Current Notion Database
  - TODO: Read TO-DOs
  - TODO: Create TO-DOs
  - TODO: Update TO-DOs
  - TODO: Delete TO-DOs

## How we built it

- Falguni did a hell lot of JS heavily **Frontend and UI/UX logic** with which you gonna interact. 👻
- Aniruddha did a hell of a lot of JS heavily (yes, again) **Backend** with which this extension gonna interact. 🤯
  - Used **Notion SDK** to built an **API** with **Express.js** to support all the **CRUD Operations** for Notion Pages where the **Integration** is added.
- Arkatapa did all this **documentation**. 😎

## Challenges we ran into

Getting our PC completely frozen because of infinite loops of calling APIs to build a fully-fledged backend and frontend is not an easy task. We suffered from getting ECONNECTED ERROR to the minute logic building. But all hail to **StackOverflow, YouTube and VSCode/NotionAPI docs**.

## Accomplishments that we're proud of

We are now debugging gangsta.

## What we learned

Learnt a new stack and adapted it fully quickly.

## What's next for Awesome Todo Maintainer

We are going to grow it more and will add more features.

**Enjoy!**
