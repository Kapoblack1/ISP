import Start from '../pages/Start';
import Next from '../pages/Next';
import Login from '../pages/Login';
import Registro from '../pages/Registaro';
import Home from '../pages/Home';
import Achados from '../pages/Achados';
import Perdidos from '../pages/Perdidos';
import Devolvidos from '../pages/Devolvidos';
import Artigos from '../pages/Artigos';
import Adicionar from '../pages/Adicionar';
import Conta from '../pages/Conta';
import BottonTabs from './Tab'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default props => (

    <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen options={{headerShown: false, navigationBarColor: '#DABC1F', statusBarColor:'#DABC1F', statusBarStyle: "light"}} name='Start' component={Start}/>
        
        <Stack.Screen options={{headerShown: false, navigationBarColor: 'white', statusBarColor:'#DABC1F'}} name='Next' component={Next}/>
        
        <Stack.Screen options={{headerShown: false, navigationBarColor: 'white', statusBarColor:'#DABC1F'}} name='Login' component={Login}/>
        
        <Stack.Screen options={{title: 'Registar', navigationBarColor: 'white', headerTintColor: 'white', statusBarColor:'#DABC1F', headerStyle: {backgroundColor: '#DABC1F'}, headerTransparent: true}} name='Registro' component={Registro}/>
        
        <Stack.Screen options={{headerShown: false, statusBarColor:'white', statusBarStyle: "dark"}} name='Home' component={BottonTabs}/>
        
        <Stack.Screen options={{headerShown: false, statusBarColor:'white', statusBarStyle: "dark"}} name ="Perdidos" component={Perdidos}/>

        <Stack.Screen options={{headerShown: false, statusBarColor:'white', statusBarStyle: "dark"}} name ="Achados" component={Achados}/>

        <Stack.Screen options={{headerShown: false, statusBarColor:'white', statusBarStyle: "dark"}} name ="Devolvidos" component={Devolvidos}/>

        <Stack.Screen options={{title: 'Artigo', headerTransparent: true, statusBarColor:'white', statusBarStyle: "dark"}} name ="Artigos" component={Artigos}/>
    </Stack.Navigator>
)

export function HomeNavigator(){
    return(
        <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name='Home' component={Home}/>
        </Stack.Navigator>
    )
}

export function PerdidosNavigator(){
    return(
        <Stack.Navigator>
            <Stack.Screen name='Perdidos' component={Perdidos}/>
        </Stack.Navigator>
    )
}

export function AchadosNavigator(){
    return(
        <Stack.Navigator>
            <Stack.Screen name='Achados' component={Achados}/>
        </Stack.Navigator>
    )
}

export function DevolvidosNavigator(){
    return(
        <Stack.Navigator>
            <Stack.Screen name='Devolvidos' component={Devolvidos}/>
        </Stack.Navigator>
    )
}

export function ArtigosNavigator(){
    return(
        <Stack.Navigator>
            <Stack.Screen name='Artigos' component={Artigos}/>
        </Stack.Navigator>
    )
}

export function AdicionarNavigator(){
    return(
        <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name='Adicionar1' component={Adicionar}/>
        </Stack.Navigator>
    )
}

export function ContaNavigator(){
    return(
        <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name='Conta1' component={Conta}/>
        </Stack.Navigator>
    )
}