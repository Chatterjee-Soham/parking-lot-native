/** @format */

import { fireEvent, render } from "@testing-library/react-native";
import Lots from "../src/screens/Lots";

jest.mock("@react-navigation/native", () => {
	return {
		useNavigation: jest.fn(),
	};
});

const route = {
	params: {
		lots: 2,
	},
};

describe("Lots", () => {
	it("renders without crash", () => {
		render(<Lots route={route} />);
	});

	it("matches snapshot", () => {
		const tree = render(<Lots route={route} />);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it("has component with req TestId", () => {
		const tree = render(<Lots route={route} />);
		expect(tree.findByTestId("lots")).toBeTruthy();
		
	});

	it("has 3 children", () => {
		const tree = render(<Lots route={route} />);
		//@ts-ignore
		expect(tree.toJSON().children.length).toBe(3);
		const textBox=tree.getByTestId("lotstext");
		fireEvent.changeText(textBox,{target:{value:"mystring"}});
		const buttonBox=tree.getByTestId("btnlots");
		fireEvent.press(buttonBox);
		const cancelbutton = tree.getByTestId("cancelbtn");
		fireEvent.press(cancelbutton);
		const removebutton = tree.getByTestId("removebtn");
		fireEvent.press(removebutton);
		const cancel2button = tree.getByTestId("cancel2btn");
		fireEvent.press(cancel2button);
		const touch = tree.getByTestId("handletouch");
		fireEvent.press(touch);
		const someBtn = tree.getByTestId("touchevent");
		fireEvent.press(someBtn);

		
	});

	
});
