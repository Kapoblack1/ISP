import { AntDesign, Feather } from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeNavigator, AdicionarNavigator, ContaNavigator} from './Stack';

const Tab = createBottomTabNavigator();

export default function BottonTabs(){
    
    return(
        <Tab.Navigator>
            <Tab.Screen options={{tabBarIcon: () => {return <Feather name='home' size={25} color='#DABC1F'/>}, headerShown: false, title: 'Inicio', headerShown: false}} name='HomeTab' component={HomeNavigator}/>
            <Tab.Screen options={{tabBarIcon: () => {return <AntDesign name='pluscircleo' size={25} color='#DABC1F'/>}, headerTitle: 'Adicionar artigo', headerTitleAlign: 'center'}} name='Adicionar' component={AdicionarNavigator}/>
            <Tab.Screen options={{tabBarIcon: () => {return <AntDesign name='user' size={25} color='#DABC1F'/>}, headerShown: false, headerShown: false}} name='Conta' component={ContaNavigator}/>
        </Tab.Navigator>
    )
}