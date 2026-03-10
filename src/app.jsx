import React from "react";
import {Box, Text} from "ink";

import Header from "./components/Header.jsx";
import Portrait from "./components/Portrait.jsx";
import Menu from "./components/Menu.jsx";

const Section = ({title, children}) => (
	<Box flexDirection="column" marginTop={1}>
		<Text bold color="cyan">
			{title}
		</Text>
		<Box flexDirection="column" marginLeft={2} marginTop={0}>
			{children}
		</Box>
	</Box>
);

const Bullet = ({children}) => (
	<Text>
		<Text color="magenta">• </Text>
		{children}
	</Text>
);

export default function App() {
	return (
		<Box flexDirection="column" paddingX={1}>
			<Box flexDirection="row" gap={2}>
				{/* Left */}
				<Box width="50%" flexDirection="column">
					<Portrait />
				</Box>

				{/* Right */}
				<Box width="50%" flexDirection="column">
					<Header />

					<Box marginTop={1}>
						<Text>
							<Text dimColor>Meet </Text>
							<Text bold color="green">
								Syed Mehdi Hussain
							</Text>
							<Text dimColor> AKA </Text>
							<Text bold color="yellow">
								Mehdi Kazmi
							</Text>
							<Text dimColor>
								. Developer, researcher, tech explorer and 
								a multipotentialite as expected    
							</Text>
							<Text bold color="white">
								 
								. Email: m21gits@gmail.com
							</Text>
						</Text>
					</Box>

					<Section title="What does he do?">
						<Bullet>He plays. (With many things iykyk)</Bullet>
					</Section>

					<Section title="Is he cool?">
						<Bullet>
							Eh “is he cool?” bitch he is the word cool
						</Bullet>
					</Section>

					<Section title="Special skill?">
						<Bullet>He can create anything with anything.</Bullet>
						<Bullet>He can follow tutorial and make tutorial.</Bullet>
						<Bullet>Complex linux BS? It’s a random Sunday for him.</Bullet>
						<Bullet>Some people say “he is better than PewDiePie”.</Bullet>
					</Section>

					<Section title="So what can’t he do?">
						<Bullet>
							wellllll, there is something……MATH  <Text color="red" bold>FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHH</Text>
						</Bullet>
					</Section>
				</Box>
			</Box>

			<Box marginTop={1}>
				<Menu />
			</Box>
		</Box>
	);
}
