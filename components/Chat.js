import { useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';

const Chat = ({ route, navigation }) => {
    const { name } = route.params;
    const { mode } = route.params;

    useEffect(() => {
        if (!name) {
            navigation.setOptions({ title: "Unnamed" });
        } else {
            navigation.setOptions({ title: name });
        }

        if (mode === "light") {
            navigation.setOptions({
                // statusBarColor: '#521073',
                headerStyle: {
                    backgroundColor: '#521073',
                },
                headerTintColor: '#fff'
            })
        } else {
            navigation.setOptions({
                // statusBarColor: '#fff',
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#521073'
            })
        }
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar
                // animated={true}
                backgroundColor={mode === "light" ? "#521073" : "white"}
                barStyle={mode === "light" ? "light-content" : "dark-content"}
            />
            <Text>Hello Screen2!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Chat;