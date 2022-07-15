/** @format */

import { fireEvent, render } from "@testing-library/react-native";
import Home from "../src/screens/Home";

jest.mock("@react-navigation/native", () => {
	return {
		useNavigation: () => ({
			navigate:jest.fn()
		}),
	};
});

describe("Home", () => {
	it("renders without crash", () => {
		render(<Home />);
	});

	it("matches snapshot", () => {
		const tree = render(<Home />);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it("has component with req TestId", () => {
		const tree = render(<Home />);
		expect(tree.findByTestId("home")).toBeTruthy();
	});

	it("has 2 children", () => {
		const tree = render(<Home />);
		//@ts-ignore
		expect(tree.toJSON().children.length).toBe(2);
		const textBox=tree.getByTestId("text");
		const buttonBox=tree.getByTestId("btn");
		fireEvent.changeText(textBox,{target:{value:"mystring"}});
		fireEvent.press(buttonBox);
	});

});
