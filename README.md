# Pixel GraphQl Tech Test

This is the bare bones of a basic authenticted Tasks app. Users can login then create, view and edit tasks.

### Setup

Follow these steps to get yourself set up.

1. Create a .env with the following variables

```
MONGO_URL=[YOUR LOCAL MONGO DB]
PORT=[PORT NUMBER]

AUTH_SECRET=[YOUR VERY SECRET KEY]
NODE_ENV=development
```

2. Install dependancies & run

```
yarn
yarn dev
```

3. Log yourself in via the graphql explorer on the adminLogin mutaion:

```
user: admin@admin.com
pass: abc123
```

### The Test

Your job now is to add categories to Tasks. Task categories must at least have :

1. a title and
2. a colour

You work will be complete when authenticated users are able to

1. CRUD (Create, Read, Update, Delete) Cateogories
2. Link a Tasks to a category

Extra Merit (non-essential)

3. Filter Tasks by category
4. Use the single category model to create a nested cateogries higherarchy (sub-categories)

We would like you to follow the existing strucutres for models and schema for this test but if you feel there is a better solution, you are free to demonstrate it.

Finally, please fork this repo and submit the link to your public repository from your account.

---

## Good Luck!
