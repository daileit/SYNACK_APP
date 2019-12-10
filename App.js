
import React, { Component } from 'react';
import { Platform, StatusBar } from 'react-native';
import { AppStack } from './src/routers/screen'
// -- end --
import { nColors } from './src/styles/styles';
import { createAppContainer } from 'react-navigation';
import codePush from "react-native-code-push";
//---
import { Provider } from 'react-redux'
import store from './src/srcRedux/store'

//---


const prefix = 'app123123://';
const AppContainer = createAppContainer(AppStack);
class App extends Component {

	// -- Bắt xử kiên deep Link

	// handleOpenURL = (event) => { // D
	// 	Utils.nlog('DeepLink:', event);
	// 	// this.navigate(event.url);
	// }
	// componentDidMount() {
	// 	if (Platform.OS === 'android') {
	// 		Linking.getInitialURL().then(url => {
	// 			this.navigate(url);
	// 		});
	// 	} else {
	// 		Linking.addEventListener('url', this.handleOpenURL);
	// 	}
	// }
	// componentWillUnmount() {
	// 	Linking.removeListener('url', this.handleOpenURL);
	// }

	render() {
		return (
			<Provider store={store}>
				<AppContainer uriPrefix={prefix}
					ref={nav => {
						this.navigator = nav;
					}}>
					<StatusBar
						backgroundColor={nColors.main}
						barStyle="light-content"
						translucent={true}
					/>
				</AppContainer>
			</Provider>
			// <VisaHome />
			// <Home />
		);
	}
}

const codePushOptions = {
	checkFrequency: codePush.CheckFrequency.ON_APP_START,
	installMode: codePush.InstallMode.ON_NEXT_RESTART,
};

export default codePush(codePushOptions)(App);