import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ShopScreen from "../screens/ShopScreen";
import { NavigationContainer } from "@react-navigation/native";
import { Alert } from "react-native";

// Mock the Shop module
jest.mock("../data-structures/Shop", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getItems: () => [
        { getName: () => "Item 1", getPrice: () => 100 },
        { getName: () => "Item 2", getPrice: () => 200 },
      ],
    };
  });
});

// Mock the Alert module
jest.spyOn(Alert, "alert");

describe("ShopScreen", () => {
  it("opens the modal when a shop item is pressed", () => {
    const { getByText, queryByText } = render(
      <NavigationContainer>
        <ShopScreen />
      </NavigationContainer>
    );

    // Verify modal is not visible initially
    expect(queryByText("Buy Now")).toBeNull();

    // Simulate item press
    fireEvent.press(getByText("Item 1"));

    // Verify modal is now visible
    expect(getByText("Buy Now")).toBeTruthy();
  });

  it("shows an alert when the Buy Now button is pressed", () => {
    const { getByText } = render(
      <NavigationContainer>
        <ShopScreen />
      </NavigationContainer>
    );

    // Simulate item press to open modal
    fireEvent.press(getByText("Item 1"));

    // Simulate pressing the Buy Now button
    fireEvent.press(getByText("Buy Now"));

    // Verify that Alert.alert was called with the correct arguments
    expect(Alert.alert).toHaveBeenCalledWith(
      "Success",
      "Successfully purchased Item 1!"
    );
  });
});
