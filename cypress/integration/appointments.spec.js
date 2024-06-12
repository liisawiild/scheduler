/**
 * BOOKING
 * 
 * Visits the root of our web server
 * Clicks on the "Add" button in the second appointment
 * Enters their name
 * Chooses an interviewer
 * Clicks the save button
 * Sees the booked appointment
 * 
 */

/**
 * EDITING
 * 
 * Visits the root of our web server
 * Clicks the edit button for the existing appointment
 * Changes the name and interviewer
 * Clicks the save button
 * Sees the edit to the appointment
 * 
 */

/** CANCELLING
 * 
 * Visits the root of our web server
 * Clicks the delete button for the existing appointment
 * Clicks the confirm button
 * Sees that the appointment slot is empty
 * 
 */


describe("Appointments" ,() => {

  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");

    cy.visit("/")
    .contains("Monday");
  })

  it("should book an interview", () => {
    cy.get("[alt='Add']")
    .first()
    .click();

    cy.get("[data-testid=student-name-input]")
    .type("Lydia Miller-Jones");

    cy.get("[alt='Sylvia Palmer']")
    .click();

    cy.contains("Save")
    .click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones", "Slyvia Palmer")

  })

  it("should edit an interview", () => {
    cy.get("[alt=Edit]")
    .first()
    .click({force: true});

    cy.get("[data-testid=student-name-input]")
    .clear()
    .type('Bob Smith');

    cy.get("[alt='Tori Malcolm']")
    .click();

    cy.contains("Save")
    .click();

    cy.contains(".appointment__card--show", "Bob Smith", "Tori Malcolm")

  })

  it("should cancel an interview", () => {
    cy.get("[alt=Delete]")
    .click({force: true});

    cy.contains("Confirm")
    .click();

    cy.contains("Deleting");

    cy.contains("Deleting").should("not.exist")

    cy.contains(".appointment__card--status", "Archie Cohen").should("not.exist");
  })

});



