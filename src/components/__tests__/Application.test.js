import React from "react";
import axios from '../../__mocks__/axios';

import { render, cleanup, fireEvent, prettyDOM, findByText, getByAltText, getAllByTestId, getByText, getByPlaceholderText, queryByText, findByAltText, queryByAltText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { findByText, queryByText } = render(<Application />);

    await findByText("Monday").then(() => {
    
    fireEvent.click(queryByText("Tuesday"));
    expect(queryByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  /**
   * Render the Application.
   * Wait until the text "Archie Cohen" is displayed.
   * Click the "Add" button on the first empty appointment.
   * Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
   * Click the first interviewer in the list.
   * Click the "Save" button on that same appointment.
   * Check that the element with the text "Saving" is displayed.
   * Wait until the element with the text "Lydia Miller-Jones" is displayed.
   * Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
   */

  it("loads data, books an interview, and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await findByText(container, "Archie Cohen");

    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter Student Name/i), {target: {value: "Lydia Miller-Jones"}});
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));


    expect(queryByText(appointment, "Saving")).toBeInTheDocument();

    await findByText(appointment, "Lydia Miller-Jones");

    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  })

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");
  
    // 3. Click the "Delete" button on the booked appointment.
    const appointments = getAllByTestId(container, "appointment");
    const bookedAppointment = appointments.find((appointment) => queryByText(appointment, "Archie Cohen"));
    // console.log(prettyDOM(bookedAppointment));
    fireEvent.click(queryByAltText(bookedAppointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(bookedAppointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(bookedAppointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(bookedAppointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await findByAltText(bookedAppointment, "Add");

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

  });

  it("loads data, edits an interview and the spots for Monday remain the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");
  
    // 3. Click the "Edit" button on the booked appointment.
    const appointments = getAllByTestId(container, "appointment");
    const bookedAppointment = appointments.find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(queryByAltText(bookedAppointment, "Edit"));

    // 4. Check that the Form component is shown (save button).
    expect(getByText(bookedAppointment, "Save"));

    // 5. Change the interviewees name to Bob Smith.
    fireEvent.change(getByPlaceholderText(bookedAppointment, /enter Student Name/i), {target: {value: "Bob Smith"}});

    // 6. Click the "Save" button.
    fireEvent.click(getByText(bookedAppointment, "Save"));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(bookedAppointment, "Saving")).toBeInTheDocument();

    // 8. Wait until the appointment with the "Bob Smith" is displayed.
    await findByText(bookedAppointment, "Bob Smith");

    // 9. Check that the DayListItem with the text "Monday" has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
    
    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 3. Click the "Add" button to book an appointment.
    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[0];
    
    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter interviees name, and select an interviewee
    fireEvent.change(getByPlaceholderText(appointment, /enter Student Name/i), {target: {value: "Lydia Miller-Jones"}});
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 5. Click Save button
    axios.put.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, "Save"))

    // 6. await the expected error message
    await findByText(appointment, "Error");

    expect(getByText(appointment, "Error")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();

     // 1. Render the Application.
     const { container, debug } = render(<Application />);
  
     // 2. Wait until the text "Archie Cohen" is displayed.
     await findByText(container, "Archie Cohen");
   
     // 3. Click the "Edit" button on the booked appointment.
     const appointments = getAllByTestId(container, "appointment");
     const bookedAppointment = appointments.find((appointment) => queryByText(appointment, "Archie Cohen"));
     fireEvent.click(queryByAltText(bookedAppointment, "Delete"));

     // 4. Click "confirm" button to confirm deletion
     fireEvent.click(getByText(bookedAppointment, "Confirm"))

     // 5. wait for error response (triggered by the axios call above)
     await findByText(bookedAppointment, "Error");

     expect(getByText(bookedAppointment, "Error")).toBeInTheDocument();

     debug();

  });



});
