import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Text, TouchableOpacity, Alert, View, StyleSheet, Modal, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [Tareas, setTareas] = useState([]);
  const [InputTarea, setInputTareas] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  /*
  Esta se fija si hay alguna tarea ya cargada en el local storage.
  En Native se llama AsyncStorage.
  En el caso de que haya las transforma en texto y las pone en el setTareas.
  Lo que actualiza el Tareas para que la proxima vez que abra la app vea las app ya cargadas.
  Se ejecuta 1 vez nomas.
  */
  useEffect(() => {
    const cargarTareas = async () => {
      const guardarTareas = await AsyncStorage.getItem('Tareas');
      if (guardarTareas) {
        setTareas(JSON.parse(guardarTareas));
      }
    };

    cargarTareas();
  }, []);
/*
Esta es para agregar las tareas que guarde el usestate al local storage
Se ejecuta cada vez que cambia Tareas, osea que cada vez que agregan una tarea.
*/
  useEffect(() => {
    const guardarTareas = async () => {
      await AsyncStorage.setItem('Tareas', JSON.stringify(Tareas));
    };

    guardarTareas();
  }, [Tareas]);

  /*
  Esta funcion agrega una tarea nueva.
  Primero hace que en el caso que apretes agregar tarea sin poner nada salte una alerta.
  Despues crea el objeto de la tarea nueva y los valores que necesita.
  Por ultimo actualiza los stados.
  Tareas: transforma las tareas guardas en; las que ya estaban, agregando la nueva.
  InputTareas: Este lo reinicia para que la proxima tarea que quiera agregar pueda hacerlo como si fuese la primera.
  ModalVisible: Vuelve a cambiar la visibilidad a falso.
  */
  const agregarTarea = () => {
    if (InputTarea.trim() === '') {
      Alert.alert('Por favor ingrese una tarea');
      return;
    }

    const nuevaTarea = {
      id: Math.random().toString(),
      title: InputTarea,
      completed: false,
    };
    setTareas([...Tareas, nuevaTarea]);
    setInputTareas('');
    setModalVisible(false);
  };
/*
El map busca en Tareas el id que trae, si lo encuentra hace que lo que estaba puesto en el completed cambie
Si estaba true, porque ya estaba completa lo cambia a false y sino al reves.
*/
  const completarTarea = (id) => {
    setTareas(
      Tareas.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTareas(Tareas.filter(task => task.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={Tareas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.item, item.completed && styles.completedItem]}>
              <Text>{item.title}</Text>
              <View style={styles.itemButtons}>
                <Button title="Completar" onPress={() => completarTarea(item.id)} />
                <Button title="Eliminar" onPress={() => deleteTask(item.id)} />
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Agregar Tarea</Text>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Nombre de la tarea"
              style={styles.input}
              value={InputTarea}
              onChangeText={setInputTareas}
            />
            <Button title="Guardar" onPress={agregarTarea} />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    width: '100%',
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  item: {
    width: '100%',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedItem: {
    backgroundColor: '#d3ffd3',
  },
  itemButtons: {
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
});

export default App;
