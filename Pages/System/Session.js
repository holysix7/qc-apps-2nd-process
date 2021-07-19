import AsyncStorage from '@react-native-community/async-storage';

const Session = async(data) => {
    const item = [
        ['id', JSON.stringify(data.id)], 
        ['user', data.user], 
        ['name', data.name], 
        ['hrd_employee_id', JSON.stringify(data.hrd_employee_id)], 
        ['sys_department_id', JSON.stringify(data.sys_department_id)], 
        ['sys_plant_id', JSON.stringify(data.sys_plant_id)], 
        ['employee_image_id', JSON.stringify(data.employee_image_id)], 
        ['department_name', data.department_name],
        ['employee_image_base64', data.employee_image_base64],
        ['duty_plant_option_select', JSON.stringify(data.duty_plant_option_select)], 
        ['feature', JSON.stringify(data.feature)]
    ]
    console.log(item)
    try {
        await AsyncStorage.multiSet(item)
    } catch (error) {
        console.log(error)
    }
}

export default Session;