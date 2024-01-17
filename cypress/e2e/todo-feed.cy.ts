const BASE_URL = "http://localhost:3000";
describe("/ - Todo Feed", () => {
  it("when load, renders the page", () => {
    cy.visit(BASE_URL);
  });

  it("when create a new todo, it must appears in the screen", () => {
    cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "9eb723e6-a284-466e-b800-55ca8fdf3dc4",
            date: "2024-01-15T11:56:07.477Z",
            content: "Nova todo",
            done: false,
          },
        },
      });
    }).as("createTodo");
    // [x] - Open a page
    cy.visit(BASE_URL);
    // [x] - Select o input
    cy.get("input[name=add-todo]").type("Nova todo");
    // [x] - Digitar no input de criar um nova todo

    // [x] - click on button
    cy.get('[aria-label="Adicionar novo item"]').click();
    // [x] - Check if has new element
    cy.contains("Nova todo");
  });
});
