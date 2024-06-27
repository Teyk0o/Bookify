import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SearchScreen from '../screens/SearchScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import RandomBookScreen from '../screens/RandomBookScreen';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from "../../colors";

const Tab = createBottomTabNavigator();

function CustomTabBarButton({ children, onPress }) {
    return (
        <TouchableOpacity
            style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onPress={onPress}
        >
            <View style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: colors.primary
            }}>
                {children}
            </View>
        </TouchableOpacity>
    );
}

export default function Navbar() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === 'Search') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'Notifications') {
                        iconName = focused ? 'notifications' : 'notifications-outline';
                    } else if (route.name === 'RandomBook') {
                        iconName = 'book';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarStyle: styles.navbar,
                tabBarShowLabel: false, // Enlever les textes
                tabBarActiveTintColor: '#000', // Couleur des icônes sélectionnées
                tabBarInactiveTintColor: 'gray', // Couleur des icônes non sélectionnées
                headerShown: false, // Enlever le titre en haut des pages
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen
                name="RandomBook"
                component={RandomBookScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="book" size={30} color="#fff" />
                    ),
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} />
                    ),
                }}
            />
            <Tab.Screen name="Notifications" component={NotificationsScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    navbar: {
        height: 120,
        borderTopColor: 'rgba(240, 240, 240, 1)',
        borderTopWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 1)',
    }
});
